// Lets a parent pick which voice reads Spanish and which reads English.
// Voices live on the phone or computer, not in our app, so the list is
// different on every device. We show what is on THIS device and let the
// parent try each one before picking it.

import { useEffect, useState } from 'react'
import { usePlayer } from '../game/PlayerContext'
import { speak, speakEnglish, previewVoice, sfx } from '../audio/sound'
import { listSpanishVoices, listEnglishVoices, spanishVoice, englishVoice, voicesReady } from '../audio/voice'
import Button from './Button'

const ES_PREVIEW = '¡Hola! Me llamo Tico. ¿Cómo estás?'
const EN_PREVIEW = "Hi! I'm Tico. Let's learn Spanish!"

export default function VoicePicker() {
  const { player, setSetting } = usePlayer()
  // Some browsers take a moment to hand over the voice list. We wait for
  // the 'voiceschanged' event and try again when it fires.
  const [ready, setReady] = useState(voicesReady())

  useEffect(() => {
    if (ready || typeof speechSynthesis === 'undefined') return
    const onChanged = () => setReady(voicesReady())
    speechSynthesis.addEventListener('voiceschanged', onChanged)
    return () => speechSynthesis.removeEventListener('voiceschanged', onChanged)
  }, [ready])

  const spanishVoices = listSpanishVoices()
  const englishVoices = listEnglishVoices()

  function pickEs(uri: string) {
    sfx.tap()
    setSetting('voiceEs', uri || null)
    if (uri) previewVoice(uri, ES_PREVIEW)
    else speak(ES_PREVIEW)
  }

  function pickEn(uri: string) {
    sfx.tap()
    setSetting('voiceEn', uri || null)
    if (uri) previewVoice(uri, EN_PREVIEW)
    else speakEnglish(EN_PREVIEW)
  }

  function hearEs() {
    sfx.tap()
    if (player.settings.voiceEs) previewVoice(player.settings.voiceEs, ES_PREVIEW)
    else speak(ES_PREVIEW)
  }

  function hearEn() {
    sfx.tap()
    if (player.settings.voiceEn) previewVoice(player.settings.voiceEn, EN_PREVIEW)
    else speakEnglish(EN_PREVIEW)
  }

  return (
    <section className="bg-white rounded-3xl p-4 shadow-chunky-sm flex flex-col gap-4">
      <div>
        <h2 className="font-display font-bold text-lg text-ink">Voices 🗣️</h2>
        <p className="text-sm text-ink-soft font-bold">Voices come from this phone. Pick the ones you like.</p>
      </div>

      {!ready ? (
        <p className="text-sm text-ink-soft font-bold">Loading voices...</p>
      ) : (
        <>
          <VoiceSection
            label="Spanish voice"
            value={player.settings.voiceEs ?? ''}
            voices={spanishVoices}
            onChange={pickEs}
            onHear={hearEs}
            nowName={spanishVoice()?.name ?? 'none found'}
          />
          {spanishVoices.length === 0 && (
            <p className="text-sm text-coral font-bold">
              No Spanish voice on this phone. On iPhone: Settings &gt; Accessibility &gt; Spoken Content &gt; Voices &gt;
              Spanish. On Android: Settings &gt; System &gt; Languages &gt; Text-to-speech.
            </p>
          )}

          <VoiceSection
            label="English voice"
            value={player.settings.voiceEn ?? ''}
            voices={englishVoices}
            onChange={pickEn}
            onHear={hearEn}
            nowName={englishVoice()?.name ?? 'none found'}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setSetting('raceClock', !player.settings.raceClock)
        }}
        className="w-full flex items-center justify-between bg-cream rounded-2xl p-4 cursor-pointer"
      >
        <span className="font-display font-bold text-ink">Race clock in lessons</span>
        <span
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            player.settings.raceClock ? 'bg-leaf' : 'bg-cream-dark'
          }`}
          aria-hidden="true"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
              player.settings.raceClock ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </span>
      </button>
    </section>
  )
}

function VoiceSection({
  label,
  value,
  voices,
  onChange,
  onHear,
  nowName,
}: {
  label: string
  value: string
  voices: { uri: string; name: string; lang: string }[]
  onChange: (uri: string) => void
  onHear: () => void
  nowName: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-display font-bold text-ink">{label}</h3>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-h-14 font-display rounded-2xl border-2 border-cream-dark bg-white px-3"
        >
          <option value="">Auto (best on this phone)</option>
          {voices.map((v) => (
            <option key={v.uri} value={v.uri}>
              {v.name} · {v.lang}
            </option>
          ))}
        </select>
        <Button color="sky" size="md" silent onClick={onHear} className="whitespace-nowrap">
          Hear it 🔊
        </Button>
      </div>
      <p className="text-xs text-ink-soft font-bold">Now: {nowName}</p>
    </div>
  )
}

/** A one-line tip about getting a nicer voice. Drop this anywhere it fits. */
export function VoiceHint() {
  return <p className="text-xs text-ink-soft font-bold">Tip: on iPhone, download an Enhanced Spanish voice for the nicest sound.</p>
}
