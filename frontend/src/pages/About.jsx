import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Globe2, LineChart, ShieldCheck, ArrowRight } from 'lucide-react'

const benefits = [
  { icon: Brain, title: 'AI-backed clarity', desc: 'A trained classification model reads your habits the way a human analyst would — but instantly.' },
  { icon: LineChart, title: 'Track over time', desc: 'Every calculation is saved, so you can see whether your changes are actually working.' },
  { icon: ShieldCheck, title: 'Transparent formula', desc: 'Every number is explainable — no black box. You can see exactly how each habit contributes.' },
  { icon: Globe2, title: 'Built for real life', desc: '17 everyday inputs across transport, electricity and lifestyle — no jargon, no guesswork.' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="section-label">About CarbonCheck</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
          Why your carbon footprint matters
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-3">What is a carbon footprint?</h2>
          <p className="text-sm text-forest-700/85 leading-relaxed">
            Your carbon footprint is the total amount of greenhouse gases — mostly CO₂ — produced
            directly and indirectly by your daily choices: how you travel, how much electricity
            you use, what you eat, and how you manage waste. It is usually measured in kilograms
            or tonnes of CO₂ equivalent per month or year.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-8">
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-3">Why it matters</h2>
          <p className="text-sm text-forest-700/85 leading-relaxed">
            Individual and household emissions collectively make up a significant share of global
            greenhouse gas output. Understanding where your footprint comes from is the first,
            most practical step toward reducing it — and toward supporting the broader shift to
            a low-carbon economy.
          </p>
        </motion.div>
      </div>

      <div className="mb-20">
        <h2 className="font-display text-2xl font-semibold text-forest-950 text-center mb-3">
          How AI helps sustainability
        </h2>
        <p className="text-forest-700/80 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          CarbonCheck pairs a transparent emissions formula with a machine learning model trained
          on thousands of simulated household profiles. The model recognizes the *pattern* behind
          Low, Medium and High carbon lifestyles — not just a single threshold — and reports a
          confidence score so you know how certain the reading is.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="solid-card p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-forest-700 mb-4">
                <b.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-forest-900 mb-2">{b.title}</h3>
              <p className="text-sm text-forest-700/80 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/calculator" className="btn-primary">
          Try the calculator <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  )
}
