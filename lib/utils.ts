import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Question } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseQuestions(text: string): Question[] {
  if (text.includes('++++') || text.includes('====')) {
    return parseFormat1(text)
  }
  return parseFormat2(text)
}

function parseFormat1(text: string): Question[] {
  const qs: Question[] = []
  const blocks = text.split(/\+{3,}/)
  for (const block of blocks) {
    const parts = block
      .split(/={3,}/)
      .map((s) => s.replace(/\*{1,3}/g, '').trim())
      .filter(Boolean)
    if (parts.length < 2) continue
    const savol = parts[0]
    if (!savol || savol.length < 3) continue
    const variantlar: string[] = []
    let togri = -1
    for (let i = 1; i < parts.length; i++) {
      const v = parts[i]
      if (!v) continue
      if (v.startsWith('#')) {
        variantlar.push(v.substring(1).trim())
        togri = variantlar.length - 1
      } else {
        variantlar.push(v.trim())
      }
    }
    if (variantlar.length >= 2 && togri >= 0) {
      qs.push({ savol: savol.trim(), variantlar, togri, tushuntirish: '' })
    }
  }
  return qs
}

function parseFormat2(text: string): Question[] {
  const qs: Question[] = []
  const qBlocks = text.split(/\n(?=\d+[\.\)]\s)/)
  for (const block of qBlocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue
    const savol = lines[0].replace(/^\d+[\.\)]\s*/, '').trim()
    if (!savol || savol.length < 4) continue
    const variantlar: string[] = []
    let togri = -1
    let javobLine = ''
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i]
      if (/^javob\s*:\s*/i.test(l)) {
        javobLine = l.replace(/^javob\s*:\s*/i, '').trim().toUpperCase()
        continue
      }
      const m = l.match(/^([A-Da-d])[\.\)]\s*(.+)/)
      if (m) {
        if (m[2].startsWith('#') || m[2].startsWith('*')) togri = variantlar.length
        variantlar.push(m[2].replace(/^[#*]/, '').trim())
      }
    }
    if (javobLine) {
      const idx: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
      if (idx[javobLine] !== undefined) togri = idx[javobLine]
    }
    if (variantlar.length >= 2 && togri >= 0) {
      qs.push({ savol, variantlar, togri })
    }
  }
  return qs
}

export function buildPackages(questions: Question[], pkgSize: number) {
  const packages = []
  for (let i = 0; i < questions.length; i += pkgSize) {
    const chunk = questions.slice(i, i + pkgSize)
    packages.push({
      start: i + 1,
      end: Math.min(i + pkgSize, questions.length),
      questions: chunk,
      done: false,
      score: 0,
      correct: 0,
      answers: {} as Record<number, number>,
    })
  }
  return packages
}

export function getScoreEmoji(pct: number): string {
  if (pct >= 90) return '🏆'
  if (pct >= 70) return '🎉'
  if (pct >= 50) return '👍'
  return '📚'
}

export function getScoreTitle(pct: number, name: string): string {
  if (pct >= 90) return `Mukammal natija, ${name}!`
  if (pct >= 70) return `Zo'r harakat, ${name}!`
  if (pct >= 50) return `Yaxshi, ${name}!`
  return `Davom eting, ${name}!`
}

export function getScoreSub(pct: number): string {
  if (pct >= 90) return "Siz bu mavzuni mukammal bilasiz!"
  if (pct >= 70) return "Bir oz mashq qilsangiz mukammal bo'lasiz!"
  if (pct >= 50) return "Asosiy qismlarni bilasiz, davom eting!"
  return "Matnni qayta o'qib, test bering!"
}

export async function readDOCX(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const buf = await file.arrayBuffer()
  const result = await (mammoth as any).extractRawText({ arrayBuffer: buf })
  return result.value
}

export async function readPDF(
  file: File,
  onProgress?: (page: number, total: number) => void
): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  ;(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  const buf = await file.arrayBuffer()
  const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item: any) => item.str).join(' ') + '\n'
    onProgress?.(i, pdf.numPages)
  }
  return text
}

export function readTXT(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = (e) => res(e.target?.result as string)
    reader.onerror = () => rej(new Error("TXT o'qishda xato"))
    reader.readAsText(file, 'UTF-8')
  })
}

export function saveToStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch { return fallback }
}
