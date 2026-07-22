import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '../store/gameStore'
import { Category, getQuestion, Question } from '../data/questions'

interface Props {
  player: Player
  category: Category
  difficulty: number
  allPlayers: Player[]
  currentPlayerId: number
  onResult: (playerId: number, correct: boolean, points: number, mockery?: string) => void
  onSteal: (stealerId: number, success: boolean) => void
}

export default function QuestionScreen({ player, category, difficulty, allPlayers, currentPlayerId, onResult, onSteal }: Props) {
  const [question] = useState<Question>(() => getQuestion(category, difficulty))
  const [revealed, setRevealed] = useState(false)
  const [stealPhase, setStealPhase] = useState(false)
  const [stealAttempterId, setStealAttempterId] = useState<number | null>(null)
  const [showStealOption, setShowStealOption] = useState(false)

  const isLevel10 = difficulty === 10

  function handleReveal() {
    setRevealed(true)
  }

  function handleCorrect() {
    onResult(currentPlayerId, true, difficulty)
  }

  function handleWrong() {
    if (isLevel10) {
      setShowStealOption(true)
    } else {
      onResult(currentPlayerId, false, 0, question.mockery)
    }
  }

  function handleActivateSteal() {
    setShowStealOption(false)
    setStealPhase(true)
  }

  function handleSkipSteal() {
    onResult(currentPlayerId, false, 0, question.mockery)
  }

  function handleStealAttempt(stealerId: number) {
    setStealAttempterId(stealerId)
  }

  function handleStealResult(success: boolean) {
    if (stealAttempterId !== null) {
      onSteal(stealAttempterId, success)
    }
    onResult(currentPlayerId, false, 0, question.mockery)
  }

  function handleNoSteal() {
    onResult(currentPlayerId, false, 0, question.mockery)
  }

  const eligibleStealers = allPlayers.filter(p => p.id !== currentPlayerId && !p.stealUsed)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-card rounded-3xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
          Niveau {difficulty}
        </span>
        <span className="text-white/60 text-sm font-semibold">
          🎯 {player.name}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!stealPhase && !showStealOption ? (
          <motion.div key="main" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-surface-light rounded-2xl p-5 mb-4">
              <p className="text-white font-medium text-lg leading-relaxed">
                {question.question}
              </p>
            </div>

            {!revealed ? (
              <button
                onClick={handleReveal}
                className="w-full py-5 rounded-3xl font-display text-lg font-bold bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg tap-scale mb-2"
              >
                👁️ Révéler la réponse
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-4 mb-4">
                  <p className="text-primary-light text-sm font-semibold mb-1">Réponse :</p>
                  <p className="text-white font-bold text-lg">{question.answer}</p>
                  {question.explanation && (
                    <p className="text-white/50 text-sm mt-2">💡 {question.explanation}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleWrong}
                    className="flex-1 py-4 rounded-2xl font-display font-bold bg-destructive text-white tap-scale text-lg"
                  >
                    ✗ Raté
                  </button>
                  <button
                    onClick={handleCorrect}
                    className="flex-1 py-4 rounded-2xl font-display font-bold bg-success text-white tap-scale text-lg"
                  >
                    ✓ Correct
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : showStealOption ? (
          <motion.div
            key="steal-option"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-4xl">❌</span>
            <h3 className="font-display text-xl font-bold text-destructive mt-2 mb-2">
              {player.name} a raté !
            </h3>
            <p className="text-white/60 text-sm mb-6">
              C'est une question à 10 points — un vol est possible !
            </p>

            {eligibleStealers.length > 0 ? (
              <div className="space-y-3">
                <button
                  onClick={handleActivateSteal}
                  className="w-full py-4 rounded-2xl font-display font-bold bg-gradient-to-r from-accent to-accent-dark text-white tap-scale text-lg"
                >
                  🏴‍☠️ Vol !
                </button>
                <button
                  onClick={handleSkipSteal}
                  className="w-full py-3 rounded-2xl bg-surface-light text-white/50 font-semibold tap-scale"
                >
                  Pas de vol → Suivant
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/40 text-sm italic">Aucun joueur ne peut voler (tous ont déjà utilisé leur vol)</p>
                <button
                  onClick={handleSkipSteal}
                  className="w-full py-3 rounded-2xl bg-surface-light text-white/50 font-semibold tap-scale"
                >
                  Suivant →
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="steal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-4">
              <span className="text-4xl">🏴‍☠️</span>
              <h3 className="font-display text-xl font-bold text-accent mt-2">Qui tente le vol ?</h3>
              <p className="text-white/60 text-sm mt-1">
                Un seul joueur peut tenter (1 vol max par partie)
              </p>
            </div>

            {stealAttempterId === null ? (
              <div className="space-y-2">
                {eligibleStealers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleStealAttempt(p.id)}
                    className="w-full py-3 rounded-2xl bg-accent/20 text-accent font-semibold tap-scale hover:bg-accent/30 transition-all"
                  >
                    🏴‍☠️ {p.name} tente le vol !
                  </button>
                ))}
                <button
                  onClick={handleNoSteal}
                  className="w-full py-3 rounded-2xl bg-surface-light text-white/50 font-semibold tap-scale mt-2"
                >
                  Personne ne tente →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-white font-semibold">
                  {allPlayers.find(p => p.id === stealAttempterId)?.name} a répondu...
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStealResult(false)}
                    className="flex-1 py-4 rounded-2xl font-display font-bold bg-destructive text-white tap-scale"
                  >
                    ✗ Raté
                  </button>
                  <button
                    onClick={() => handleStealResult(true)}
                    className="flex-1 py-4 rounded-2xl font-display font-bold bg-success text-white tap-scale"
                  >
                    ✓ Réussi !
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
