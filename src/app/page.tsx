export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Compro Next.js
      </h1>
      <p className="text-lg text-center">
        This is a sample application built with Next.js, Prisma, and Tailwind CSS.
      </p>
      <div className="flex flex-col items-center space-y-4">
        <a
          href="/about"
          className="btn btn-primary"
        >
          Learn More
        </a>
        <a
          href="/contact"
          className="btn btn-secondary"
        >
          Contact Us
        </a>
      </div>

    </div>
  );
}
