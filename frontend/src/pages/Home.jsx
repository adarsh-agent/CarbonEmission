import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Car, Zap, Trash2, Sparkles, Target, Users, TreePine, Gauge,
} from 'lucide-react'
import CarbonRing from '../components/CarbonRing.jsx'
import { getStats } from '../api/client.js'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <motion.div variants={fadeUp} className="glass-card px-6 py-7 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-forest-900 text-white">
        <Icon size={18} />
      </div>
      <div className="font-display text-3xl font-semibold text-forest-900">{value}</div>
      <div className="text-xs font-mono uppercase tracking-wider text-forest-500 mt-1">{label}</div>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div variants={fadeUp} className="solid-card p-7 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-100 text-forest-700 mb-5">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-lg font-semibold text-forest-900 mb-2">{title}</h3>
      <p className="text-sm text-forest-700/80 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

export default function Home() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(setStats).catch(() => setStats(null))
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden pt-14 pb-24 sm:pt-20">
        {/* organic blob backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-mint-200/50 blur-3xl animate-float" />
          <div className="absolute top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-forest-200/40 blur-3xl animate-drift" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="show" variants={staggerParent}>
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-mint-100 text-forest-700 text-xs font-mono font-semibold uppercase tracking-wider px-4 py-2">
              <Sparkles size={13} /> AI-powered climate insight
            </motion.span>

            <motion.h1 variants={fadeUp} className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-forest-950 leading-[1.08]">
              Know your carbon
              <br />
              <span className="text-forest-500">before it knows you.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg text-forest-800/80 max-w-lg leading-relaxed">
              CarbonCheck turns your daily commute, electricity bill and lifestyle habits
              into a single, clear number — then uses machine learning to tell you exactly
              where to cut back first.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
              <Link to="/calculator" className="btn-primary">
                Calculate my footprint <ArrowRight size={17} />
              </Link>
              <Link to="/about" className="btn-secondary">
                How it works
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6 text-sm text-forest-700/70">
              <div className="flex items-center gap-2"><Target size={16} className="text-forest-500" /> 17 lifestyle inputs</div>
              <div className="flex items-center gap-2"><Gauge size={16} className="text-forest-500" /> Instant AI prediction</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="glass-card p-10 flex flex-col items-center">
              <CarbonRing percent={38} category="Low" label="Low" sublabel="carbon band" size={240} />
              <div className="mt-6 grid grid-cols-3 gap-4 w-full text-center">
                <div>
                  <div className="font-mono text-sm font-semibold text-forest-900">142 kg</div>
                  <div className="text-[10px] uppercase tracking-wide text-forest-500">Transport</div>
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-forest-900">88 kg</div>
                  <div className="text-[10px] uppercase tracking-wide text-forest-500">Power</div>
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-forest-900">54 kg</div>
                  <div className="text-[10px] uppercase tracking-wide text-forest-500">Lifestyle</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerParent}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard icon={Users} value={stats ? stats.total_calculations : '—'} label="Footprints calculated" />
          <StatCard icon={Gauge} value={stats ? `${stats.average_monthly_kg} kg` : '—'} label="Avg. monthly CO₂" />
          <StatCard icon={Target} value={stats ? stats.low_carbon_users : '—'} label="Low-carbon users" />
          <StatCard icon={TreePine} value={stats ? `${stats.co2_trees_equivalent}` : '—'} label="Trees needed to offset" />
        </motion.div>
      </section>

      {/* OVERVIEW / FEATURES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">What CarbonCheck does</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
            Three categories. One honest number.
          </h2>
          <p className="text-forest-700/80 mt-4 leading-relaxed">
            We break your footprint into transportation, electricity and lifestyle —
            then use a trained classification model to place you in a Low, Medium or
            High carbon band with a confidence score.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerParent}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <FeatureCard
            icon={Car}
            title="Transportation"
            desc="Car, bike, bus, train and flight habits converted into precise per-km and per-trip emissions."
          />
          <FeatureCard
            icon={Zap}
            title="Electricity"
            desc="Your bill plus AC, fan, fridge, laptop and washing machine usage mapped to grid emission factors."
          />
          <FeatureCard
            icon={Trash2}
            title="Lifestyle"
            desc="LPG, diet, recycling, plastic and water habits — the everyday choices that quietly add up."
          />
        </motion.div>
      </section>

      {/* SDG SECTION */}
      <section className="bg-forest-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label !text-mint-300">Aligned with the UN</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-3">
              Built around the Sustainable Development Goals
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { code: '07', title: 'Affordable & Clean Energy', desc: 'Encouraging renewable adoption and efficient appliance use.' },
              { code: '11', title: 'Sustainable Cities', desc: 'Promoting public transport and low-emission commuting.' },
              { code: '12', title: 'Responsible Consumption', desc: 'Reducing plastic use and building recycling habits.' },
              { code: '13', title: 'Climate Action', desc: 'Giving individuals a measurable way to track and cut emissions.' },
            ].map((g) => (
              <div key={g.code} className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                <div className="font-mono text-mint-300 text-sm mb-3">SDG {g.code}</div>
                <h3 className="font-display text-white font-semibold mb-2">{g.title}</h3>
                <p className="text-sm text-forest-200/70 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28 text-center">
        <span className="section-label">Ready when you are</span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3 mb-6">
          Your footprint takes two minutes to measure.
        </h2>
        <p className="text-forest-700/80 max-w-xl mx-auto mb-9">
          Answer a short form about your transport, power and lifestyle habits and get
          an instant AI-backed reading plus a personalized action plan.
        </p>
        <Link to="/calculator" className="btn-primary text-base">
          Start my calculation <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
