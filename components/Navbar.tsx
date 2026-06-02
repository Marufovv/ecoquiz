'use client'

interface NavbarProps {
  userName: string
  onLogout: () => void
  onHome: () => void
}

export default function Navbar({ userName, onLogout, onHome }: NavbarProps) {
  return (
    <nav
      className="sticky top-0 z-50 h-[62px] flex items-center justify-between px-7 border-b"
      style={{
        background: 'rgba(4,13,26,0.88)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(26,58,107,0.7)',
      }}
    >
      <button onClick={onHome} className="flex items-center gap-2.5 font-extrabold text-[19px] tracking-tight">
        <div
          className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[17px]"
          style={{
            background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
            boxShadow: '0 0 18px rgba(14,165,233,0.4)',
          }}
        >
          🌿
        </div>
        <span style={{ background: 'linear-gradient(135deg,#38bdf8,#7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          EcoQuiz
        </span>
      </button>

      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-1 pl-1.5"
          style={{ background: 'rgba(10,31,61,0.8)', border: '1px solid rgba(26,58,107,0.8)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)' }}
          >
            {userName[0]?.toUpperCase()}
          </div>
          <span className="text-[13px] font-medium" style={{ color: '#93afd4' }}>{userName}</span>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all"
          style={{ background: 'transparent', border: '1px solid rgba(26,58,107,0.8)', color: '#93afd4' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.6)'; e.currentTarget.style.color = '#e8f0fe' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(26,58,107,0.8)'; e.currentTarget.style.color = '#93afd4' }}
        >
          Chiqish
        </button>
      </div>
    </nav>
  )
}
