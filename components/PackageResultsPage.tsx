'use client'

import type { AppState } from '@/app/page'
import { getScoreEmoji, getScoreTitle, getScoreSub } from '@/lib/utils'

interface PackageResultsPageProps {
  state: AppState
  onNext: () => void
  onRetry: () => void
  onFinal: () => void
  onDashboard: () => void
}

export default function PackageResultsPage({ state, onNext, onRetry, onFinal, onDashboard }: PackageResultsPageProps) {
  const pkg = state.packages[state.curPkg]
  if (!pkg) return null

  const pct = pkg.score
  const correct = pkg.correct
  const total = pkg.questions.length
  const isLast = state.curPkg === state.packages.length - 1
  const doneCount = state.packages.filter((p) => p.done).length
  const doneSavol = state.packages.filter((p) => p.done).reduce((a, p) => a + p.questions.length, 0)
  const overallPct = Math.round((doneSavol / state.allQuestions.length) * 100)

  const circumference = 314.2
  const offset = circumference - (circumference * pct) / 100

  const wrongQs = pkg.questions.filter((_, i) => state.answers[i] !== pkg.questions[i].togri)

  return (
    <div className="max-w-[820px] mx-auto px-7 py-8 flex flex-col gap-5">
      {/* Score hero */}
      <div
        className="rounded-3xl p-7 flex items-center gap-8 flex-wrap"
        style={{ background: 'rgba(10,31,61,0.65)', border: '1px solid rgba(26,58,107,0.7)', backdropFilter: 'blur(16px)' }}
      >
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="progress-ring">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(22,48,88,0.7)" strokeWidth="9" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="url(#rg)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
            />
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-extrabold"
              style={{ background: 'linear-gradient(135deg,#38bdf8,#7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {pct}%
            </span>
            <span className="text-[10px]" style={{ color: '#4a7fa0' }}>natija</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-[180px]">
          <h2 className="text-xl font-bold tracking-tight mb-1.5">{getScoreTitle(pct, state.userName)}</h2>
          <p className="text-sm mb-4" style={{ color: '#93afd4' }}>{getScoreSub(pct)}</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { num: correct, label: "To'g'ri ✓", color: '#10b981' },
              { num: total - correct, label: 'Xato ✗', color: '#ef4444' },
              { num: total, label: 'Paketda', color: '#38bdf8' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl px-4 py-2.5 text-center" style={{ background: 'rgba(22,48,88,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
                <div className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.num}</div>
                <div className="text-[11px]" style={{ color: '#4a7fa0' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall progress mini */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
        <div className="flex justify-between mb-2 text-sm">
          <span className="font-semibold" style={{ color: '#93afd4' }}>Umumiy progress</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>{doneSavol} / {state.allQuestions.length} savol</span>
        </div>
        <div className="rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(22,48,88,0.7)' }}>
          <div className="h-full rounded-full" style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg,#2563eb,#0ea5e9)', transition: 'width .6s' }} />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {state.packages.map((p, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
              style={{
                background: p.done ? 'rgba(16,185,129,0.1)' : i === state.curPkg ? 'rgba(14,165,233,0.1)' : 'rgba(22,48,88,0.4)',
                color: p.done ? '#10b981' : i === state.curPkg ? '#38bdf8' : '#4a7fa0',
              }}
            >
              {i + 1}-paket{p.done ? ` (${p.score}%)` : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="rounded-3xl p-6" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">📊 Bu paket tahlili</h3>
        <div className="flex flex-col gap-2">
          {pkg.questions.map((q, i) => {
            const isOk = state.answers[i] === q.togri
            const ua = state.answers[i] !== undefined ? q.variantlar[state.answers[i]] : 'Javob berilmadi'
            return (
              <div
                key={i}
                className="rounded-xl p-3.5"
                style={{
                  borderLeft: `3px solid ${isOk ? '#10b981' : '#ef4444'}`,
                  background: 'rgba(22,48,88,0.4)',
                  borderRadius: '0 10px 10px 0',
                  paddingLeft: '14px',
                }}
              >
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold mb-1.5"
                  style={{ background: isOk ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: isOk ? '#10b981' : '#ef4444' }}
                >
                  {isOk ? '✓ To\'g\'ri' : '✗ Xato'}
                </span>
                <p className="text-sm font-semibold mb-1">{pkg.start + i}. {q.savol}</p>
                {!isOk && (
                  <>
                    <p className="text-xs" style={{ color: '#ef4444' }}>Sizning: {ua}</p>
                    <p className="text-xs" style={{ color: '#10b981' }}>✓ To'g'ri: {q.variantlar[q.togri]}</p>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Practice */}
      {wrongQs.length > 0 && (
        <div className="rounded-3xl p-6" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
          <h3 className="text-sm font-bold mb-4">🎯 Xatolar ustida ishlash</h3>
          <div className="flex flex-col gap-2.5">
            {pkg.questions.filter((_, i) => state.answers[i] !== pkg.questions[i].togri).map((q, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(22,48,88,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
                <p className="text-sm font-semibold mb-1.5" style={{ color: '#f59e0b' }}>❓ {q.savol}</p>
                <p className="text-xs" style={{ color: '#10b981' }}>✓ To'g'ri javob: {q.variantlar[q.togri]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: 'transparent', border: '1px solid rgba(26,58,107,0.8)', color: '#93afd4' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)'; e.currentTarget.style.color = '#e8f0fe' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(26,58,107,0.8)'; e.currentTarget.style.color = '#93afd4' }}
        >
          🔄 Qayta ishlash
        </button>

        {!isLast ? (
          <button
            onClick={onNext}
            className="px-7 py-3 rounded-xl text-sm font-bold text-white transition-all flex-1"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {state.curPkg + 2}-paket → ({state.packages[state.curPkg + 1]?.start}–{state.packages[state.curPkg + 1]?.end} savollar)
          </button>
        ) : (
          <button
            onClick={onFinal}
            className="px-7 py-3 rounded-xl text-sm font-bold text-white transition-all flex-1"
            style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            🏁 Yakuniy natijalar
          </button>
        )}
      </div>
    </div>
  )
}
