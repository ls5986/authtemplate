'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Unauthorized() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        
        if (user) {
          setEmail(user.email)
        }
      } catch (error) {
        console.error('Error getting user:', error)
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">⛔ Access Denied</h1>
          <p className="mt-2 text-gray-600">
            Sorry, your account ({email}) does not have permission to access this area.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
          
          <Link href="/login" className="w-full px-4 py-2 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
