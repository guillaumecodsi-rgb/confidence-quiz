import { motion } from 'framer-motion'
import { Player } from '../store/gameStore'

interface Props {
  players: Player[]
  currentRound: number
  totalRounds: number
  onNextRound: () => void
}

export default function ScoreboardScreen({ players, currentRound, totalRounds, onNextRound }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-card rounded-3xl p-6 shadow-2xl"
    >
      <h2 className="font-display text-xl font-bold text-center mb-1 text-white">
        📊 Classement
      </h2>
      <p className="text-center text-white/50 text-sm mb-6">
        Après la manche {currentRound}/{totalRounds}
      </p>

      <div className="space-y-2 mb-6">
        {sorted.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between py-3 px-4 rounded-2xl ${
              i === 0 ? 'bg-secondary/20 border border-secondary/40' : 'bg-surface-light'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <span className="text-white font-semibold">{player.name}</span>
            </div>
            <span className={`font-display font-bold text-lg ${i === 0 ? 'text-secondary' : 'text-white/70'}`}>
              {player.score} pts
            </span>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onNextRound}
        className="w-full py-4 rounded-3xl font-display text-lg font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg tap-scale"
      >
        Manche suivante →
      </button>
    </motion.div>
  )
}
