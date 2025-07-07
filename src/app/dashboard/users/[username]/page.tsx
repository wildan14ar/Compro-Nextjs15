// app/users/[id]/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser, updateUser } from '@/feature/userSlice'
import { RootState, AppDispatch } from '@/app/store'

interface FormState {
  userName: string
  fullName: string
  email: string
}

interface PageProps {
  params: { username: string }
}

export default function UserDetailPage({ params }: PageProps) {
  const { username } = params
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { items, loading, error } = useSelector((state: RootState) => state.user)
  const [form, setForm] = useState<FormState>({ userName: '', fullName: '', email: '' })

  useEffect(() => {
    if (!items.length) dispatch(fetchUser())
  }, [dispatch, items.length])

  useEffect(() => {
    const user = items.find(u => u.userName === username || u.userName === username)
    if (user) {
      setForm({
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
      })
    }
  }, [username, items])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = items.find(u => u.userName === username)
    if (!user) return
    await dispatch(updateUser({ id: user.id, ...form }))
    router.push('/users')
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perbarui User</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Username</label>
          <input
            name="userName"
            value={form.userName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Nama Lengkap</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Simpan
        </button>
      </form>
    </div>
  )
}
