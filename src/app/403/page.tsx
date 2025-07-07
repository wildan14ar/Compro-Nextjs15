// src/app/403/page.tsx

import Link from 'next/link'

export default function Page403() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! Anda tidak memiliki akses ke halaman ini.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
