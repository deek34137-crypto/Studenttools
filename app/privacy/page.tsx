import type { Metadata } from 'next'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | StudentTools',
  description:
    'Privacy policy for StudentTools.cyou. Learn how calculations are performed client-side and how cookies and analytics are handled.',
  alternates: {
    canonical: 'https://www.studenttools.cyou/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
          <div className="mt-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated: September 2026 • Effective Date: September 2026
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Client-Side Calculation Guarantee</h2>
          <p>
            At <strong>StudentTools</strong> (accessible at <code className="text-sky-600 font-mono">https://www.studenttools.cyou</code>), user privacy and transparency are core design principles.
          </p>
          <p>
            The mathematical calculations performed on our calculators—including but not limited to JEE Main marks, CGPA scores, attendance percentages, monthly CTC salary numbers, and loan amounts—are processed <strong>locally within your web browser</strong> using client-side JavaScript. Your individual numeric inputs are not transmitted to or stored on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Information We Collect Automatically</h2>
          <p>
            When you navigate through StudentTools, our web hosting provider and content delivery networks (such as Vercel) may log standard technical access data, including:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Internet Protocol (IP) address</li>
            <li>Browser type and operating system version</li>
            <li>Date, time, and referring URL of request</li>
            <li>Aggregated page load performance metrics</li>
          </ul>
          <p>
            This technical information is utilized solely for site security, DDoS prevention, system diagnostics, and server performance monitoring.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Cookies and Advertising Partners</h2>
          <p>
            StudentTools may integrate third-party services such as Google Analytics and Google AdSense to sustain free platform access.
          </p>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 underline font-medium"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Contact Information & Data Inquiries</h2>
          <p>
            If you have questions regarding this Privacy Policy or data protection practices on StudentTools, please contact us via email at:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs inline-block">
            privacy@studenttools.cyou
          </div>
        </section>
      </div>
    </div>
  )
}
