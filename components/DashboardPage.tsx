'use client'

import { useState, useRef } from 'react'
import type { AppState } from '@/app/page'
import type { Question } from '@/types'
import { parseQuestions, readDOCX, readPDF, readTXT, buildPackages } from '@/lib/utils'

interface DashboardPageProps {
  state: AppState
  onQuestionsLoaded: (q: Question[], fileName: string, pkgSize: number) => void
  onStartPackage: () => void
  onSelectPkgSize: (size: number) => void
}

export default function DashboardPage({ state, onQuestionsLoaded, onStartPackage, onSelectPkgSize }: DashboardPageProps) {
  const [reading, setReading] = useState(false)
  const [readingMsg, setReadingMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    setReading(true)
    setReadingMsg('Fayl o\'qilmoqda...')
    try {
      let text = ''
      if (ext === 'txt') {
        text = await readTXT(file)
      } else if (ext === 'docx') {
        setReadingMsg('DOCX o\'qilmoqda...')
        text = await readDOCX(file)
      } else if (ext === 'pdf') {
        text = await readPDF(file, (p, t) => setReadingMsg(`PDF: ${p}/${t} sahifa...`))
      } else {
        throw new Error('Noto\'g\'ri format. DOCX, TXT yoki PDF yuklang.')
      }
      if (!text || text.trim().length < 20) throw new Error('Fayldan matn o\'qib bo\'lmadi.')
      const questions = parseQuestions(text)
      if (!questions.length) throw new Error('Savollar topilmadi. Format: ==== / ++++ bo\'lishi kerak.')
      setReading(false)
      onQuestionsLoaded(questions, file.name, state.pkgSize || 10)
    } catch (err: any) {
      setReading(false)
      alert('Xato: ' + err.message)
    }
  }

  const totalQ = state.allQuestions.length
  const doneCount = state.packages.filter((p) => p.done).length
  const curPkg = state.packages[state.curPkg]
  const allDone = doneCount === state.packages.length && state.packages.length > 0

  const pkgOptions = totalQ > 0
    ? [10, 25].filter((n) => n <= totalQ)
    : [10, 25]
  if (totalQ > 0 && totalQ < 10) pkgOptions.unshift(totalQ)

  return (
    <div className="max-w-[860px] mx-auto px-7 py-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Salom, {state.userName}! 👋
        </h1>
        <p className="text-sm" style={{ color: '#93afd4' }}>
          Faylingizni yuklang — savollar avtomatik ajratiladi va paketlarga bo'lib beriladi
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onClick={() => fileRef.current?.click()}
        className="rounded-3xl p-12 text-center cursor-pointer transition-all"
        style={{
          border: `1.5px dashed ${dragging ? '#0ea5e9' : 'rgba(37,99,235,0.5)'}`,
          background: dragging ? 'rgba(14,165,233,0.06)' : 'rgba(15,36,66,0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <input ref={fileRef} type="file" accept=".txt,.docx,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        <div
          className="w-[66px] h-[66px] rounded-[18px] flex items-center justify-center mx-auto mb-4 text-[28px]"
          style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.18),rgba(14,165,233,0.12))', border: '1px solid rgba(14,165,233,0.22)' }}
        >
          📂
        </div>
        <p className="text-base font-semibold mb-1.5">Faylni bu yerga tashlang</p>
        <p className="text-sm" style={{ color: '#93afd4' }}>
          yoki <span style={{ color: '#38bdf8', fontWeight: 600 }}>fayl tanlash</span> uchun bosing
        </p>
        <div className="flex gap-2 justify-center mt-3">
          {['DOCX', 'TXT', 'PDF'].map((f) => (
            <span key={f} className="text-[11px] font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(10,31,61,0.8)', border: '1px solid rgba(26,58,107,0.7)', color: '#4a7fa0' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Reading progress */}
      {reading && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm" style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8' }}>
          <div className="w-4 h-4 rounded-full border-2 border-[rgba(14,165,233,0.3)] border-t-[#38bdf8] animate-spin flex-shrink-0" />
          {readingMsg}
        </div>
      )}

      {/* File loaded */}
      {totalQ > 0 && !reading && (
        <>
          <div className="flex items-center gap-3.5 rounded-2xl px-5 py-3.5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.22)' }}>
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(16,185,129,0.14)' }}>✅</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#10b981' }}>{state.fileName}</p>
              <p className="text-xs mt-0.5" style={{ color: '#4a7fa0' }}>{totalQ} ta savol topildi ✓</p>
            </div>
            <button
              onClick={() => onQuestionsLoaded([], '', state.pkgSize)}
              className="w-7 h-7 rounded-lg text-sm transition-all flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
            >✕</button>
          </div>

          {/* Package selector */}
          <div className="rounded-3xl p-6" style={{ background: 'rgba(10,31,61,0.6)', border: '1px solid rgba(26,58,107,0.6)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#93afd4' }}>📦 Paket hajmini tanlang</p>
            <p className="text-xs mb-4" style={{ color: '#4a7fa0' }}>
              Jami {totalQ} ta savol. Bir paketda nechta savol ishlashni tanlang:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {pkgOptions.map((n) => {
                const pkgCount = Math.ceil(totalQ / n)
                const isActive = state.pkgSize === n
                return (
                  <button
                    key={n}
                    onClick={() => onSelectPkgSize(n)}
                    className="rounded-2xl p-4 text-center transition-all relative"
                    style={{
                      background: isActive ? 'rgba(14,165,233,0.12)' : 'rgba(22,48,88,0.5)',
                      border: `1.5px solid ${isActive ? '#0ea5e9' : 'rgba(26,58,107,0.7)'}`,
                    }}
                  >
                    {n === 10 && <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}>Tez</span>}
                    {n === 25 && <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>Optimal</span>}
                    <div className="text-3xl font-extrabold mb-1" style={{ background: 'linear-gradient(135deg,#38bdf8,#7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
                    <div className="text-xs font-medium mb-1" style={{ color: '#93afd4' }}>savol / paket</div>
                    <div className="text-[11px]" style={{ color: '#4a7fa0' }}>{pkgCount} ta paket × {n} savol</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Overall progress */}
          {doneCount > 0 && (
            <div className="rounded-2xl p-4" style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)' }}>
              <div className="flex justify-between mb-2.5 text-sm">
                <span className="font-semibold" style={{ color: '#93afd4' }}>Umumiy progress</span>
                <span className="font-bold" style={{ color: '#38bdf8' }}>{Math.round(doneCount / state.packages.length * 100)}%</span>
              </div>
              <div className="rounded-full h-2 overflow-hidden" style={{ background: 'rgba(22,48,88,0.7)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${doneCount / state.packages.length * 100}%`, background: 'linear-gradient(90deg,#2563eb,#0ea5e9)' }}
                />
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {state.packages.map((p, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
                    style={{
                      background: p.done ? 'rgba(16,185,129,0.1)' : i === state.curPkg ? 'rgba(14,165,233,0.1)' : 'rgba(22,48,88,0.5)',
                      color: p.done ? '#10b981' : i === state.curPkg ? '#38bdf8' : '#4a7fa0',
                      border: `1px solid ${p.done ? 'rgba(16,185,129,0.2)' : i === state.curPkg ? 'rgba(14,165,233,0.2)' : 'rgba(26,58,107,0.4)'}`,
                    }}
                  >
                    {i + 1}-paket {p.done ? `(${p.score}%)` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={onStartPackage}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 0 36px rgba(14,165,233,0.28)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 52px rgba(14,165,233,0.45)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(14,165,233,0.28)' }}
          >
            ▶{' '}
            {allDone
              ? 'Qaytadan boshlash'
              : curPkg
              ? `${state.curPkg + 1}-paketni boshlash (${curPkg?.start}–${curPkg?.end} savollar)`
              : `Testni boshlash (${Math.ceil(totalQ / state.pkgSize)} paket)`}
          </button>
        </>
      )}
    </div>
  )
}
