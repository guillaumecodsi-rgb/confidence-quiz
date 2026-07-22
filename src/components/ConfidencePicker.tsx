import { useState } from 'react'
import { motion } from 'framer-motion'
import { Player } from '../store/gameStore'

interface Props {
  players: Player[]
  onComplete: (choices: Record<number, number>) => void
}

export default function ConfidencePicker({ players, onComplete }: Props) {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [choices, setChoices] = useState<Record<number, number>>({})

  const takenLevels = Object.values(choices)
  const currentPlayer = players[currentPlayerIdx]

  function handleSelect(level: number) {
    if (takenLevels.includes(level)) return
    const updated = { ...choices, [currentPlayer.id]: level }
    setChoices(updated)

    if (currentPlayerIdx + 1 < players.length) {
      setCurrentPlayerIdx(currentPlayerIdx + 1)
    } else {
      onComplete(updated)
    }
  }

  function handleUndo() {
    if (currentPlayerIdx === 0) return
    const prevIdx = currentPlayerIdx - 1
    const prevPlayer = players[prevIdx]
    const updated = { ...choices }
    delete updated[prevPlayer.id]
    setChoices(updated)
    setCurrentPlayerIdx(prevIdx)
  }

  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-card rounded-3xl p-6 shadow-2xl"
    >
      <motion.div
        key={currentPlayerIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-white/50 text-sm text-center mb-1">
          Joueur {currentPlayerIdx + 1}/{players.length}
        </p>
        <h2 className="font-display text-xl font-bold text-center mb-1 text-white">
          {currentPlayer.name}
        </h2>
        <p className="text-center text-white/60 text-sm mb-4">
          Choisis ton niveau de confiance (1 = facile, 10 = expert)
        </p>

        <div className="grid grid-cols-5 gap-3 mb-5">
          {levels.map(level => {
            const taken = takenLevels.includes(level)
            return (
              <button
                key={level}
                onClick={() => handleSelect(level)}
                disabled={taken}
                className={`
                  aspect-square rounded-2xl font-display text-2xl font-bold transition-all tap-scale
                  ${taken ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-surface-light text-white hover:bg-primary/30 active:bg-primary/50'}
                `}
              >
                {level}
              </button>
            )
          })}
        </div>

        {currentPlayerIdx > 0 && (
          <button
            onClick={handleUndo}
            className="w-full py-3 rounded-2xl bg-surface-light text-white/70 font-semibold tap-scale"
          >
            ↩ Retour (joueur précédent)
          </button>
        )}

        {Object.keys(choices).length > 0 && (
          <p className="text-center text-white/30 text-xs mt-3">
            Niveaux pris : {takenLevels.sort((a, b) => a - b).join(', ')}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
