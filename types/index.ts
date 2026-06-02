export interface Question {
  savol: string
  variantlar: string[]
  togri: number
  tushuntirish?: string
}

export interface Package {
  start: number
  end: number
  questions: Question[]
  done: boolean
  score: number
  correct: number
  answers: Record<number, number>
}

export interface QuizSession {
  id: string
  fileName: string
  userName: string
  allQuestions: Question[]
  packages: Package[]
  pkgSize: number
  curPkg: number
  createdAt: Date
  completedAt?: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
}

export interface UserStats {
  totalTests: number
  totalCorrect: number
  totalQuestions: number
  streak: number
  xp: number
  level: number
  badges: Achievement[]
  history: HistoryItem[]
}

export interface HistoryItem {
  id: string
  date: string
  fileName: string
  score: number
  correct: number
  total: number
  pkgSize: number
}
