"use client";

import Link from "next/link";
import { FaSyringe, FaCalendarCheck, FaShieldAlt, FaArrowRight, FaCheckCircle, FaMobileAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Protirodh</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-green-700"
              >
                <FaSyringe className="text-sm" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              <FaShieldAlt className="text-green-600" />
              Safe, Secure & Verified
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your Digital Vaccination
              <span className="block text-green-600">Passport Awaits</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Register, apply for vaccines, and manage your vaccination records all in one place.
              Join thousands of Bangladeshis securing their health digitally.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group flex items-center gap-2 rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
              >
                Get Started Free
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                Login to Account
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span>No paperwork</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span>Instant verification</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span>100% secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need in One Place
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Simple, fast, and secure vaccination management for everyone
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <FaMobileAlt className="text-xl text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Easy Registration</h3>
              <p className="text-gray-600">
                Sign up with your NID or Birth Certificate in minutes. Complete a simple onboarding to get started.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <FaSyringe className="text-xl text-emerald-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Apply for Vaccines</h3>
              <p className="text-gray-600">
                Browse available vaccines, select your preferred time slot, and apply instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <FaCalendarCheck className="text-xl text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Track Your Status</h3>
              <p className="text-gray-600">
                Monitor your application status and view your complete vaccination history anytime.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <FaShieldAlt className="text-xl text-yellow-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Digital Certificate</h3>
              <p className="text-gray-600">
                Get your verified digital vaccination certificate immediately after vaccination.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                <FaCheckCircle className="text-xl text-teal-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Real-time Updates</h3>
              <p className="text-gray-600">
                Receive notifications about your application, available slots, and vaccination reminders.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <FaMobileAlt className="text-xl text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Mobile Friendly</h3>
              <p className="text-gray-600">
                Access your vaccination records from any device, anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-linear-to-br from-green-600 to-green-700 px-8 py-16 text-center shadow-2xl sm:px-16">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-green-100">
              Join thousands of citizens managing their vaccination digitally
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-green-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            >
              Take Vaccine Now
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <FaSyringe className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Protirodh</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Protirodh - Digital Vaccination Management System for Bangladesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
