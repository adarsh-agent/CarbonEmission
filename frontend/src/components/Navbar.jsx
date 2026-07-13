import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tips', label: 'Sustainability Tips' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="glass-card flex items-center justify-between px-5 py-3">
          <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-grad text-white shadow-card group-hover:scale-105 transition-transform">
              <Leaf size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-semibold text-forest-900">CarbonCheck</span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-900 text-white'
                      : 'text-forest-800 hover:bg-forest-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <NavLink to="/calculator" className="hidden lg:inline-flex btn-primary !px-5 !py-2.5 text-sm">
            Check my footprint
          </NavLink>

          <button
            className="lg:hidden p-2 rounded-full hover:bg-forest-50 text-forest-900"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden glass-card mt-2 p-4 flex flex-col gap-1"
            >
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-2xl text-sm font-medium ${
                      isActive ? 'bg-forest-900 text-white' : 'text-forest-800 hover:bg-forest-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/calculator"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 text-sm"
              >
                Check my footprint
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
