import { motion } from 'framer-motion'
import { Player } from '../store/gameStore'

interface Props {
  players: Player[]
  onRestart: () => void
}

const winnerPhrases = [
  "Champion·ne incontesté·e ! 🏆",
  "La confiance a payé ! 💰",
  "On s'incline devant le·la maître·sse !",
  "Quelle masterclass ! 🎓",
  "Personne ne peut rivaliser ! 👑",
]

export default function FinalScreen({ players, onRestart }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const phrase = winnerPhrases[Math.floor(Math.random() * winnerPhrases.length)]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-surface-card rounded-3xl p-6 shadow-2xl text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-6xl mb-2"
      >
        🏆
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-3xl font-bold bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent mb-1"
      >
        {winner.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 italic text-sm mb-2"
      >
        {phrase}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="font-display text-2xl font-bold text-secondary mb-6"
      >
        {winner.score} points
      </motion.p>

      <div className="space-y-2 mb-8">
        {sorted.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className={`flex items-center justify-between py-3 px-4 rounded-2xl ${
              i === 0 ? 'bg-secondary/20 border border-secondary/40' : 'bg-surface-light'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <span className="text-white font-semibold">{player.name}</span>
              {player.stealUsed && <span className="text-xs text-accent">🏴‍☠️</span>}
            </div>
            <span className={`font-display font-bold text-lg ${i === 0 ? 'text-secondary' : 'text-white/70'}`}>
              {player.score}
            </span>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 rounded-3xl font-display text-lg font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg tap-scale"
      >
        🔄 Rejouer
      </button>
    </motion.div>
  )
}
