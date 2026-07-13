import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  Car, Zap, Leaf, Wind, Sun, Lightbulb, Recycle, TreePine, Droplet, Bus, Plane, ArrowRight, LayoutDashboard,
} from 'lucide-react'
import CarbonRing from '../components/CarbonRing.jsx'
import { useCarbon } from '../context/CarbonContext.jsx'

const ICONS = { car: Car, plane: Plane, bus: Bus, wind: Wind, bulb: Lightbulb, sun: Sun, leaf: Leaf, recycle: Recycle, tree: TreePine, droplet: Droplet }

const COLORS = ['#2f9e44', '#e8a33d', '#0b3d2e']

const CATEGORY_COPY = {
  Low: { headline: "You're already in great shape.", tone: 'Keep reinforcing these habits — small optimizations will take you further.' },
  Medium: { headline: 'Room to improve, and it is within reach.', tone: 'A few targeted changes below could shift you into the Low band.' },
  High: { headline: 'Let us bring this down together.', tone: 'Start with the highest-impact category first — it moves the needle fastest.' },
}

export default function Result() {
  const { lastResult } = useCarbon()

  if (!lastResult) {
    return <Navigate to="/calculator" replace />
  }

  const { category, confidence, breakdown, suggestions } = lastResult
  const copy = CATEGORY_COPY[category] || CATEGORY_COPY.Medium

  const pieData = [
    { name: 'Transportation', value: breakdown.transportation },
    { name: 'Electricity', value: breakdown.electricity },
    { name: 'Lifestyle', value: breakdown.lifestyle },
  ]

  const percentForRing = category === 'Low' ? 30 : category === 'Medium' ? 62 : 90

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="section-label">Your result</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
          {copy.headline}
        </h1>
        <p className="text-forest-700/80 mt-3 max-w-xl mx-auto">{copy.tone}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        {/* Ring + category */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-8 flex flex-col items-center justify-center text-center"
        >
          <CarbonRing percent={percentForRing} category={category} label={category} sublabel="carbon band" size={200} />
          <div className="mt-6">
            <div className="font-mono text-2xl font-semibold text-forest-900">{breakdown.total} kg</div>
            <div className="text-xs uppercase tracking-wide text-forest-500 mt-1">Estimated CO₂ / month</div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint-100 text-forest-700 text-xs font-mono font-semibold px-3 py-1.5">
            {Math.round(confidence * 100)}% model confidence
          </div>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-3 glass-card p-8"
        >
          <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">Emission breakdown</h3>
          <div className="grid sm:grid-cols-2 gap-4 items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toFixed(1)} kg`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-forest-800">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {entry.name}
                  </span>
                  <span className="font-mono font-semibold text-forest-900">{entry.value.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-semibold text-forest-900">Personalized suggestions</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {suggestions.map((tip, i) => {
            const Icon = ICONS[tip.icon] || Leaf
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="solid-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-forest-700 mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="font-display font-semibold text-forest-900 mb-1.5">{tip.title}</h4>
                <p className="text-sm text-forest-700/80 leading-relaxed">{tip.detail}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/dashboard" className="btn-primary">
          <LayoutDashboard size={17} /> View full dashboard
        </Link>
        <Link to="/calculator" className="btn-secondary">
          Recalculate <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  )
}
