import { motion } from 'framer-motion'

interface Props {
  correct: boolean
  playerName: string
  points: number
  mockery?: string
  onContinue: () => void
}

const failPhrases = [
  "Aïe... c'est la honte 😬",
  "On va dire que c'est pas ta spécialité...",
  "Même un enfant de 5 ans... non rien 🤫",
  "Le niveau de confiance était un peu ambitieux non ? 😅",
  "C'est pas grave, on apprend de ses erreurs !",
  "Bouuuuh ! 🍅",
  "Tu veux un indice ? Ah non c'est trop tard...",
  "La confiance c'est bien, le savoir c'est mieux 📚",
]

export default function ResultScreen({ correct, playerName, points, mockery, onContinue }: Props) {
  const randomFail = failPhrases[Math.floor(Math.random() * failPhrases.length)]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-surface-card rounded-3xl p-8 shadow-2xl text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        className="text-6xl mb-4"
      >
        {correct ? '🎉' : '💀'}
      </motion.div>

      <h2 className={`font-display text-2xl font-bold mb-2 ${correct ? 'text-success' : 'text-destructive'}`}>
        {correct ? 'Bravo !' : 'Dommage...'}
      </h2>

      <p className="text-white font-semibold text-lg mb-2">
        {playerName}
      </p>

      {correct ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-success-light text-xl font-display font-bold">
            +{points} points ! 🔥
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/60 italic text-sm mb-1">
            {mockery || randomFail}
          </p>
          <p className="text-destructive-light font-semibold">0 point</p>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onContinue}
        className="w-full mt-8 py-4 rounded-3xl font-display text-lg font-bold bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg tap-scale"
      >
        Suivant →
      </motion.button>
    </motion.div>
  )
}
