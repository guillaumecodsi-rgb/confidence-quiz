import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onStart: (names: string[], rounds: number) => void
  hasSavedGame?: boolean
  onResume?: () => void
}

export default function SetupScreen({ onStart, hasSavedGame, onResume }: Props) {
  const [names, setNames] = useState<string[]>(['', ''])
  const [rounds, setRounds] = useState(3)

  function addPlayer() {
    if (names.length < 8) setNames([...names, ''])
  }

  function removePlayer(index: number) {
    if (names.length > 2) {
      setNames(names.filter((_, i) => i !== index))
    }
  }

  function updateName(index: number, value: string) {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  function handleStart() {
    const validNames = names.filter(n => n.trim().length > 0)
    if (validNames.length >= 2) {
      onStart(validNames, rounds)
    }
  }

  const canStart = names.filter(n => n.trim().length > 0).length >= 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-card rounded-3xl p-6 shadow-2xl"
    >
      <h1 className="font-display text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
        🎯 Confidence Quiz
      </h1>
      <p className="text-center text-white/60 mb-6 text-sm">Le quiz où la confiance paie !</p>

      <div className="space-y-3 mb-6">
        <h2 className="font-display text-lg font-semibold text-white/90">Joueurs</h2>
        {names.map((name, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={e => updateName(i, e.target.value)}
              placeholder={`Joueur ${i + 1}`}
              className="flex-1 bg-surface-light rounded-2xl px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-primary transition-all"
              maxLength={15}
            />
            {names.length > 2 && (
              <button
                onClick={() => removePlayer(i)}
                className="w-10 h-10 rounded-full bg-destructive/20 text-destructive flex items-center justify-center tap-scale self-center"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {names.length < 8 && (
          <button
            onClick={addPlayer}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-white/20 text-white/50 hover:border-primary hover:text-primary transition-all tap-scale"
          >
            + Ajouter un joueur
          </button>
        )}
      </div>

      <div className="mb-8">
        <h2 className="font-display text-lg font-semibold text-white/90 mb-3">Nombre de manches</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setRounds(Math.max(1, rounds - 1))}
            className="w-10 h-10 rounded-full bg-surface-light text-white font-bold tap-scale"
          >
            −
          </button>
          <span className="font-display text-3xl font-bold text-secondary w-12 text-center">{rounds}</span>
          <button
            onClick={() => setRounds(Math.min(10, rounds + 1))}
            className="w-10 h-10 rounded-full bg-surface-light text-white font-bold tap-scale"
          >
            +
          </button>
        </div>
      </div>

      {hasSavedGame && onResume && (
        <button
          onClick={onResume}
          className="w-full py-4 rounded-3xl font-display text-lg font-bold bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg tap-scale mb-3"
        >
          ▶️ Reprendre la partie
        </button>
      )}

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="w-full py-4 rounded-3xl font-display text-xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg tap-scale disabled:opacity-40 disabled:pointer-events-none transition-all"
      >
        C'est parti ! 🚀
      </button>
    </motion.div>
  )
}
