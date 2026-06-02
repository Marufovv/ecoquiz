'use client'

import { useState } from 'react'

interface LandingPageProps {
  onStart: (name: string) => void
}

const FEATURES = [
  { icon: '📄', title: 'Fayl yuklash', desc: 'DOCX, PDF va TXT formatlarni qo\'llab-quvvatlaydi. Drag & drop bilan oson yuklang.' },
  { icon: '🧩', title: 'Paketli test', desc: '10 yoki 25 lik paketlarga bo\'lib, asta-sekin o\'rganing. Bosim yo\'q.' },
  { icon: '📊', title: 'Batafsil tahlil', desc: 'Har paket yakunida to\'g\'ri/noto\'g\'ri javoblar tahlili va xatolar ustida ishlash.' },
  { icon: '🎯', title: 'Xatolar bo\'limi', desc: 'Yolg\'on javob bergan savollar alohida ko\'rsatiladi va takrorlanadi.' },
  { icon: '🔄', title: 'Qayta ishlash', desc: 'Istalgan paketni qayta yechish imkoni. Natijalar tarixda saqlanadi.' },
  { icon: '📱', title: 'Barcha qurilmalar', desc: 'Mobil, planshet va kompyuterda bir xil chiroyli ishlaydi.' },
]

const STATS = [
  { num: '150+', label: 'Savol fayllari' },
  { num: '10/25', label: 'Paket hajmi' },
  { num: '100%', label: 'Bepul' },
  { num: '0', label: 'Ro\'yxat kerak' },
]

export default function LandingPage({ onStart }: LandingPageProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleStart = () => {
    if (!name.trim()) { setError('Ismingizni kiriting'); return }
    onStart(name.trim())
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Financial bg decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* Candlestick chart decoration */}
        <svg className="absolute top-20 right-10 opacity-[0.04]" width="300" height="200" viewBox="0 0 300 200">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <g key={i} transform={`translate(${i*36+10}, 0)`}>
              <line x1="12" y1={20+i*8} x2="12" y2={160-i*5} stroke="#38bdf8" strokeWidth="1"/>
              <rect x="6" y={40+i*6} width="12" height={60-i*4} fill={i%2===0?"#0ea5e9":"#ef4444"} rx="1"/>
            </g>
          ))}
        </svg>
        {/* Growth arrow */}
        <svg className="absolute bottom-40 left-10 opacity-[0.05]" width="200" height="150" viewBox="0 0 200 150">
          <polyline points="10,130 50,90 90,100 130,50 170,20" fill="none" stroke="#38bdf8" strokeWidth="2"/>
          <polygon points="170,20 155,30 165,45" fill="#38bdf8"/>
        </svg>
        {/* Pie chart */}
        <svg className="absolute top-1/2 left-1/4 opacity-[0.04]" width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="188 189"/>
          <circle cx="80" cy="80" r="60" fill="none" stroke="#2563eb" strokeWidth="20" strokeDasharray="100 277" strokeDashoffset="-188"/>
          <circle cx="80" cy="80" r="60" fill="none" stroke="#38bdf8" strokeWidth="20" strokeDasharray="78 299" strokeDashoffset="-288"/>
        </svg>
        {/* Dollar signs */}
        <div className="absolute top-1/3 right-1/4 text-[120px] font-bold opacity-[0.03] text-[#38bdf8]">$</div>
        <div className="absolute bottom-1/3 left-1/3 text-[80px] font-bold opacity-[0.03] text-[#0ea5e9]">%</div>
        {/* Bar chart */}
        <svg className="absolute bottom-20 right-1/3 opacity-[0.04]" width="180" height="120" viewBox="0 0 180 120">
          {[40,65,45,80,55,70,90].map((h,i) => (
            <rect key={i} x={i*24+4} y={120-h} width="18" height={h} fill="#2563eb" rx="2"/>
          ))}
        </svg>
      </div>

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-8"
            style={{
              background: 'rgba(37,99,235,0.12)',
              border: '1px solid rgba(37,99,235,0.25)',
              color: '#38bdf8',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            ⚡ AI bilan ishlaydigan test platformasi
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 0 30px rgba(14,165,233,0.5)' }}
            >
              🌿
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit,sans-serif' }}>
              <span style={{ background: 'linear-gradient(135deg,#38bdf8,#7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                EcoQuiz
              </span>
            </h1>
          </div>

          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ fontFamily: 'Outfit,sans-serif' }}
          >
            Faylingizdan{' '}
            <span style={{ background: 'linear-gradient(135deg,#2563eb,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              avtomatik test
            </span>
            <br />yarating
          </h2>

          <p className="text-lg mb-12 max-w-xl mx-auto leading-relaxed" style={{ color: '#93afd4', fontFamily: 'Outfit,sans-serif' }}>
            DOCX, PDF yoki TXT faylingizni yuklang — sayt savollarni topib,
            paketlarga bo'lib, test yaratadi. Tahlil va xatolar ustida ishlash imkoni bor.
          </p>

          {/* Name input + Start */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="text"
              placeholder="Ismingizni kiriting..."
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="flex-1 rounded-xl px-5 py-4 text-sm font-medium outline-none transition-all"
              style={{
                background: 'rgba(10,31,61,0.8)',
                border: `1px solid ${error ? '#ef4444' : 'rgba(26,58,107,0.8)'}`,
                color: '#e8f0fe',
                fontFamily: 'Outfit,sans-serif',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.15)' }}
              onBlur={(e) => { if (!error) { e.currentTarget.style.borderColor = 'rgba(26,58,107,0.8)'; e.currentTarget.style.boxShadow = 'none' } }}
            />
            <button
              onClick={handleStart}
              className="px-7 py-4 rounded-xl font-bold text-sm text-white transition-all"
              style={{
                background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
                boxShadow: '0 0 28px rgba(14,165,233,0.35)',
                fontFamily: 'Outfit,sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 44px rgba(14,165,233,0.55)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(14,165,233,0.35)' }}
            >
              Boshlash →
            </button>
          </div>
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <p className="text-xs" style={{ color: '#4a7fa0' }}>
            Ro'yxatdan o'tish shart emas · Bepul · Istalgan vaqt
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs" style={{ color: '#93afd4' }}>Pastga aylantiring</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #38bdf8, transparent)' }} />
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl p-5 text-center"
              style={{ background: 'rgba(10,31,61,0.6)', border: '1px solid rgba(26,58,107,0.6)', backdropFilter: 'blur(12px)' }}
            >
              <div
                className="text-3xl font-extrabold mb-1"
                style={{ background: 'linear-gradient(135deg,#38bdf8,#7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {s.num}
              </div>
              <div className="text-xs font-medium" style={{ color: '#4a7fa0' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-extrabold text-center mb-3 tracking-tight">
            Nima imkoniyatlar bor?
          </h3>
          <p className="text-center mb-12 text-sm" style={{ color: '#93afd4' }}>
            Oddiy va qulay — lekin ichida kuchli
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 transition-all cursor-default"
                style={{ background: 'rgba(10,31,61,0.5)', border: '1px solid rgba(26,58,107,0.5)', backdropFilter: 'blur(12px)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(26,58,107,0.5)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h4 className="font-bold text-base mb-2">{f.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#93afd4' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(14,165,233,0.1))', border: '1px solid rgba(37,99,235,0.25)' }}
        >
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Hoziroq boshlang</h3>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: '#93afd4' }}>
            Faylingizni yuklang va bir daqiqada test yarating. Ro'yxatdan o'tish shart emas.
          </p>
          <button
            onClick={() => { if (!name.trim()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }; handleStart() }}
            className="px-10 py-4 rounded-xl font-bold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 0 30px rgba(14,165,233,0.4)', fontFamily: 'Outfit,sans-serif' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(14,165,233,0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(14,165,233,0.4)' }}
          >
            Testni boshlash →
          </button>
        </div>
      </section>

      <footer className="relative z-10 py-8 text-center text-xs border-t" style={{ color: '#4a7fa0', borderColor: 'rgba(26,58,107,0.4)' }}>
        © 2025 EcoQuiz · Barcha huquqlar himoyalangan
      </footer>
    </div>
  )
}
