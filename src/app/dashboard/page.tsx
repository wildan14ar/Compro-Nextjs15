"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByName } from "@/feature/userSlice";
import { RootState, AppDispatch } from "@/app/store";

const DashboardPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (typeof session?.user?.name === "string") {
      dispatch(fetchUserByName(session.user.name));
    }
  }, [dispatch, ]);

  const user = items.find(u => u.userName === session?.user.name);
  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="relative w-32 h-32 mb-6 md:mb-0 md:mr-6">
            <img
              src={user?.profile?.avatarUrl || "/public/icon.png"}
              alt="Avatar"
              className="rounded-full border-4 border-indigo-500"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800">
              {user?.fullName}
            </h1>
            <p className="text-indigo-500 text-lg mb-4">@{user?.userName}</p>
            <div className="space-y-2">
              <div>
                <h2 className="text-sm uppercase text-gray-500">Email</h2>
                <p className="font-medium text-gray-700">{user?.email}</p>
              </div>
              <div>
                <h2 className="text-sm uppercase text-gray-500">Bio</h2>
                <p className="text-gray-600">
                  {user?.profile?.bio || "No bio available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
