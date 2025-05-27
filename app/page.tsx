import Link from "next/link";


export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex flex-col items-center justify-center p-6">
      
      {/* Logo / Title */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Muhamash Ai assistant
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Created with Next.js, Tailwind CSS, Typescript and Go
        </p>
      </header>

      {/* Glass Cards Container */}
      <div
        className="bg-black/30 backdrop-blur-xl rounded-2xl border border-black/50 p-6 flex flex-col items-center text-center text-gray-100 shadow-2xl hover:scale-105 transition-transform"
      >
            
        <h2 className="text-2xl font-semibold mb-2">Your AI</h2>
        <p className="text-sm text-gray-300">
          Do whatever you want with your AI assistant.
        </p>
        <Link href={'/conversation'} className="mt-4 px-4 py-2 bg-green-600 hover:bg-white/20 rounded-full text-sm font-medium text-gray-100 transition">
          Chat Now
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        © 2025 Dark Md Ashraful Alam and Rana Mahmud. All rights reserved.
      </footer>
    </div>
  );
}
