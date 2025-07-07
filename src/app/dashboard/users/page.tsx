// app/users/page.tsx
'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from '@/feature/userSlice'
import { RootState, AppDispatch } from '@/app/store'

export default function UserListPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  if (loading) return <p>Loading users...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar User</h1>
      <ul className="space-y-2">
        {items.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <span className="text-blue-600 hover:underline">
                {user.fullName} ({user.userName})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
