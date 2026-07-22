import { Category } from '../data/questions'

export interface Player {
  id: number
  name: string
  score: number
  stealUsed: boolean
}

export interface RoundState {
  roundNumber: number
  theme: Category | null
  confidenceChoices: Record<number, number> // playerId -> level
  currentPlayerIndex: number
  questionsAnswered: Record<number, boolean> // playerId -> correct
  phase: 'theme-selection' | 'category-reveal' | 'confidence' | 'question' | 'result' | 'scoreboard'
}

export interface GameState {
  players: Player[]
  totalRounds: number
  currentRound: number
  roundState: RoundState
  themeChooserIndex: number
  usedThemes: Category[]
  gamePhase: 'setup' | 'playing' | 'finished'
}

const USED_THEMES_KEY = 'confidence-quiz-used-themes'

export function getGlobalUsedThemes(): Category[] {
  try {
    const stored = localStorage.getItem(USED_THEMES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addGlobalUsedTheme(theme: Category) {
  const themes = getGlobalUsedThemes()
  if (!themes.includes(theme)) {
    themes.push(theme)
    localStorage.setItem(USED_THEMES_KEY, JSON.stringify(themes))
  }
}

export function createInitialGameState(playerNames: string[], totalRounds: number): GameState {
  const players: Player[] = playerNames.map((name, i) => ({
    id: i,
    name,
    score: 0,
    stealUsed: false,
  }))

  return {
    players,
    totalRounds,
    currentRound: 1,
    roundState: {
      roundNumber: 1,
      theme: null,
      confidenceChoices: {},
      currentPlayerIndex: 0,
      questionsAnswered: {},
      phase: 'theme-selection',
    },
    themeChooserIndex: 0,
    usedThemes: getGlobalUsedThemes(),
    gamePhase: 'playing',
  }
}
