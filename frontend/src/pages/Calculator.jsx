import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Zap, Sprout, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useCarbon } from '../context/CarbonContext.jsx'
import { predictFootprint } from '../api/client.js'

const initialForm = {
  name: '',
  car_km: 10,
  bike_km: 0,
  bus_km: 0,
  train_km: 0,
  flights_year: 0,
  electricity_bill: 2000,
  ac_hours: 2,
  fan_hours: 4,
  has_fridge: true,
  washing_loads_week: 3,
  laptop_hours: 4,
  mobile_hours: 2,
  lpg_cylinders_month: 0.7,
  meat_meals_week: 4,
  recycling_habit: 'sometimes',
  plastic_level: 'medium',
  water_litres: 150,
}

const steps = [
  { key: 'transport', title: 'Transportation', icon: Car },
  { key: 'electricity', title: 'Electricity', icon: Zap },
  { key: 'lifestyle', title: 'Lifestyle', icon: Sprout },
]

function NumberField({ label, unit, value, onChange, min = 0, max, step = 1 }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-forest-800">{label}</span>
      <div className="relative mt-1.5">
        <input
          type="number"
          className="input-field pr-16"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-forest-400">
            {unit}
          </span>
        )}
      </div>
    </label>
  )
}

function ChoiceField({ label, value, onChange, options }) {
  return (
    <div>
      <span className="text-sm font-medium text-forest-800">{label}</span>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
              value === opt.value
                ? 'bg-forest-900 border-forest-900 text-white'
                : 'border-forest-100 bg-white text-forest-700 hover:border-forest-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Calculator() {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setLastResult } = useCarbon()

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, has_fridge: !!form.has_fridge }
      const result = await predictFootprint(payload)
      setLastResult({ ...result, name: form.name || null, submittedAt: new Date().toISOString() })
      navigate('/result')
    } catch (err) {
      setError(
        'Could not reach the CarbonCheck API. Make sure the backend server is running on http://localhost:8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  const StepIcon = steps[step].icon

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <span className="section-label">Footprint calculator</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
          Tell us about your day-to-day
        </h1>
        <p className="text-forest-700/80 mt-3">Three quick sections — takes about two minutes.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              i === step ? 'bg-forest-900 text-white' : i < step ? 'bg-mint-100 text-forest-700' : 'bg-white text-forest-400 border border-forest-100'
            }`}>
              <s.icon size={15} /> {s.title}
            </div>
            {i < steps.length - 1 && <div className="h-px w-8 bg-forest-100" />}
          </React.Fragment>
        ))}
      </div>

      <div className="glass-card p-8 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-900 mb-2">
                  <StepIcon size={20} /> <h2 className="font-display text-xl font-semibold">Transportation</h2>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-forest-800">Your name (optional, for your history label)</span>
                  <input
                    type="text"
                    className="input-field mt-1.5"
                    placeholder="e.g. July check-in"
                    value={form.name}
                    onChange={(e) => update('name')(e.target.value)}
                  />
                </label>
                <div className="grid sm:grid-cols-2 gap-5">
                  <NumberField label="Car distance" unit="km/day" value={form.car_km} onChange={update('car_km')} />
                  <NumberField label="Bike distance" unit="km/day" value={form.bike_km} onChange={update('bike_km')} />
                  <NumberField label="Bus distance" unit="km/day" value={form.bus_km} onChange={update('bus_km')} />
                  <NumberField label="Train distance" unit="km/day" value={form.train_km} onChange={update('train_km')} />
                  <NumberField label="Flights taken" unit="per year" value={form.flights_year} onChange={update('flights_year')} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-900 mb-2">
                  <StepIcon size={20} /> <h2 className="font-display text-xl font-semibold">Electricity</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <NumberField label="Monthly electricity bill" unit="INR" value={form.electricity_bill} onChange={update('electricity_bill')} step={50} />
                  <NumberField label="AC usage" unit="hrs/day" value={form.ac_hours} onChange={update('ac_hours')} step={0.5} />
                  <NumberField label="Fan usage" unit="hrs/day" value={form.fan_hours} onChange={update('fan_hours')} step={0.5} />
                  <NumberField label="Washing machine" unit="loads/week" value={form.washing_loads_week} onChange={update('washing_loads_week')} />
                  <NumberField label="Laptop/desktop usage" unit="hrs/day" value={form.laptop_hours} onChange={update('laptop_hours')} step={0.5} />
                  <NumberField label="Mobile charging" unit="hrs/day" value={form.mobile_hours} onChange={update('mobile_hours')} step={0.5} />
                </div>
                <ChoiceField
                  label="Do you have a refrigerator at home?"
                  value={form.has_fridge}
                  onChange={update('has_fridge')}
                  options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-forest-900 mb-2">
                  <StepIcon size={20} /> <h2 className="font-display text-xl font-semibold">Lifestyle</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <NumberField label="LPG cylinders" unit="per month" value={form.lpg_cylinders_month} onChange={update('lpg_cylinders_month')} step={0.1} />
                  <NumberField label="Meat meals" unit="per week" value={form.meat_meals_week} onChange={update('meat_meals_week')} />
                  <NumberField label="Water consumption" unit="litres/day" value={form.water_litres} onChange={update('water_litres')} step={5} />
                </div>
                <ChoiceField
                  label="Plastic usage level"
                  value={form.plastic_level}
                  onChange={update('plastic_level')}
                  options={[{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }]}
                />
                <ChoiceField
                  label="Recycling habit"
                  value={form.recycling_habit}
                  onChange={update('recycling_habit')}
                  options={[{ label: 'Always', value: 'always' }, { label: 'Sometimes', value: 'sometimes' }, { label: 'Never', value: 'never' }]}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-forest-900"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Next <ArrowRight size={17} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Calculating...
                </>
              ) : (
                <>
                  Get my result <ArrowRight size={17} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
