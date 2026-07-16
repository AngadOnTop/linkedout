import { useMemo, useState } from 'react'
import './App.css'

type Tone = 'Thought leader' | 'Humble brag' | 'Founder mode'

const EXAMPLES = [
  'I pooped',
  'I missed my train',
  'My code finally worked',
  'I made a sandwich',
]

const toneOpeners: Record<Tone, string[]> = {
  'Thought leader': [
    'Today, I learned a powerful lesson about execution.',
    'Some moments change your perspective forever.',
    'We need to talk about what real progress looks like.',
  ],
  'Humble brag': [
    'I wasn’t going to share this, but the lesson felt too important.',
    'Still processing this one. Honestly, I’m humbled.',
    'A personal update I never expected to write:',
  ],
  'Founder mode': [
    'Unpopular opinion: speed is nothing without conviction.',
    'Founders, stop overcomplicating the fundamentals.',
    'This morning, I made an executive decision.',
  ],
}

const hashText = (value: string) =>
  [...value].reduce((total, char) => total + char.charCodeAt(0), 0)

function cleanThought(value: string) {
  const trimmed = value.trim().replace(/[.!?]+$/, '')
  if (!trimmed) return 'I did something ordinary'
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

function translate(value: string, tone: Tone, variant = 0) {
  const thought = cleanThought(value)
  const seed = hashText(thought) + variant
  const opener = toneOpeners[tone][seed % toneOpeners[tone].length]
  const reflections = [
    `What looked like “${thought.toLowerCase()}” was actually a masterclass in listening to the signals, trusting the process, and delivering when it mattered.`,
    `On the surface, ${thought.toLowerCase()}. But beneath that simple moment was something bigger: clarity, ownership, and the courage to follow through.`,
    `${thought}. No applause. No press release. Just a quiet commitment to doing the work that needed to be done.`,
  ]
  const lessons = [
    ['Momentum is built in private.', 'Consistency beats intensity.', 'The best outcomes start with radical ownership.'],
    ['Listen to your gut.', 'Protect your focus.', 'Never confuse ordinary with unimportant.'],
    ['Start before you feel ready.', 'Create space for the hard things.', 'Celebrate the unscalable wins.'],
  ][seed % 3]
  const endings: Record<Tone, string[]> = {
    'Thought leader': [
      'Because leadership isn’t a title. It’s what you do when nobody is updating the KPI dashboard.',
      'The future belongs to people willing to find meaning in the moments everyone else scrolls past.',
    ],
    'Humble brag': [
      'Grateful for the journey. Even more grateful for the person it’s forcing me to become.',
      'I don’t have all the answers. But today, I’m proud to have asked a better question.',
    ],
    'Founder mode': [
      'That’s the whole playbook. Ship, learn, and get back in the arena.',
      'You don’t need another framework. You need bias toward action.',
    ],
  }
  const tags: Record<Tone, string> = {
    'Thought leader': '#Leadership #GrowthMindset #Authenticity',
    'Humble brag': '#Gratitude #PersonalGrowth #Blessed',
    'Founder mode': '#BuildInPublic #FounderLife #Execution',
  }

  return `${opener}\n\n${reflections[seed % reflections.length]}\n\nHere’s what it taught me:\n\n→ ${lessons[0]}\n→ ${lessons[1]}\n→ ${lessons[2]}\n\n${endings[tone][seed % endings[tone].length]}\n\nAgree?\n\n${tags[tone]}`
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function CopyIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
}

function SparkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.25 4.05A5.5 5.5 0 0 0 16.95 10L21 11.25l-4.05 1.25a5.5 5.5 0 0 0-3.7 3.7L12 20.25l-1.25-4.05a5.5 5.5 0 0 0-3.7-3.7L3 11.25 7.05 10a5.5 5.5 0 0 0 3.7-3.7L12 3Z" /></svg>
}

function App() {
  const [input, setInput] = useState('I pooped')
  const [translatedInput, setTranslatedInput] = useState('I pooped')
  const [tone, setTone] = useState<Tone>('Thought leader')
  const [variant, setVariant] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const output = useMemo(() => translate(translatedInput, tone, variant), [translatedInput, tone, variant])

  const handleTranslate = () => {
    if (!input.trim()) return
    setIsTranslating(true)
    window.setTimeout(() => {
      setTranslatedInput(input)
      setVariant((current) => current + 1)
      setIsTranslating(false)
    }, 380)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const chooseExample = (example: string) => {
    setInput(example)
    setTranslatedInput(example)
    setVariant((current) => current + 1)
  }

  return (
    <div className="app-shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="LinkedOut home">
          <span className="brand-mark">L<span>out</span></span>
          <span>LinkedOut</span>
        </a>
        <div className="nav-right">
          <span className="badge"><span className="status-dot" /> Built for thought leaders</span>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">Open LinkedIn <span>↗</span></a>
        </div>
      </header>

      <main id="top">
        <section className="hero-copy">
          <div className="eyebrow"><SparkIcon /> SYNERGY AS A SERVICE</div>
          <h1>Say less. <em>Post more.</em></h1>
          <p>Turn painfully normal thoughts into inspirational corporate theatre.</p>
        </section>

        <section className="translator" aria-label="LinkedOut translator">
          <div className="language-bar">
            <div className="language active">Plain English</div>
            <div className="language-arrow"><ArrowIcon /></div>
            <div className="language linkedin-language">
              <span className="mini-in">in</span> LinkedIn <span className="pro-tag">PRO</span>
            </div>
          </div>

          <div className="translate-grid">
            <div className="input-panel">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 280))}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') handleTranslate()
                }}
                placeholder="Type something embarrassingly honest…"
                aria-label="Plain English input"
              />
              <div className="input-footer">
                <span>{input.length} / 280</span>
                <span className="shortcut">⌘ Enter to translate</span>
              </div>
            </div>

            <div className={`output-panel ${isTranslating ? 'is-loading' : ''}`}>
              <div className="post-author">
                <div className="avatar" aria-hidden="true">YL</div>
                <div>
                  <strong>You, apparently</strong>
                  <span>Visionary Leader · 1st</span>
                  <span>Just now · ◉</span>
                </div>
              </div>
              {isTranslating ? (
                <div className="loading-copy" aria-live="polite">
                  <span /><span /><span /><p>Finding the deeper lesson…</p>
                </div>
              ) : (
                <div className="output-copy" aria-live="polite">{output}</div>
              )}
              <div className="output-actions">
                <div className="fake-engagement">
                  <span className="reaction-bubbles">💡👏</span>
                  <span>{(hashText(output) % 800) + 247}</span>
                  <span className="engagement-comments">42 comments</span>
                </div>
                <button type="button" className="copy-button" onClick={handleCopy}>
                  <CopyIcon /> {copied ? 'Copied!' : 'Copy post'}
                </button>
              </div>
            </div>
          </div>

          <div className="control-bar">
            <div className="tone-control">
              <span className="control-label">Tone</span>
              <div className="tone-options" role="group" aria-label="Post tone">
                {(['Thought leader', 'Humble brag', 'Founder mode'] as Tone[]).map((item) => (
                  <button type="button" className={tone === item ? 'selected' : ''} onClick={() => setTone(item)} key={item}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button className="translate-button" type="button" onClick={handleTranslate} disabled={!input.trim() || isTranslating}>
              <SparkIcon /> {isTranslating ? 'Translating…' : 'Make me insufferable'}
            </button>
          </div>
        </section>

        <section className="examples-section">
          <p>Low on inspiration? Try a breakthrough:</p>
          <div className="examples">
            {EXAMPLES.map((example) => (
              <button type="button" onClick={() => chooseExample(example)} key={example}>“{example}” <span>→</span></button>
            ))}
          </div>
        </section>

        <section className="proof-strip" aria-label="Completely real statistics">
          <div><strong>10×</strong><span>more buzzwords</span></div>
          <div><strong>0</strong><span>actual insights</span></div>
          <div><strong>∞</strong><span>personal brand</span></div>
          <p>* Results emotionally guaranteed. Engagement very much not guaranteed.</p>
        </section>
      </main>

      <footer>
        <span>LinkedOut™</span>
        <p>Made with strategic vulnerability and a bias for action.</p>
        <span>Not affiliated with LinkedIn. Obviously.</span>
      </footer>
    </div>
  )
}

export default App
