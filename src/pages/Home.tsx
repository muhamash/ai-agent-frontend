import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* <Head>
        <title>Welcome to AIVault</title>
        <meta name="description" content="AI-powered tools to supercharge your productivity" />
      </Head> */}

      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center px-6">
        
        {/* Animated Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text mb-4">
            Welcome to AI Assistant
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6">
            Your AI-powered assistant for research, productivity, and creativity.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Link to={'/chat'} className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-medium">
              Get Started
            </Link>
            {/* <button className="px-6 py-3 rounded-lg border border-slate-400 hover:border-white text-slate-200 hover:text-white transition">
              Learn More
            </button> */}
          </div>
        </motion.div>

        {/* Decorative Orbs */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute w-72 h-72 bg-purple-500/20 top-10 left-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute w-96 h-96 bg-cyan-400/20 bottom-20 right-10 rounded-full blur-3xl animate-float-slow"></div>
        </div>
      </div>
    </>
  );
}
