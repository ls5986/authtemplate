'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
        if (data.session) {
          // Check profile completeness
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name,last_name,birthday,role')
            .eq('id', data.session.user.id)
            .single()
          if (!profile || !profile.first_name || !profile.last_name || !profile.birthday || !profile.role) {
            router.push('/complete-profile')
          } else {
            router.push('/dashboard')
          }
        }
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session)
            if (event === 'SIGNED_IN' && session) {
              // Check profile completeness after Google or email login
              const { data: profile } = await supabase
                .from('profiles')
                .select('first_name,last_name,birthday,role')
                .eq('id', session.user.id)
                .single()
              if (!profile || !profile.first_name || !profile.last_name || !profile.birthday || !profile.role) {
                toast.success('Authenticated! Complete your profile.')
                router.push('/complete-profile')
              } else {
                toast.success('Authentication successful')
                router.push('/dashboard')
              }
            }
          }
        )
        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error checking auth session:', error)
        toast.error('Authentication error')
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/dashboard`}
        />
      </div>
    </div>
  )
}
