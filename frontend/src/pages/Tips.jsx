import React from 'react'
import { motion } from 'framer-motion'
import {
  Sun, Droplet, Recycle, Bike, Utensils, Lightbulb, Wind, ShoppingBag, Landmark, Trees,
} from 'lucide-react'

const dailyTips = [
  { icon: Lightbulb, tip: 'Switch to LED bulbs — they use up to 75% less energy than incandescent ones.' },
  { icon: Wind, tip: 'Set your AC to 24-26°C; every degree lower adds meaningfully to your bill and footprint.' },
  { icon: Bike, tip: 'Walk or cycle for trips under 2 km instead of taking the car.' },
  { icon: Droplet, tip: 'Fix leaking taps — a slow drip can waste over 3,000 litres a year.' },
  { icon: Utensils, tip: 'Try one plant-based meal a day; diet-related emissions add up fast.' },
  { icon: ShoppingBag, tip: 'Carry a reusable bag and bottle to cut single-use plastic waste.' },
]

const greenHabits = [
  { title: 'Unplug idle electronics', desc: 'Devices on standby still draw power — unplug chargers and appliances when not in use.' },
  { title: 'Air-dry your laundry', desc: 'Skip the dryer when weather allows; it is one of the most energy-hungry home appliances.' },
  { title: 'Compost kitchen waste', desc: 'Composting food scraps reduces methane from landfills and enriches soil naturally.' },
  { title: 'Buy local and seasonal produce', desc: 'Shorter supply chains mean lower transportation emissions on your food.' },
  { title: 'Maintain your vehicle', desc: 'Regular servicing and correct tyre pressure improve fuel efficiency by up to 10%.' },
  { title: 'Segregate your waste', desc: 'Separating dry, wet and hazardous waste makes recycling genuinely effective.' },
]

const initiatives = [
  { name: 'National Solar Mission', desc: 'India\u2019s flagship program driving large-scale solar power adoption across the country.' },
  { name: 'FAME India Scheme', desc: 'Subsidies and incentives that make electric vehicles more affordable for everyday buyers.' },
  { name: 'Swachh Bharat Mission', desc: 'A nationwide sanitation and waste-management drive that supports better recycling infrastructure.' },
  { name: 'PM Ujjwala Yojana', desc: 'Expands access to clean LPG cooking fuel, reducing reliance on high-emission solid fuels.' },
]

const sdgGoals = [
  { code: '07', title: 'Affordable & Clean Energy' },
  { code: '11', title: 'Sustainable Cities & Communities' },
  { code: '12', title: 'Responsible Consumption & Production' },
  { code: '13', title: 'Climate Action' },
  { code: '15', title: 'Life on Land' },
]

export default function Tips() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="section-label">Sustainability tips</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
          Small habits, real climate impact
        </h1>
        <p className="text-forest-700/80 mt-3">
          Practical, everyday actions — plus the bigger initiatives working alongside them.
        </p>
      </div>

      {/* Daily tips */}
      <section className="mb-20">
        <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">Daily eco-friendly tips</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dailyTips.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="solid-card p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-forest-700 mb-4">
                <t.icon size={20} />
              </div>
              <p className="text-sm text-forest-800 leading-relaxed">{t.tip}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Green habits */}
      <section className="mb-20">
        <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">Green habits worth building</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {greenHabits.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6"
            >
              <h3 className="font-display font-semibold text-forest-900 mb-2">{h.title}</h3>
              <p className="text-sm text-forest-700/80 leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Government initiatives */}
      <section className="mb-20">
        <div className="flex items-center gap-2 mb-6">
          <Landmark size={20} className="text-forest-700" />
          <h2 className="font-display text-xl font-semibold text-forest-900">Government initiatives</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {initiatives.map((g, i) => (
            <div key={i} className="rounded-3xl border border-forest-100 bg-white p-6">
              <h3 className="font-display font-semibold text-forest-900 mb-2">{g.name}</h3>
              <p className="text-sm text-forest-700/80 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SDG Goals */}
      <section className="rounded-3xl bg-forest-950 p-10 sm:p-14">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Trees size={20} className="text-mint-300" />
          <h2 className="font-display text-xl font-semibold text-white">Related SDG goals</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sdgGoals.map((g) => (
            <div key={g.code} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center hover:bg-white/10 transition-colors">
              <div className="font-mono text-mint-300 text-lg font-semibold mb-1">{g.code}</div>
              <div className="text-xs text-forest-200/80 leading-snug">{g.title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
