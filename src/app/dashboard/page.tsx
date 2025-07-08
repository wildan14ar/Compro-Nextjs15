"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByName } from "@/feature/userSlice";
import { RootState, AppDispatch } from "@/app/store";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  // Ambil data user sekali ketika session.user.name tersedia
  useEffect(() => {
    const userName = session?.user?.name;
    if (typeof userName === "string") {
      dispatch(fetchUserByName(userName));
    }
  }, [dispatch, session?.user?.name]);

  // Tunggu NextAuth memastikan status session
  if (status === "loading") {
    return <p>Checking authentication…</p>;
  }
  if (!session) {
    return <p>Anda belum login.</p>;
  }

  // Cari data user yang sudah di-fetch
  const currentUser = items.find((u) => u.userName === session.user.name);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!currentUser) return <p>User tidak ditemukan.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="flex flex-row justify-start space-x-5">
        <div className="flex flex-col items-center md:flex-row md:items-start bg-white shadow-lg rounded-2xl p-8">
          <div className="relative w-32 h-32 mb-6 md:mb-0 md:mr-6">
            <Image
              src={currentUser.profile?.avatarUrl ?? "/icon.png"}
              alt="Avatar"
              className="rounded-full border-4 border-indigo-500"
              fill
              sizes="(max-width: 768px) 128px, 256px"
            />
          </div>
          <div className="text-center md:text-left">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">
                {currentUser.fullName}
              </h1>
              <p className="text-indigo-500 text-lg mb-4">
                @{currentUser.userName}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="text-sm uppercase text-black-500 font-bold">
                Email:
              </h2>
              <p className="font-medium text-gray-700">{currentUser.email}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:flex-row md:items-start bg-white shadow-lg rounded-2xl p-8 min-w-xl">
          <label htmlFor="bio">Bio:</label>
          <p>{currentUser.profile?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
