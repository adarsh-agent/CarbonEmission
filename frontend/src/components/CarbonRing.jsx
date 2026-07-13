import React from 'react'
import { motion } from 'framer-motion'

/**
 * CarbonRing — the app's signature visual element.
 * An animated circular arc gauge that fills according to `percent` (0-100),
 * colored by carbon category. Used on the Hero, Result and Dashboard pages
 * so the same "at a glance" reading recurs throughout the product.
 */
const CATEGORY_COLORS = {
  Low: '#2f9e44',
  Medium: '#e8a33d',
  High: '#c94b32',
}

export default function CarbonRing({
  percent = 60,
  category = 'Medium',
  label,
  sublabel,
  size = 220,
  strokeWidth = 16,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, percent))
  const offset = circumference - (clamped / 100) * circumference
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Medium

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e6f6ea"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {label && (
          <span className="font-display text-3xl font-semibold text-forest-900">{label}</span>
        )}
        {sublabel && (
          <span className="text-xs font-mono uppercase tracking-wider text-forest-500 mt-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
