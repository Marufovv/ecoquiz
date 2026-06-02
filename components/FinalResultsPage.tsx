'use client'

import type { AppState } from '@/app/page'
import { getScoreEmoji } from '@/lib/utils'

interface FinalResultsPageProps {
  state: AppState
  onRestart: () => void
  onNewFile: () => void
}

export default function FinalResultsPage({ state, onRestart, onNewFile }: FinalResultsPageProps) {
  const allCorrect = state.packages.reduce((a, p) => a + p.correct, 0)
  const allTotal = state.allQuestions.length
  const avgPct = Math.round((allCorrect / allTotal) * 100)
  const emoji = getScoreEmoji(avgPct)

  const allWrong = state.packages.flatMap((pkg) =>
    pkg.questions.filter((_, i) => pkg.answers[i] !== pkg.questions[i].togri).map((q, i) => ({
      q,
      userAns: pkg.answers[i] !== undefined ? q.variantlar[pkg.answers[i]] : 'Javob berilmadi',
    }))
  )

  return (
    <div className="max-w-[820px] mx-auto px-7 py-8 flex flex-col gap-6">
      {/* Hero */}
      <div
        className="rounded-3xl p-10 text-center"
        style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.14),rgba(14,165,233,0.09))', border: '1px solid rgba(37,99,235,0.25)' }}
      >
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">
          {avgPct >= 90 ? `Mukammal natija, ${state.userName}!` :
           avgPct >= 70 ? `Zo'r harakat, ${state.userName}!` :
           avgPct >= 50 ? `Yaxshi, ${state.userName}! Davom eting.` :
           `Kuchli harakat, ${state.userName}!`}
        </h1>
        <p className="text-sm mb-6" style={{ color: '#93afd4' }}>
          Jami {allTotal} savoldan {allCorrect} tasini to'g'ri yechdingiz. Umumiy ball: {avgPct}%
        </p>
        {/* Big stats */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[
            { num: `${avgPct}%`, label: 'Umumiy ball', color: '#38bdf8' },
            { num: allCorrect, label: "To'g'ri", color: '#10b981' },
            { num: allTotal - allCorrect, label: 'Xato', color: '#ef4444' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
              <div className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.num}</div>
              <div className="text-[11px]" style={{ color: '#4a7fa0' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-package results */}
      <div className="rounded-3xl p-6" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
        <h3 className="text-sm font-bold mb-4">📈 Har paket natijalari</h3>
        <div className="flex flex-col gap-2.5">
          {state.packages.map((p, i) => {
            const cls = p.score >= 70 ? '#10b981' : p.score >= 50 ? '#f59e0b' : '#ef4444'
            return (
              <div key={i} className="flex items-center justify-between rounded-xl p-3.5" style={{ background: 'rgba(22,48,88,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
                <div>
                  <span className="text-sm font-semibold">{i + 1}-paket</span>
                  <span className="text-xs ml-2" style={{ color: '#4a7fa0' }}>({p.start}–{p.end} savol)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#93afd4' }}>{p.correct}/{p.questions.length}</span>
                  <span className="text-sm font-bold" style={{ color: cls }}>{p.score}%</span>
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(22,48,88,0.7)' }}>
                    <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: cls }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* All errors */}
      <div className="rounded-3xl p-6" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
        <h3 className="text-sm font-bold mb-4">📊 Barcha xatolar ({allWrong.length} ta)</h3>
        {allWrong.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: '#10b981' }}>
            ✅ Hech qanday xato yo'q! Barcha savollar to'g'ri!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {allWrong.map(({ q, userAns }, i) => (
              <div
                key={i}
                className="rounded-xl p-3.5"
                style={{ borderLeft: '3px solid #ef4444', background: 'rgba(22,48,88,0.4)', borderRadius: '0 10px 10px 0', paddingLeft: '14px' }}
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold mb-1.5" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  ✗ Xato
                </span>
                <p className="text-sm font-semibold mb-1">{q.savol}</p>
                <p className="text-xs" style={{ color: '#ef4444' }}>Sizning: {userAns}</p>
                <p className="text-xs" style={{ color: '#10b981' }}>✓ To'g'ri: {q.variantlar[q.togri]}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onRestart}
          className="px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 0 22px rgba(14,165,233,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          🔄 Qaytadan boshlash
        </button>
        <button
          onClick={onNewFile}
          className="px-7 py-3.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', color: '#38bdf8' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.16)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.08)' }}
        >
          📂 Yangi fayl
        </button>
      </div>
    </div>
  )
}
