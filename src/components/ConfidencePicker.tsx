import { useState } from 'react'
import { motion } from 'framer-motion'
import { Player } from '../store/gameStore'

interface Props {
  players: Player[]
  startingPlayerIndex: number
  onComplete: (choices: Record<number, number>) => void
}

const levelColors: Record<number, string> = {
  1: 'bg-green-500/80 hover:bg-green-500',
  2: 'bg-green-600/70 hover:bg-green-600',
  3: 'bg-lime-500/70 hover:bg-lime-500',
  4: 'bg-yellow-500/70 hover:bg-yellow-500',
  5: 'bg-yellow-600/70 hover:bg-yellow-600',
  6: 'bg-amber-500/70 hover:bg-amber-500',
  7: 'bg-orange-500/70 hover:bg-orange-500',
  8: 'bg-orange-600/70 hover:bg-orange-600',
  9: 'bg-red-500/70 hover:bg-red-500',
  10: 'bg-red-700/80 hover:bg-red-700',
}

export default function ConfidencePicker({ players, startingPlayerIndex, onComplete }: Props) {
  // Reorder players so that startingPlayerIndex goes first
  const orderedPlayers = [
    ...players.slice(startingPlayerIndex),
    ...players.slice(0, startingPlayerIndex),
  ]

  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [choices, setChoices] = useState<Record<number, number>>({})

  const takenLevels = Object.values(choices)
  const currentPlayer = orderedPlayers[currentPlayerIdx]

  function handleSelect(level: number) {
    if (takenLevels.includes(level)) return
    const updated = { ...choices, [currentPlayer.id]: level }
    setChoices(updated)

    if (currentPlayerIdx + 1 < orderedPlayers.length) {
      setCurrentPlayerIdx(currentPlayerIdx + 1)
    } else {
      onComplete(updated)
    }
  }

  function handleUndo() {
    if (currentPlayerIdx === 0) return
    const prevIdx = currentPlayerIdx - 1
    const prevPlayer = orderedPlayers[prevIdx]
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
                  ${taken ? 'bg-white/5 text-white/20 cursor-not-allowed' : `${levelColors[level]} text-white active:scale-90`}
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
