'use client'

import { useState } from 'react'
import type { AppState } from '@/app/page'

interface TestPageProps {
  state: AppState
  onFinish: (answers: Record<number, number>) => void
  onExit: () => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function TestPage({ state, onFinish, onExit }: TestPageProps) {
  const [curQ, setCurQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const pkg = state.packages[state.curPkg]
  if (!pkg) return null

  const q = pkg.questions[curQ]
  const total = pkg.questions.length
  const pct = Math.round(((curQ + 1) / total) * 100)
  const isLast = curQ === total - 1

  const select = (i: number) => setAnswers((prev) => ({ ...prev, [curQ]: i }))
  const next = () => { if (isLast) { onFinish(answers) } else { setCurQ((c) => c + 1) } }
  const prev = () => { if (curQ > 0) setCurQ((c) => c - 1) }

  const answered = Object.keys(answers).length
  const unanswered = total - answered

  return (
    <div className="max-w-[760px] mx-auto px-7 py-7 flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold tracking-tight truncate max-w-[400px]">{state.fileName}</p>
          <p className="text-xs mt-0.5" style={{ color: '#93afd4' }}>
            {total} ta savol · {state.curPkg + 1}-paket ({pkg.start}–{pkg.end})
          </p>
          <div
            className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8' }}
          >
            📦 {state.curPkg + 1}/{state.packages.length}-paket
          </div>
        </div>
        <button
          onClick={() => { if (confirm('Testni to\'xtatmoqchimisiz? Javoblar saqlanmaydi.')) onExit() }}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'transparent', border: '1px solid rgba(26,58,107,0.8)', color: '#93afd4' }}
        >
          ✕ Chiqish
        </button>
      </div>

      {/* Progress */}
      <div>
        <div className="rounded-full h-2 overflow-hidden" style={{ background: 'rgba(22,48,88,0.7)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2563eb,#0ea5e9)' }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1.5" style={{ color: '#4a7fa0' }}>
          <span>{curQ + 1} / {total}</span>
          <span>{pct}%</span>
        </div>
      </div>

      {/* Question card */}
      <div
        className="rounded-3xl p-8 flex flex-col gap-5"
        style={{ background: 'rgba(10,31,61,0.65)', border: '1px solid rgba(26,58,107,0.7)', backdropFilter: 'blur(16px)' }}
      >
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase w-fit"
          style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8' }}
        >
          Savol {pkg.start + curQ}
        </div>

        <p className="text-[18px] font-semibold leading-relaxed" style={{ fontFamily: 'Outfit,sans-serif' }}>
          {q.savol}
        </p>

        <div className="flex flex-col gap-2.5">
          {q.variantlar.map((v, i) => {
            const isSel = answers[curQ] === i
            return (
              <button
                key={i}
                onClick={() => select(i)}
                className="option-btn"
                style={{
                  background: isSel ? 'rgba(14,165,233,0.12)' : 'rgba(22,48,88,0.5)',
                  borderColor: isSel ? '#0ea5e9' : 'rgba(26,58,107,0.8)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                  style={{
                    background: isSel ? '#0ea5e9' : 'rgba(10,31,61,0.8)',
                    border: `1px solid ${isSel ? '#0ea5e9' : 'rgba(26,58,107,0.7)'}`,
                    color: isSel ? '#fff' : '#93afd4',
                  }}
                >
                  {LETTERS[i]}
                </div>
                <span>{v}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigator */}
      <div
        className="rounded-2xl p-4"
        style={{ background: 'rgba(10,31,61,0.4)', border: '1px solid rgba(26,58,107,0.4)' }}
      >
        <p className="text-[11px] font-bold mb-2" style={{ color: '#4a7fa0' }}>SAVOLLAR</p>
        <div className="flex flex-wrap gap-1.5">
          {pkg.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurQ(i)}
              className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
              style={{
                background: i === curQ ? '#0ea5e9' : answers[i] !== undefined ? 'rgba(16,185,129,0.15)' : 'rgba(22,48,88,0.6)',
                border: `1px solid ${i === curQ ? '#0ea5e9' : answers[i] !== undefined ? 'rgba(16,185,129,0.3)' : 'rgba(26,58,107,0.5)'}`,
                color: i === curQ ? '#fff' : answers[i] !== undefined ? '#10b981' : '#4a7fa0',
              }}
            >
              {pkg.start + i}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-2" style={{ color: '#4a7fa0' }}>
          {answered} ta javob berildi · {unanswered} ta qoldi
        </p>
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={prev}
          disabled={curQ === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
          style={{ background: 'transparent', border: '1px solid rgba(26,58,107,0.8)', color: '#93afd4' }}
        >
          ← Oldingi
        </button>
        <button
          onClick={next}
          className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {isLast ? 'Yakunlash ✓' : 'Keyingi →'}
        </button>
      </div>
    </div>
  )
}
