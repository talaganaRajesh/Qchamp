import React from 'react'
import { Brain } from "lucide-react"


function NavBar() {

   

  return (
    <div>
        <header className=" w-full z-50 fixed backdrop-blur-sm bg-transparent">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <a
            href='/'
             className="flex items-center space-x-3 transition-all duration-700 translate-x-0 opacity-100">
              <div className="relative">
                <Brain className="h-10 w-10 text-emerald-400" />
                
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 bg-clip-text text-transparent">
                <span className='text-green-300'>Q</span>
                champ
              </span>
            </a>
            <div className="flex items-center space-x-4 transition-all duration-700 delay-200 translate-x-0 opacity-100">
              <a 
                href='/login'
                className=" p-2 bg-transparent text-slate-300 hover:text-emerald-500 hover:border-emerald-400 transition-all duration-300"
              >
                Login
              </a>
              <a 
              href='/signup'
              className=" border py-1 px-4 rounded-sm border-green-900 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                Sign Up
              </a>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default NavBar