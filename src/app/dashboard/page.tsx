'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getProfile() {
      try {
        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)
        
        // Get user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          
        if (error) throw error
        if (data) setRole(data.role)
        
      } catch (error) {
        console.error('Error loading user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold">Welcome!</h2>
          <p className="mt-2">Email: {user?.email}</p>
          <p className="mt-2">Your role: <span className="font-bold">{role || 'Not assigned'}</span></p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
