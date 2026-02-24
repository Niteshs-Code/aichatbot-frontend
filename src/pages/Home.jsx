import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
  <div className="relative min-h-screen bg-[#050816] text-white overflow-hidden">

    {/* Animated Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#111827] animate-pulse"></div>

    {/* Floating Glow Orbs */}
    <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[180px] top-[-150px] left-[-100px] animate-[float_8s_ease-in-out_infinite]"></div>
    <div className="absolute w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[150px] bottom-[-100px] right-[-100px] animate-[float_10s_ease-in-out_infinite]"></div>

    {/* Navbar */}
    <nav className="relative z-10 flex justify-between items-center px-6 md:px-20 py-6 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-3">
      
        <span className="text-xl font-semibold">
          Zento <span className="text-blue-400">AI</span>
        </span>
      </div>

      <div className="flex gap-4">
        <Link to='/login' className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
          Login
        </Link>
        <Link to='/Register' className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 hover:scale-105 transition">
          Sign In
        </Link>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 md:px-20 py-24 gap-16">

      {/* Left Text */}
      <div className="max-w-xl text-center lg:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
          Welcome to the Future of AI Conversations
        </h1>

        <p className="mt-6 text-gray-400 text-lg">
          Experience smarter interactions, creative problem-solving,
          and lightning-fast productivity powered by next-gen AI.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link to='/register' className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/40 hover:scale-105 transition text-lg">
            Get Started
          </Link>
          <button className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition text-lg">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Animated Card */}
      <div className="relative w-full max-w-lg flex justify-center">

        <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>

        <div className="relative w-80 h-80 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
          <span className="text-7xl font-bold text-blue-400">AI</span>
        </div>
      </div>
    </section>

    {/* Feature Section (fills desktop) */}
    <section className="relative z-10 grid md:grid-cols-3 gap-8 px-6 md:px-20 pb-24">

      {["Smart Replies", "Fast Processing", "Secure & Private"].map((item, i) => (
        <div
          key={i}
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition"
        >
            
            <div className="pointer-events-none absolute inset-0">
    <div className="shine"></div>
  </div>
          <h3 className="text-xl font-semibold text-blue-400">{item}</h3>
          <p className="text-gray-400 mt-4">
            Powerful AI technology designed to enhance productivity
            and simplify your digital life.
          </p>
        </div>
      ))}
    </section>

    {/* Footer */}
    <footer className="relative z-10 border-t border-white/10 py-10 px-6 md:px-20 bg-white/5 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">

        <div>
          <h2 className="text-lg font-semibold">
            Zento <span className="text-blue-400">AI</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            © {new Date().getFullYear()} Zento AI. All rights reserved.
          </p>
        </div>

        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>

      </div>
    </footer>

  
    

  </div>
);
}

export default Home
