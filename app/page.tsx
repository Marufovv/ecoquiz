'use client'

import { useState } from 'react'
import LandingPage from '@/components/LandingPage'
import DashboardPage from '@/components/DashboardPage'
import TestPage from '@/components/TestPage'
import PackageResultsPage from '@/components/PackageResultsPage'
import FinalResultsPage from '@/components/FinalResultsPage'
import Navbar from '@/components/Navbar'
import type { Package, Question } from '@/types'
import { buildPackages, saveToStorage, loadFromStorage } from '@/lib/utils'

export type AppPage = 'landing' | 'dashboard' | 'test' | 'pkg-results' | 'final'

export interface AppState {
  userName: string
  fileName: string
  allQuestions: Question[]
  packages: Package[]
  pkgSize: number
  curPkg: number
  curQ: number
  answers: Record<number, number>
}

const defaultState: AppState = {
  userName: '',
  fileName: '',
  allQuestions: [],
  packages: [],
  pkgSize: 10,
  curPkg: 0,
  curQ: 0,
  answers: {},
}

export default function Home() {
  const [page, setPage] = useState<AppPage>('landing')
  const [state, setState] = useState<AppState>(defaultState)

  const updateState = (updates: Partial<AppState>) =>
    setState((prev) => ({ ...prev, ...updates }))

  const goTo = (p: AppPage) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startApp = (name: string) => {
    updateState({ userName: name })
    goTo('dashboard')
  }

  const onQuestionsLoaded = (questions: Question[], fileName: string, pkgSize: number) => {
    const packages = buildPackages(questions, pkgSize)
    updateState({ allQuestions: questions, fileName, packages, pkgSize, curPkg: 0, curQ: 0, answers: {} })
  }

  const startPackage = () => {
    updateState({ curQ: 0, answers: {} })
    goTo('test')
  }

  const finishPackage = (answers: Record<number, number>) => {
    const pkg = state.packages[state.curPkg]
    let correct = 0
    pkg.questions.forEach((q, i) => {
      if (answers[i] === q.togri) correct++
    })
    const score = Math.round((correct / pkg.questions.length) * 100)
    const updatedPackages = [...state.packages]
    updatedPackages[state.curPkg] = { ...pkg, done: true, score, correct, answers }

    // Save history
    const history = loadFromStorage<any[]>('eq_history', [])
    history.push({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      fileName: state.fileName,
      score,
      correct,
      total: pkg.questions.length,
      pkgIndex: state.curPkg,
    })
    saveToStorage('eq_history', history.slice(-200))

    setState((prev) => ({ ...prev, packages: updatedPackages, answers }))
    goTo('pkg-results')
  }

  const nextPackage = () => {
    updateState({ curPkg: state.curPkg + 1, curQ: 0, answers: {} })
    goTo('test')
  }

  const retryPackage = () => {
    const updatedPackages = [...state.packages]
    updatedPackages[state.curPkg] = {
      ...updatedPackages[state.curPkg],
      done: false, score: 0, correct: 0, answers: {},
    }
    setState((prev) => ({ ...prev, packages: updatedPackages, curQ: 0, answers: {} }))
    goTo('test')
  }

  const restartAll = () => {
    const packages = buildPackages(state.allQuestions, state.pkgSize)
    updateState({ packages, curPkg: 0, curQ: 0, answers: {} })
    goTo('dashboard')
  }

  const logout = () => {
    setState(defaultState)
    goTo('landing')
  }

  const isLoggedIn = !!state.userName

  return (
    <div className="min-h-screen bg-[#040d1a] text-[#e8f0fe]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
            top: '-200px', left: '-150px',
            animation: 'floatBg 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%)',
            bottom: '-100px', right: '-100px',
            animation: 'floatBg 13s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Navbar (hidden on landing) */}
      {page !== 'landing' && (
        <Navbar
          userName={state.userName}
          onLogout={logout}
          onHome={() => goTo('dashboard')}
        />
      )}

      {/* Pages */}
      <div className="relative z-10">
        {page === 'landing' && (
          <LandingPage onStart={startApp} />
        )}
        {page === 'dashboard' && (
          <DashboardPage
            state={state}
            onQuestionsLoaded={onQuestionsLoaded}
            onStartPackage={startPackage}
            onSelectPkgSize={(size) => {
              const packages = buildPackages(state.allQuestions, size)
              updateState({ pkgSize: size, packages, curPkg: 0 })
            }}
          />
        )}
        {page === 'test' && (
          <TestPage
            state={state}
            onFinish={finishPackage}
            onExit={() => goTo('dashboard')}
          />
        )}
        {page === 'pkg-results' && (
          <PackageResultsPage
            state={state}
            onNext={nextPackage}
            onRetry={retryPackage}
            onFinal={() => goTo('final')}
            onDashboard={() => goTo('dashboard')}
          />
        )}
        {page === 'final' && (
          <FinalResultsPage
            state={state}
            onRestart={restartAll}
            onNewFile={() => { updateState({ allQuestions: [], packages: [], fileName: '' }); goTo('dashboard') }}
          />
        )}
      </div>
    </div>
  )
}
