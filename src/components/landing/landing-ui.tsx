'use client'

import React, { useState } from 'react'
import { TrendingUp, Zap, Code, Wallet, ArrowRight, Check, Github, Terminal } from 'lucide-react'

export default function PredictionMarketLanding() {
  const [activeTab, setActiveTab] = useState('features')

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Ready-to-Use SDK',
      description: 'Pre-integrated prediction market SDK with all the core functionality you need',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Market Creation',
      description: 'Private dashboard for creators to launch and manage prediction markets',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Live Market Display',
      description: 'Beautiful UI components to showcase active and resolved markets',
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Betting Interface',
      description: 'Seamless user experience for placing and tracking predictions',
    },
  ]

  const stats = [
    { value: '< 5 min', label: 'Setup Time' },
    { value: '100%', label: 'TypeScript' },
    { value: 'Next.js 15', label: 'Framework' },
    { value: 'Open Source', label: 'License' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-150"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">create-prediction-app</span>
            </div>
            <a
              href="https://github.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Launch prediction markets in minutes</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Build Prediction Markets
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Without the Hassle
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A Next.js 15 scaffold with everything you need to launch your prediction market platform. TypeScript,
            Tailwind CSS, and SDK integration included.
          </p>

          {/* Quick Start */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <div className="w-full sm:w-auto">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 font-mono text-sm flex items-center gap-3">
                <Terminal className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">npx create-prediction-app my-app</span>
              </div>
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-slate-400">
            Pre-built components and integrations for a complete prediction market
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:bg-slate-800/50"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's Included Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-8">What's Included</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Next.js 15 App Router',
              'TypeScript configured',
              'Tailwind CSS styling',
              'shadcn/ui components',
              'Market creation dashboard',
              'Public market browsing',
              'Betting interface',
              'SDK integration layer',
              'Authentication ready',
              'Responsive design',
              'Dark mode default',
              'Example markets',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-200">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Beautiful by Default</h2>
          <p className="text-xl text-slate-400">Inspired by modern prediction market platforms</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Predicting
              </span>
              <span className="text-sm text-slate-400">$0.0</span>
            </div>
            <h3 className="font-semibold text-lg">Will ETH reach $5000 by end of 2025?</h3>
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <span>⏰ 7:00 PM to 8:00 PM</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">50/50</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>NO</span>
                <span>YES</span>
              </div>
            </div>
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <span>⏱️ betting ends in 24m</span>
              <span className="ml-auto text-emerald-400">24 mins left</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                Observing
              </span>
              <span className="text-sm text-slate-400">In progress</span>
            </div>
            <h3 className="font-semibold text-lg">Will Bitcoin hit new ATH this month?</h3>
            <div className="text-sm text-slate-400">⏰ October 1 - 31</div>
            <div className="space-y-2">
              <div className="text-sm font-medium">67/33</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>NO</span>
                <span>YES</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20">
                Resolved
              </span>
              <span className="text-sm text-red-400">NO</span>
            </div>
            <h3 className="font-semibold text-lg">Will it rain in San Francisco today?</h3>
            <div className="text-sm text-slate-400">⏰ September 30, 2025</div>
            <div className="space-y-2">
              <div className="text-sm font-medium">85/15</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-slate-500 to-slate-600"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>NO</span>
                <span>YES</span>
              </div>
            </div>
            <div className="text-sm text-slate-400">Market closed</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 p-12">
          <h2 className="text-4xl font-bold">Ready to Build?</h2>
          <p className="text-xl text-slate-400">Get started with your prediction market platform in under 5 minutes</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border border-slate-700 hover:border-slate-600 rounded-lg font-semibold transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-semibold">create-prediction-app</span>
            </div>
            <p className="text-sm text-slate-400">Built with Next.js 15, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
