import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-leaf-grad text-white">
        <Leaf size={28} />
      </div>
      <h1 className="font-display text-4xl font-semibold text-forest-950 mb-3">404</h1>
      <p className="text-forest-700/80 mb-8">
        This page must have decomposed. Let us get you back to solid ground.
      </p>
      <Link to="/" className="btn-primary">
        Back to home <ArrowRight size={17} />
      </Link>
    </div>
  )
}
