'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CompleteProfile() {
  const router = useRouter()
  const [form, setForm] = useState({ first_name: '', last_name: '', birthday: '', role: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Optionally, fetch current profile to prefill
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('first_name,last_name,birthday,role')
        .eq('id', session.user.id)
        .single()
      if (data) setForm({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        birthday: data.birthday || '',
        role: data.role || ''
      })
    }
    fetchProfile()
  }, [router])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Not authenticated')
      router.push('/login')
      return
    }
    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', session.user.id)
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Profile updated!')
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto py-8 space-y-4">
      <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
      {['first_name','last_name','birthday','role'].map((name) => (
        <input
          key={name}
          name={name}
          type={name==='birthday'?'date':'text'}
          placeholder={name.replace('_',' ')}
          required
          value={form[name]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
