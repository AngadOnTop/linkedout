import { useEffect, useMemo, useState, type PointerEvent } from 'react'
import './App.css'

type Tone = 'Thought leader' | 'Humble brag' | 'Founder mode'

type ApiResponse = {
  post?: string
  model?: string
  error?: string
}

const TONES: Tone[] = ['Thought leader', 'Humble brag', 'Founder mode']

const EXAMPLES = [
  'I pooped',
  'I missed my train',
  'My code finally worked',
  'I made a sandwich',
]

const LOADING_STEPS = [
  'Locating a life-changing insight…',
  'Inflating perceived business impact…',
  'Adding strategic line breaks…',
  'Optimising for unsolicited applause…',
  'Finalising your personal brand…',
]

const DEMO_POST = `I wasn’t planning to share this.

But this morning, I pooped.

What most people would dismiss as a routine biological event became a powerful reminder that progress happens when preparation meets the courage to let go.

Three lessons I’m taking forward:

→ Trust the process, especially when it gets uncomfortable.
→ Create space before asking for more.
→ The best outcomes rarely need a meeting.

Was it glamorous? No. Was it transformative? Absolutely.

What are you ready to let go of today?

#Leadership #GrowthMindset #Execution #Gratitude`

const hashText = (value: string) =>
  [...value].reduce((total, character) => total + character.charCodeAt(0), 0)

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function CopyIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
}

function SparkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.25 4.05A5.5 5.5 0 0 0 16.95 10L21 11.25l-4.05 1.25a5.5 5.5 0 0 0-3.7 3.7L12 20.25l-1.25-4.05a5.5 5.5 0 0 0-3.7-3.7L3 11.25 7.05 10a5.5 5.5 0 0 0 3.7-3.7L12 3Z" /></svg>
}

function WandIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 11-11M13 5l2-2 6 6-2 2M5 3v4M3 5h4M18 16v5M15.5 18.5h5" /></svg>
}

function App() {
  const [input, setInput] = useState('I pooped')
  const [tone, setTone] = useState<Tone>('Thought leader')
  const [translatedTone, setTranslatedTone] = useState<Tone>('Thought leader')
  const [output, setOutput] = useState(DEMO_POST)
  const [model, setModel] = useState('preview')
  const [generation, setGeneration] = useState(0)
  const [loadingStep, setLoadingStep] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isDemo, setIsDemo] = useState(true)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState('')

  const engagement = useMemo(() => (hashText(output) % 800) + 247, [output])
  const outputParagraphs = useMemo(() => output.split(/\n\n+/), [output])

  useEffect(() => {
    if (!isTranslating) return

    const interval = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % LOADING_STEPS.length)
    }, 720)

    return () => window.clearInterval(interval)
  }, [isTranslating])

  const handleTranslate = async () => {
    const thought = input.trim()
    if (!thought || isTranslating) return

    setError('')
    setCopied(false)
    setLoadingStep(0)
    setIsTranslating(true)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought, tone }),
      })
      const responseText = await response.text()
      let payload: ApiResponse

      try {
        payload = responseText ? JSON.parse(responseText) as ApiResponse : {}
      } catch {
        throw new Error('The deployed AI endpoint returned an invalid response. Check the Netlify Function logs.')
      }

      if (!responseText) {
        throw new Error('The deployed AI endpoint returned no data. Check the Netlify Function deployment.')
      }

      if (!response.ok || !payload.post) {
        throw new Error(payload.error || 'The AI returned an empty strategy deck.')
      }

      setOutput(payload.post)
      setModel(payload.model || 'AI')
      setTranslatedTone(tone)
      setIsDemo(false)
      setGeneration((current) => current + 1)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'The AI had an offsite. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Your browser blocked clipboard access. Select the post and copy it manually.')
    }
  }

  const handleSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div className="app-shell">
      <div className="ambient-orb orb-one" aria-hidden="true" />
      <div className="ambient-orb orb-two" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="LinkedOut home">
          <span className="brand-mark">L<span>out</span></span>
          <span>LinkedOut</span>
        </a>
        <div className="nav-right">
          <span className="badge"><span className="status-dot" /> Real AI. Questionable value.</span>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">Open LinkedIn <span>↗</span></a>
        </div>
      </header>

      <main id="top">
        <section className="hero-copy">
          <div className="floating-card float-left" aria-hidden="true">
            <span className="float-icon">↗</span>
            <div><strong>+340%</strong><small>perceived wisdom</small></div>
          </div>
          <div className="floating-card float-right" aria-hidden="true">
            <span className="pulse-avatar">YL</span>
            <div><strong>Thought leader</strong><small>in absolutely everything</small></div>
          </div>
          <div className="eyebrow"><SparkIcon /> SYNERGY AS A SERVICE <span className="eyebrow-live">LIVE</span></div>
          <h1>Say less. <em>Post more.</em></h1>
          <p>Turn painfully normal thoughts into AI-generated corporate theatre.</p>
          <div className="hero-proof"><span className="mini-avatars"><i>CEO</i><i>VP</i><i>YOU</i></span><span>Trusted by people who say “circle back”</span></div>
        </section>

        <section className={`translator ${isTranslating ? 'translating' : ''}`} aria-label="LinkedOut translator" onPointerMove={handleSpotlight}>
          <div className="translator-spotlight" aria-hidden="true" />
          <div className="scan-line" aria-hidden="true" />
          <div className="language-bar">
            <div className="language active"><span className="language-number">01</span> Plain English</div>
            <div className="language-arrow"><ArrowIcon /></div>
            <div className="language linkedin-language">
              <span className="mini-in">in</span> LinkedIn
              <span className={`ai-tag ${isDemo ? 'demo' : ''}`}><i /> {isDemo ? 'DEMO' : 'AI'}</span>
            </div>
          </div>

          <div className="translate-grid">
            <div className="input-panel">
              <div className="panel-label"><span>YOUR UNFILTERED THOUGHT</span><WandIcon /></div>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 280))}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') void handleTranslate()
                }}
                placeholder="Type something embarrassingly honest…"
                aria-label="Plain English input"
              />
              <div className="input-footer">
                <span className={input.length > 250 ? 'near-limit' : ''}>{input.length} / 280</span>
                <span className="shortcut">⌘ Enter</span>
              </div>
            </div>

            <div className="output-panel">
              <div className="post-author">
                <div className="avatar" aria-hidden="true"><span>YL</span><i /></div>
                <div>
                  <strong>You, apparently <span className="verified">✓</span></strong>
                  <span>Visionary Leader · 1st</span>
                  <span>Just now · ◉</span>
                </div>
                <span className="generation-label">{isDemo ? 'Example' : translatedTone}</span>
              </div>

              {isTranslating ? (
                <div className="ai-loading" aria-live="polite">
                  <div className="ai-orb" aria-hidden="true"><span /><span /><i /></div>
                  <strong>{LOADING_STEPS[loadingStep]}</strong>
                  <small>Consulting the corporate consciousness</small>
                  <div className="loading-track"><i /></div>
                  <div className="loading-skeleton"><span /><span /><span /><span /></div>
                </div>
              ) : (
                <div className="output-copy" key={generation} aria-live="polite">
                  {outputParagraphs.map((paragraph, index) => (
                    <p style={{ animationDelay: `${index * 70}ms` }} key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              )}

              {!isTranslating && !isDemo && (
                <div className="success-burst" aria-hidden="true" key={`burst-${generation}`}>
                  {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
                </div>
              )}

              <div className="output-actions">
                <div className="fake-engagement">
                  <span className="reaction-bubbles">💡👏</span>
                  <span>{engagement}</span>
                  <span className="engagement-comments">42 comments</span>
                </div>
                <div className="action-right">
                  <span className="model-label">{isDemo ? 'PREVIEW' : model.replace(/^gpt-/, 'GPT ')}</span>
                  <button type="button" className="copy-button" onClick={handleCopy} disabled={isTranslating}>
                    <CopyIcon /> {copied ? 'Copied!' : 'Copy post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="error-banner" role="alert"><span>!</span><p>{error}</p><button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}

          <div className="control-bar">
            <div className="tone-control">
              <span className="control-label">Corporate persona</span>
              <div className="tone-options" role="group" aria-label="Post tone">
                {TONES.map((item) => (
                  <button type="button" className={tone === item ? 'selected' : ''} onClick={() => setTone(item)} key={item}>
                    {item}{tone === item && <i />}
                  </button>
                ))}
              </div>
            </div>
            <button className="translate-button" type="button" onClick={() => void handleTranslate()} disabled={!input.trim() || isTranslating}>
              <span className="button-shine" />
              <SparkIcon />
              <span>{isTranslating ? 'Building your brand…' : 'Make me insufferable'}</span>
              {!isTranslating && <ArrowIcon />}
            </button>
          </div>
        </section>

        <section className="examples-section">
          <p><span /> LOW ON INSPIRATION? TRY A BREAKTHROUGH <span /></p>
          <div className="examples">
            {EXAMPLES.map((example, index) => (
              <button type="button" onClick={() => { setInput(example); setError('') }} key={example}>
                <i>0{index + 1}</i> “{example}” <span>→</span>
              </button>
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
