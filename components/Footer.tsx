import React from 'react'

import {Brain} from "lucide-react";

function Footer() {
  return (
    <div>
         <footer className="relative bg-zinc-950 backdrop-blur-sm border-t border-emerald-950">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="h-8 w-8 text-emerald-400" />
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 bg-clip-text text-transparent">
                <span className='text-green-300'>Q</span>
                champ
              </span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                The ultimate multiplayer brain battle platform
              </p>
            </div>

            {[
              {
                title: 'Games',
                links: [
                  { name: 'Math Battle', href: '/games/math' },
                  { name: 'Quiz Battle', href: '/games/quiz' },
                  { name: 'How It Works', href: '/how-it-works' }
                ]
              },
              {
                title: 'Support',
                links: [
                  { name: 'Help Center', href: '/help' },
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'FAQ', href: '/faq' }
                ]
              },
              {
                title: 'Legal',
                links: [
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Fair Play', href: '/fair-play' }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-bold text-lg mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.href} 
                        className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 text-base"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-emerald-950 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-base">
              &copy; 2024 Qchamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer