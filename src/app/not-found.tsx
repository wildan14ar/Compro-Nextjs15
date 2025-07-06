import React from 'react';

export default function NotFound() {

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">
        Oops! Halaman yang Anda cari tidak ditemukan.
      </p>
      <button
        onClick={handleHomeClick}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Home
      </button>

      {/* Konten tambahan */}
      <div className="mt-8 text-center">
        <p className="text-lg">
          Kami minta maaf atas ketidaknyamanan ini.
        </p>
        <p className="text-lg">
          Jika Anda memerlukan bantuan lebih lanjut, silakan hubungi tim support kami.
        </p>
      </div>
    </div>
  );
}
