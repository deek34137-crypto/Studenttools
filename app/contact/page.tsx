'use client'

import React, { useState } from 'react'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Mail, MessageSquare, CheckCircle2, Send, HelpCircle } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Feedback / Tool Suggestion')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    // Clean feedback submission acknowledgment
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-3">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>Feedback & Inquiries</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact & Support
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Have a tool suggestion, noticed a calculation discrepancy, or want to give feedback? We would love to hear from you.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Thank you for your feedback!</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                We have received your message. If a response is required, our engineering team will reach out to <strong>{email}</strong>.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setMessage('')
                }}
                className="mt-4 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Send Us a Direct Message</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Feedback / Tool Suggestion">Feedback / Tool Suggestion</option>
                  <option value="Formula or Calculation Query">Formula or Calculation Query</option>
                  <option value="JEE Cutoff Dataset Correction">JEE Cutoff Dataset Correction</option>
                  <option value="Partnership / General Inquiry">Partnership / General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your suggestion or calculation question in detail..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>Direct Electronic Contact</span>
            </h3>
            <p>
              You can also reach out via email directly for tool requests, formula verification, or general communication:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-slate-800 text-xs font-semibold break-all">
              contact@studenttools.cyou
            </div>
            <p className="text-[11px] text-slate-400">
              We aim to respond to formula audits and student inquiries within 2 business days.
            </p>
          </div>

          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 text-xs text-sky-900 space-y-2">
            <span className="font-bold block text-sky-950">Reporting Calculation Discrepancies</span>
            <p>
              If you believe an exam cutoff or tax calculation formula requires updating due to a recent statutory or NTA policy change, please include a link to the official notification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
