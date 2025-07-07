'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByName } from '@/feature/userSlice';
import { RootState, AppDispatch } from '@/app/store';
import Link from 'next/link';

export default function UserInfoPage() {
  const { userName } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (typeof userName === 'string') {
      dispatch(fetchUserByName(userName));
    }
  }, [dispatch, userName]);

  const user = items.find(u => u.userName === userName);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{user.fullName}</h1>
      <p className="mb-1"><strong>Username:</strong> {user.userName}</p>
      <p className="mb-1"><strong>Email:</strong> {user.email}</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Profile</h2>
      <Link href="/users" className="mt-4 inline-block text-blue-600 hover:underline">
        &larr; Back to user list
      </Link>
    </div>
  );
}
