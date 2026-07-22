import { motion } from 'framer-motion'
import { Player } from '../store/gameStore'
import { Category, categoryLabels, getRandomCategories } from '../data/questions'
import { useState } from 'react'

interface Props {
  chooser: Player
  usedThemes: Category[]
  onSelect: (category: Category) => void
}

export default function ThemeSelectionScreen({ chooser, usedThemes, onSelect }: Props) {
  const [choices] = useState<Category[]>(() => getRandomCategories(3, usedThemes))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-card rounded-3xl p-6 shadow-2xl"
    >
      <h2 className="font-display text-xl font-bold text-center mb-2 text-white/90">
        Choix du thème
      </h2>
      <p className="text-center text-secondary font-semibold mb-6">
        🎯 {chooser.name} choisit !
      </p>

      <div className="space-y-3">
        {choices.map((cat, i) => {
          const info = categoryLabels[cat]
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(cat)}
              className="w-full py-4 px-5 rounded-2xl bg-surface-light hover:bg-primary/20 border-2 border-transparent hover:border-primary transition-all tap-scale text-left flex items-center gap-3"
            >
              <span className="text-3xl">{info.emoji}</span>
              <span className="font-display text-lg font-semibold text-white">{info.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
