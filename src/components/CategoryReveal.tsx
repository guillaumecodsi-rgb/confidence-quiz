import { motion } from 'framer-motion'
import { Category, categoryLabels } from '../data/questions'

interface Props {
  category: Category
  roundNumber: number
  onContinue: () => void
}

export default function CategoryReveal({ category, roundNumber, onContinue }: Props) {
  const info = categoryLabels[category]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-surface-card rounded-3xl p-8 shadow-2xl text-center"
    >
      <p className="text-white/50 text-sm mb-2 font-semibold">MANCHE {roundNumber}</p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-7xl mb-4"
      >
        {info.emoji}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-2xl font-bold text-white mb-2"
      >
        {info.label}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/50 mb-8"
      >
        Choisissez votre niveau de confiance !
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onContinue}
        className="w-full py-4 rounded-3xl font-display text-lg font-bold bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg tap-scale"
      >
        Continuer →
      </motion.button>
    </motion.div>
  )
}
