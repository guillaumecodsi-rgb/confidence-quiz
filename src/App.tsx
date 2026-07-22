import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SetupScreen from './components/SetupScreen'
import ThemeSelectionScreen from './components/ThemeSelectionScreen'
import CategoryReveal from './components/CategoryReveal'
import ConfidencePicker from './components/ConfidencePicker'
import QuestionScreen from './components/QuestionScreen'
import ResultScreen from './components/ResultScreen'
import ScoreboardScreen from './components/ScoreboardScreen'
import FinalScreen from './components/FinalScreen'
import { GameState, createInitialGameState, addGlobalUsedTheme } from './store/gameStore'
import { Category, getRandomCategories } from './data/questions'

type Screen = 'setup' | 'theme-selection' | 'category-reveal' | 'confidence' | 'question' | 'result' | 'scoreboard' | 'final'

const SAVED_GAME_KEY = 'confidence-quiz-saved-game'
const SAVED_SCREEN_KEY = 'confidence-quiz-saved-screen'
const SAVED_PLAYER_IDX_KEY = 'confidence-quiz-saved-player-idx'

function saveGameToStorage(game: GameState, screen: Screen, playerIdx: number) {
  try {
    localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(game))
    localStorage.setItem(SAVED_SCREEN_KEY, screen)
    localStorage.setItem(SAVED_PLAYER_IDX_KEY, String(playerIdx))
  } catch {}
}

function loadGameFromStorage(): { game: GameState; screen: Screen; playerIdx: number } | null {
  try {
    const gameStr = localStorage.getItem(SAVED_GAME_KEY)
    const screen = localStorage.getItem(SAVED_SCREEN_KEY) as Screen | null
    const playerIdx = localStorage.getItem(SAVED_PLAYER_IDX_KEY)
    if (gameStr && screen && screen !== 'setup' && screen !== 'final') {
      return { game: JSON.parse(gameStr), screen, playerIdx: Number(playerIdx || 0) }
    }
  } catch {}
  return null
}

function clearSavedGame() {
  localStorage.removeItem(SAVED_GAME_KEY)
  localStorage.removeItem(SAVED_SCREEN_KEY)
  localStorage.removeItem(SAVED_PLAYER_IDX_KEY)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [game, setGame] = useState<GameState | null>(null)
  const [currentQuestionPlayerIndex, setCurrentQuestionPlayerIndex] = useState(0)
  const [lastResult, setLastResult] = useState<{ correct: boolean; playerName: string; points: number; mockery?: string } | null>(null)
  const [hasSavedGame, setHasSavedGame] = useState(false)

  useEffect(() => {
    setHasSavedGame(loadGameFromStorage() !== null)
  }, [])

  // Persist game state on every change
  useEffect(() => {
    if (game && screen !== 'setup' && screen !== 'final') {
      saveGameToStorage(game, screen, currentQuestionPlayerIndex)
    }
  }, [game, screen, currentQuestionPlayerIndex])

  function handleStartGame(names: string[], rounds: number) {
    clearSavedGame()
    const state = createInitialGameState(names, rounds)
    setGame(state)
    const randomCats = getRandomCategories(1, state.usedThemes)
    if (randomCats.length > 0) {
      state.roundState.theme = randomCats[0]
      addGlobalUsedTheme(randomCats[0])
      state.usedThemes.push(randomCats[0])
    }
    setScreen('category-reveal')
    setHasSavedGame(false)
  }

  function handleResumeGame() {
    const saved = loadGameFromStorage()
    if (saved) {
      setGame(saved.game)
      setScreen(saved.screen)
      setCurrentQuestionPlayerIndex(saved.playerIdx)
    }
  }

  function handleGoHome() {
    setScreen('setup')
    setGame(null)
    setHasSavedGame(loadGameFromStorage() !== null)
  }

  function handleThemeSelected(category: Category) {
    if (!game) return
    const updated = { ...game }
    updated.roundState.theme = category
    addGlobalUsedTheme(category)
    updated.usedThemes.push(category)
    setGame(updated)
    setScreen('category-reveal')
  }

  function handleCategoryRevealDone() {
    setScreen('confidence')
  }

  function handleConfidenceComplete(choices: Record<number, number>) {
    if (!game) return
    const updated = { ...game }
    updated.roundState.confidenceChoices = choices
    updated.roundState.currentPlayerIndex = 0
    setGame(updated)
    setCurrentQuestionPlayerIndex(0)
    setScreen('question')
  }

  function handleQuestionResult(playerId: number, correct: boolean, points: number, mockery?: string) {
    if (!game) return
    const updated = { ...game }
    const player = updated.players.find(p => p.id === playerId)
    if (player && correct) {
      player.score += points
    }
    updated.roundState.questionsAnswered[playerId] = correct
    setGame(updated)
    setLastResult({
      correct,
      playerName: player?.name || '',
      points: correct ? points : 0,
      mockery
    })
    setScreen('result')
  }

  function handleSteal(stealerId: number, success: boolean) {
    if (!game) return
    const updated = { ...game }
    const stealer = updated.players.find(p => p.id === stealerId)
    if (stealer) {
      stealer.stealUsed = true
      if (success) {
        stealer.score += 10
      }
    }
    setGame(updated)
  }

  function handleResultContinue() {
    if (!game) return
    const nextIndex = currentQuestionPlayerIndex + 1
    if (nextIndex < game.players.length) {
      setCurrentQuestionPlayerIndex(nextIndex)
      setScreen('question')
    } else {
      if (game.currentRound >= game.totalRounds) {
        clearSavedGame()
        setScreen('final')
      } else {
        setScreen('scoreboard')
      }
    }
  }

  function handleNextRound() {
    if (!game) return
    const updated = { ...game }
    updated.currentRound += 1
    updated.themeChooserIndex = (updated.themeChooserIndex + 1) % updated.players.length
    updated.roundState = {
      roundNumber: updated.currentRound,
      theme: null,
      confidenceChoices: {},
      currentPlayerIndex: 0,
      questionsAnswered: {},
      phase: 'theme-selection',
    }
    setGame(updated)
    setCurrentQuestionPlayerIndex(0)
    setScreen('theme-selection')
  }

  function handleRestart() {
    clearSavedGame()
    setGame(null)
    setScreen('setup')
    setHasSavedGame(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 safe-bottom safe-top">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Home button — always visible except on setup & final */}
        {screen !== 'setup' && screen !== 'final' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleGoHome}
            className="mb-3 flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors tap-scale text-sm py-2"
          >
            <span>←</span>
            <span>Accueil</span>
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {screen === 'setup' && (
            <SetupScreen key="setup" onStart={handleStartGame} hasSavedGame={hasSavedGame} onResume={handleResumeGame} />
          )}
          {screen === 'theme-selection' && game && (
            <ThemeSelectionScreen
              key="theme-selection"
              chooser={game.players[game.themeChooserIndex]}
              usedThemes={game.usedThemes}
              onSelect={handleThemeSelected}
            />
          )}
          {screen === 'category-reveal' && game && game.roundState.theme && (
            <CategoryReveal
              key="category-reveal"
              category={game.roundState.theme}
              roundNumber={game.currentRound}
              onContinue={handleCategoryRevealDone}
            />
          )}
          {screen === 'confidence' && game && (
            <ConfidencePicker
              key="confidence"
              players={game.players}
              onComplete={handleConfidenceComplete}
            />
          )}
          {screen === 'question' && game && game.roundState.theme && (
            <QuestionScreen
              key={`question-${currentQuestionPlayerIndex}`}
              player={game.players[currentQuestionPlayerIndex]}
              category={game.roundState.theme}
              difficulty={game.roundState.confidenceChoices[game.players[currentQuestionPlayerIndex].id]}
              allPlayers={game.players}
              currentPlayerId={game.players[currentQuestionPlayerIndex].id}
              onResult={handleQuestionResult}
              onSteal={handleSteal}
            />
          )}
          {screen === 'result' && lastResult && (
            <ResultScreen
              key="result"
              correct={lastResult.correct}
              playerName={lastResult.playerName}
              points={lastResult.points}
              mockery={lastResult.mockery}
              onContinue={handleResultContinue}
            />
          )}
          {screen === 'scoreboard' && game && (
            <ScoreboardScreen
              key="scoreboard"
              players={game.players}
              currentRound={game.currentRound}
              totalRounds={game.totalRounds}
              onNextRound={handleNextRound}
            />
          )}
          {screen === 'final' && game && (
            <FinalScreen
              key="final"
              players={game.players}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
