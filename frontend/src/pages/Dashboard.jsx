import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, LineChart, Line, Legend,
} from 'recharts'
import { Car, Zap, Sprout, ArrowRight } from 'lucide-react'
import CarbonRing from '../components/CarbonRing.jsx'
import { useCarbon } from '../context/CarbonContext.jsx'
import { getHistory } from '../api/client.js'

const COLORS = ['#2f9e44', '#e8a33d', '#0b3d2e']

export default function Dashboard() {
  const { lastResult } = useCarbon()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    getHistory(12)
      .then(setHistory)
      .catch(() => setErr('Could not load history from the API. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  if (!lastResult && history.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-semibold text-forest-950 mb-4">No data yet</h1>
        <p className="text-forest-700/80 mb-8">
          Run your first calculation to see your personal dashboard come to life.
        </p>
        <Link to="/calculator" className="btn-primary">
          Calculate my footprint <ArrowRight size={17} />
        </Link>
      </div>
    )
  }

  const breakdown = lastResult?.breakdown
  const category = lastResult?.category || 'Medium'
  const confidence = lastResult?.confidence || 0

  const pieData = breakdown ? [
    { name: 'Transportation', value: breakdown.transportation },
    { name: 'Electricity', value: breakdown.electricity },
    { name: 'Lifestyle', value: breakdown.lifestyle },
  ] : []

  const barData = breakdown ? [
    { category: 'Transportation', kg: breakdown.transportation },
    { category: 'Electricity', kg: breakdown.electricity },
    { category: 'Lifestyle', kg: breakdown.lifestyle },
  ] : []

  const historyChartData = history.map((h, i) => ({
    label: h.name || `#${i + 1}`,
    Transportation: h.transportation_kg,
    Electricity: h.electricity_kg,
    Lifestyle: h.lifestyle_kg,
    Total: h.total_kg,
  }))

  const percentForRing = category === 'Low' ? 30 : category === 'Medium' ? 62 : 90

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <span className="section-label">Your dashboard</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
          Full emissions overview
        </h1>
        <p className="text-forest-700/80 mt-3 max-w-xl">
          Everything from your latest calculation and prior check-ins, in one place.
        </p>
      </div>

      {err && (
        <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
          {err}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6 mb-10">
        {/* Total score */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 glass-card p-6 flex flex-col items-center text-center">
          <CarbonRing
            percent={breakdown ? percentForRing : 0}
            category={category}
            label={breakdown ? category : '—'}
            sublabel="carbon score"
            size={160}
            strokeWidth={12}
          />
          {breakdown && (
            <>
              <div className="mt-5 font-mono text-xl font-semibold text-forest-900">{breakdown.total} kg</div>
              <div className="text-xs uppercase tracking-wide text-forest-500">CO₂ this month</div>
              <div className="mt-3 text-xs font-mono text-forest-500">{Math.round(confidence * 100)}% confidence</div>
            </>
          )}
        </motion.div>

        {/* Category mini cards */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
          {[
            { icon: Car, label: 'Transportation', value: breakdown?.transportation, color: 'bg-forest-500' },
            { icon: Zap, label: 'Electricity', value: breakdown?.electricity, color: 'bg-amber-400' },
            { icon: Sprout, label: 'Lifestyle', value: breakdown?.lifestyle, color: 'bg-forest-900' },
          ].map((c) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="solid-card p-6">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white mb-4 ${c.color}`}>
                <c.icon size={18} />
              </div>
              <div className="font-mono text-2xl font-semibold text-forest-900">{c.value ?? '—'} kg</div>
              <div className="text-xs uppercase tracking-wide text-forest-500 mt-1">{c.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pie + Bar */}
      {breakdown && (
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">Breakdown share</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toFixed(1)} kg`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">Category comparison</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f6ea" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v.toFixed(1)} kg`} />
                <Bar dataKey="kg" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Monthly comparison */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-8">
        <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">History comparison</h3>
        {historyChartData.length === 0 ? (
          <p className="text-sm text-forest-700/70">
            No history yet — each calculation you run is saved here automatically.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f6ea" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v.toFixed(1)} kg`} />
              <Legend />
              <Line type="monotone" dataKey="Transportation" stroke={COLORS[0]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Electricity" stroke={COLORS[1]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Lifestyle" stroke={COLORS[2]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Total" stroke="#c94b32" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <div className="text-center">
        <Link to="/calculator" className="btn-secondary">
          Run another calculation <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  )
}
