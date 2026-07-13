import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { submitContact } from '../api/client.js'

const initial = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm(initial)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="section-label">Get in touch</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest-950 mt-3">
          Questions, feedback, ideas?
        </h1>
        <p className="text-forest-700/80 mt-3">
          We would love to hear from you — this is a student capstone project and every note helps.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass-card p-8 sm:p-10 space-y-6"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-sm font-medium text-forest-800">Name</span>
            <input required className="input-field mt-1.5" value={form.name} onChange={update('name')} placeholder="Your name" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-forest-800">Email</span>
            <input required type="email" className="input-field mt-1.5" value={form.email} onChange={update('email')} placeholder="you@example.com" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-forest-800">Subject</span>
          <input className="input-field mt-1.5" value={form.subject} onChange={update('subject')} placeholder="What's this about?" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-forest-800">Message</span>
          <textarea required rows={5} className="input-field mt-1.5 resize-none" value={form.message} onChange={update('message')} placeholder="Tell us what's on your mind..." />
        </label>

        {status === 'success' && (
          <div className="flex items-center gap-2 rounded-2xl bg-mint-100 text-forest-700 text-sm px-4 py-3">
            <CheckCircle2 size={16} /> Message sent — thank you!
          </div>
        )}
        {status === 'error' && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            Could not reach the CarbonCheck API. Make sure the backend server is running on http://localhost:8000.
          </div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
          {status === 'loading' ? (
            <><Loader2 size={17} className="animate-spin" /> Sending...</>
          ) : (
            <><Send size={17} /> Send message</>
          )}
        </button>
      </motion.form>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-forest-700/70">
        <Mail size={15} /> edunet@gmail.com
      </div>
    </div>
  )
}
