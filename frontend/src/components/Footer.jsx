import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-forest-100 bg-forest-950 text-forest-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-grad text-white">
              <Leaf size={18} />
            </span>
            <span className="font-display text-xl font-semibold text-white">CarbonCheck</span>
          </div>
          <p className="text-sm text-forest-200/80 max-w-sm leading-relaxed">
            An AI-powered carbon footprint calculator built to help everyday choices add up
            to real climate impact — one household at a time.
          </p>
          <p className="text-xs font-mono text-forest-300/60 mt-6">
            Built in support of UN SDG 7, 11, 12 &amp; 13.
          </p>
        </div>

        <div>
          <h4 className="section-label !text-forest-300 mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white transition-colors" to="/calculator">Calculator</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/dashboard">Dashboard</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/tips">Sustainability Tips</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="section-label !text-forest-300 mb-4">Project</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white transition-colors" to="/contact">Contact us</Link></li>
            <li>
              <a className="hover:text-white transition-colors inline-flex items-center gap-1.5" href="#">
                <Github size={14} /> Source code
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors inline-flex items-center gap-1.5" href="mailto:hello@carboncheck.app">
                <Mail size={14} /> hello@carboncheck.app
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-forest-300/60">
        © {new Date().getFullYear()} CarbonCheck. A college capstone project for climate awareness.
      </div>
    </footer>
  )
}
