import { useEffect } from 'react';
import type { CSSProperties, MouseEvent } from 'react';

type MarketingHomePageProps = {
  onNavigate: (path: string) => void;
};

const workflowMoments = [
  {
    step: '01',
    title: 'Inspect the site',
    body: 'Pull the visible site into one place and judge whether the business looks local, credible, and commercially relevant.',
  },
  {
    step: '02',
    title: 'Read the evidence',
    body: 'Keep trust, booking, and contact signals attached to the lead instead of flattening them into a vague score.',
  },
  {
    step: '03',
    title: 'Approve or skip',
    body: 'Hold, edit, send, or skip with the operator still making the last decision.',
  },
];

const productProofs = [
  {
    title: 'Review queue',
    body: 'Open a lead, inspect the site, and decide whether it deserves time before the draft becomes work.',
  },
  {
    title: 'Signals stay attached',
    body: 'Local fit, trust cues, booking strength, and contact quality stay tied to visible site evidence.',
  },
  {
    title: 'Audit and draft',
    body: 'The product generates an audit and outreach draft from the same lead context instead of forcing manual copy-paste.',
  },
  {
    title: 'Send visibility',
    body: 'Sending exists, but it stays subordinate to the qualification decision instead of becoming the entire promise.',
  },
];

const workspaceQueue = [
  {
    title: 'Praxis am Park',
    body: 'Strong local fit, clear trust cues, worth review.',
    active: true,
  },
  {
    title: 'Mitte Dental',
    body: 'Commercially interesting, but contact quality needs verification.',
  },
  {
    title: 'Endo Studio Neustadt',
    body: 'Partial local match; ambiguity stays visible instead of being hidden.',
  },
];

const workspaceHighlights = [
  {
    label: 'Signals',
    title: 'Local fit, trust, booking, contact',
    body: 'The operator can qualify the lead without switching to other tools.',
  },
  {
    label: 'Audit',
    title: 'Grounded reasoning, not a vague score',
    body: 'The audit explains the opportunity instead of flattening it into a number.',
  },
  {
    label: 'Send control',
    title: 'Every send is operator-approved',
    body: 'Sending is supported, but the last action is still human.',
  },
];

const fitNotes = [
  {
    title: 'Founder-led outbound',
    body: 'Useful when the founder still reviews leads personally and wants fewer, better outreach decisions.',
  },
  {
    title: 'Solo research operators',
    body: 'Useful when one person needs to qualify local-service businesses quickly before outreach becomes a task.',
  },
  {
    title: 'Small internal teams',
    body: 'Useful when a compact team needs one workspace for qualification before the lead enters a heavier sales process.',
  },
];

const notForNotes = [
  {
    title: 'High-volume sequence teams',
    body: 'If the goal is to blast volume, the review step will feel like drag instead of leverage.',
  },
  {
    title: 'CRM-first orchestration buyers',
    body: 'This is a qualification layer before outreach, not a replacement for your CRM or sequencing stack.',
  },
  {
    title: 'Broad, low-context prospecting',
    body: 'It is strongest where trust, booking clarity, and local relevance actually change the send decision.',
  },
];

const footerLinks = [
  {
    label: 'Workflow',
    href: '#workflow',
  },
  {
    label: 'Proof',
    href: '#proof',
  },
  {
    label: 'Fit',
    href: '#fit',
  },
  {
    label: 'Review',
    href: '/leads',
    route: '/leads',
  },
];

function HeroWaveVisual() {
  return (
    <div className="marketing-artifact">
      <div className="marketing-artifact__aura marketing-artifact__aura--left" />
      <div className="marketing-artifact__aura marketing-artifact__aura--right" />
      <div className="marketing-artifact__mesh" />

      <div className="marketing-artifact__scene">
        <div className="marketing-artifact__site-stack">
          <small>Inspect site</small>
          <div className="marketing-artifact__site-stack-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <article className="marketing-artifact__signal-card">
          <small>Read signals</small>
          <strong>Trust, booking, and contact cues stay attached</strong>
        </article>

        <svg
          className="marketing-artifact__wave"
          viewBox="0 0 720 520"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="signalscoutWaveCore" x1="98" y1="360" x2="644" y2="206" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#C7D7FF" />
              <stop offset="0.52" stopColor="#7398FF" />
              <stop offset="1" stopColor="#E0EBFF" />
            </linearGradient>
            <linearGradient id="signalscoutWaveHalo" x1="88" y1="374" x2="648" y2="198" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.45" stopColor="#BAD0FF" />
              <stop offset="1" stopColor="#F0F5FF" />
            </linearGradient>
            <radialGradient id="signalscoutWaveGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(468 230) rotate(82.3) scale(214 332)">
              <stop stopColor="rgba(255,255,255,0.95)" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          <ellipse cx="372" cy="404" rx="228" ry="42" className="marketing-artifact__wave-floor" />
          <ellipse cx="372" cy="404" rx="172" ry="24" className="marketing-artifact__wave-floor-soft" />

          <path
            d="M104 332C181 276 252 263 320 288C389 314 458 303 524 252C584 206 632 194 668 214"
            className="marketing-artifact__wave-path marketing-artifact__wave-path--back"
          />
          <path
            d="M108 344C188 289 258 275 326 300C395 326 462 315 530 262C590 216 636 203 670 222"
            className="marketing-artifact__wave-path marketing-artifact__wave-path--front"
          />
          <path
            d="M108 344C188 289 258 275 326 300C395 326 462 315 530 262C590 216 636 203 670 222"
            className="marketing-artifact__wave-line"
          />

          <circle cx="214" cy="290" r="14" className="marketing-artifact__wave-node marketing-artifact__wave-node--one" />
          <circle cx="372" cy="309" r="12" className="marketing-artifact__wave-node marketing-artifact__wave-node--two" />
          <circle cx="566" cy="238" r="15" className="marketing-artifact__wave-node marketing-artifact__wave-node--three" />
          <circle cx="650" cy="214" r="24" fill="url(#signalscoutWaveGlow)" opacity="0.74" />
        </svg>

        <div className="marketing-artifact__decision" data-reveal-item="3">
          <div className="marketing-artifact__decision-copy">
            <small>Operator decision</small>
            <strong>Qualified to review</strong>
            <p>Only worth a draft once the site has actually earned attention.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type SplitHeadlineProps = {
  as: 'h1' | 'h2';
  text: string;
};

function SplitHeadline({ as: Tag, text }: SplitHeadlineProps) {
  const words = text.split(' ');

  return (
    <Tag className="marketing-split-text">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="marketing-split-word"
          style={{ '--word-index': index } as CSSProperties}
        >
          {word}
          {index < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </Tag>
  );
}

export function MarketingHomePage({ onNavigate }: MarketingHomePageProps) {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );

    if (sections.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      section.classList.add('motion-ready');

      if (rect.top < window.innerHeight * 0.88) {
        section.classList.add('is-visible');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.18,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const artifact = document.querySelector<HTMLElement>('.marketing-artifact');

    if (!artifact) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resetArtifactMotion = () => {
      artifact.style.setProperty('--artifact-rotate-x', '0deg');
      artifact.style.setProperty('--artifact-rotate-y', '0deg');
      artifact.style.setProperty('--artifact-shift-x', '0px');
      artifact.style.setProperty('--artifact-shift-y', '0px');
      artifact.style.setProperty('--artifact-glow-x', '50%');
      artifact.style.setProperty('--artifact-glow-y', '40%');
    };

    resetArtifactMotion();

    if (reduceMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = artifact.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      artifact.style.setProperty('--artifact-rotate-x', `${relativeY * -10}deg`);
      artifact.style.setProperty('--artifact-rotate-y', `${relativeX * 10}deg`);
      artifact.style.setProperty('--artifact-shift-x', `${relativeX * 14}px`);
      artifact.style.setProperty('--artifact-shift-y', `${relativeY * 14}px`);
      artifact.style.setProperty('--artifact-glow-x', `${50 + relativeX * 18}%`);
      artifact.style.setProperty('--artifact-glow-y', `${40 + relativeY * 16}%`);
    };

    artifact.addEventListener('pointermove', handlePointerMove);
    artifact.addEventListener('pointerleave', resetArtifactMotion);

    return () => {
      artifact.removeEventListener('pointermove', handlePointerMove);
      artifact.removeEventListener('pointerleave', resetArtifactMotion);
    };
  }, []);

  const handleRouteNavigate =
    (path: string) =>
    (event: MouseEvent<HTMLAnchorElement>): void => {
      event.preventDefault();
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

  return (
    <div className="marketing-home">
      <header className="marketing-nav">
        <div className="marketing-nav__inner">
          <a className="marketing-brand" href="#top" aria-label="SignalScout">
            <span className="marketing-brand__lockup">
              <strong className="marketing-brand__wordmark">SignalScout</strong>
            </span>
          </a>

          <nav className="marketing-nav__links" aria-label="Marketing">
            <a href="#workflow">Workflow</a>
            <a href="#proof">Proof</a>
            <a href="#fit">Fit</a>
            <a
              className="marketing-nav__cta"
              href="/leads"
              onClick={handleRouteNavigate('/leads')}
            >
              See lead review
            </a>
          </nav>
        </div>
      </header>

      <main className="marketing-shell" id="top">
        <section className="marketing-hero" id="product" data-reveal>
          <div className="marketing-hero__copy">
            <p className="eyebrow">Website review and outreach qualification for local-service outbound</p>
            <SplitHeadline as="h1" text="Review local-service leads before you commit to outreach." />
            <p className="marketing-copy marketing-copy--lead">
              SignalScout keeps trust, booking, and contact evidence attached to the
              lead, builds a grounded audit, and lets the operator make the final send
              call.
            </p>

            <div className="marketing-actions">
              <a
                className="marketing-button"
                href="/leads"
                onClick={handleRouteNavigate('/leads')}
              >
                See a real lead review
              </a>
              <a className="marketing-button marketing-button--secondary" href="#cta">
                Request demo
              </a>
            </div>

            <p className="marketing-action-note">
              Best for teams that would rather review 20 qualified opportunities than
              blast 200 weak ones.
            </p>
          </div>

          <div className="marketing-hero__visual" aria-hidden="true">
            <HeroWaveVisual />
          </div>
        </section>

        <section className="marketing-proof" id="proof" data-reveal>
          <div className="marketing-section-heading marketing-section-heading--centered">
            <p className="eyebrow">Concrete proof</p>
            <h2>What the product already does today.</h2>
            <p className="marketing-copy marketing-copy--centered">
              This is not a promise stack. The product already supports the review loop
              from website inspection to operator-approved outreach.
            </p>
          </div>

          <div className="marketing-proof__grid">
            {productProofs.map((proof, index) => (
              <article
                key={proof.title}
                className="marketing-proof-card"
                data-reveal-item={index}
              >
                <span className="marketing-card-label">Live capability 0{index + 1}</span>
                <strong>{proof.title}</strong>
                <p>{proof.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-system" id="workflow" data-reveal>
          <div className="marketing-section-heading">
            <p className="eyebrow">How it works</p>
            <h2>Three steps from site review to an outreach decision.</h2>
            <p className="marketing-copy">
              The product is strongest when it answers the questions a skeptical operator
              actually has before the draft becomes another task.
            </p>
          </div>

          <div className="marketing-system-track marketing-system-track--compact">
            {workflowMoments.map((moment, index) => (
              <article
                key={moment.title}
                className="marketing-system-step"
                data-reveal-item={index}
              >
                <span className="marketing-system-step__index">{moment.step}</span>
                <strong>{moment.title}</strong>
                <p>{moment.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-product" data-reveal>
          <div className="marketing-section-heading">
            <p className="eyebrow">Inside the workspace</p>
            <h2>See the whole lead before you touch the draft.</h2>
            <p className="marketing-copy">
              The workspace is built to answer four questions fast: Is the lead local?
              Is it credible? Is the booking path clear? Is the contact surface good
              enough to act on?
            </p>
          </div>

          <div className="marketing-product-stage">
            <div className="marketing-product-stage__queue" data-reveal-item="0">
              {workspaceQueue.map((lead) => (
                <article
                  key={lead.title}
                  className={`marketing-product-stage__queue-item${lead.active ? ' marketing-product-stage__queue-item--active' : ''}`}
                >
                  <strong>{lead.title}</strong>
                  <p>{lead.body}</p>
                </article>
              ))}
            </div>

            <div className="marketing-product-stage__surface" data-reveal-item="1">
              <div className="marketing-product-stage__surface-top">
                <span className="marketing-card-label">Lead review workspace</span>
                <span className="marketing-surface-chip marketing-surface-chip--accent">
                  Worth operator review
                </span>
              </div>

              <div className="marketing-product-stage__surface-main">
                <h3>Praxis am Park</h3>
                <p className="marketing-product-stage__summary">
                  The site looks credible enough to consider outreach, but the value is
                  in seeing why before the draft becomes a task.
                </p>

                <div className="marketing-product-stage__metrics">
                  {workspaceHighlights.map((highlight) => (
                    <div key={highlight.label} className="marketing-product-stage__metric">
                      <small>{highlight.label}</small>
                      <strong>{highlight.title}</strong>
                      <p>{highlight.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="marketing-product-stage__decision-band">
                <span className="marketing-card-label">Decision note</span>
                <p>
                  This lead deserves review because the site already does enough work to
                  justify a focused outreach angle.
                </p>
              </div>
            </div>

            <div className="marketing-product-stage__rail">
              <article className="marketing-product-callout" data-reveal-item="2">
                <span className="marketing-card-label">Current state</span>
                <strong>Qualification layer before outreach</strong>
                <p>
                  The product is strongest when it helps a real operator decide whether a
                  local-service lead deserves attention at all.
                </p>
              </article>
              <article className="marketing-product-callout" data-reveal-item="3">
                <span className="marketing-card-label">Workflow reality</span>
                <strong>Best for selective outbound</strong>
                <p>Useful when judgment matters more than maximizing sequence volume.</p>
              </article>
              <article className="marketing-product-callout" data-reveal-item="4">
                <span className="marketing-card-label">Control</span>
                <strong>Sending stays secondary to review</strong>
                <p>
                  The draft stays attached to the evidence, but the last send decision is
                  still human.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="marketing-selective" id="fit" data-reveal>
          <div className="marketing-section-heading">
            <p className="eyebrow">Fit check</p>
            <h2>Who it helps, and who should skip it.</h2>
          </div>

          <div className="marketing-selective__layout">
            <div className="marketing-selective__column">
              <p className="marketing-selective__label">Best fit</p>
              {fitNotes.map((note, index) => (
                <article
                  key={note.title}
                  className="marketing-selective__item"
                  data-reveal-item={index}
                >
                  <strong>{note.title}</strong>
                  <p>{note.body}</p>
                </article>
              ))}
            </div>

            <div className="marketing-selective__column">
              <p className="marketing-selective__label">Not for</p>
              {notForNotes.map((note, index) => (
                <article
                  key={note.title}
                  className="marketing-selective__item"
                  data-reveal-item={index + 3}
                >
                  <strong>{note.title}</strong>
                  <p>{note.body}</p>
                </article>
              ))}
            </div>
          </div>

          <p className="marketing-note marketing-note--centered">
            Strongest today for dental, clinic-style, and other trust-sensitive
            local-service businesses.
          </p>
        </section>

        <section className="marketing-close" id="cta" data-reveal>
          <div className="marketing-close__note">
            <p className="eyebrow">See the live workflow</p>
            <p className="marketing-copy">
              Open the review workspace first. Book a demo after the product has earned it.
            </p>
          </div>

          <div className="marketing-close__cta">
            <SplitHeadline as="h2" text="Open a real lead review first. Decide on the demo after." />
            <p className="marketing-copy marketing-copy--lead">
              Open the workspace to inspect the live flow. If the review model matches
              your team, request a closer walkthrough.
            </p>
            <div className="marketing-actions">
              <a
                className="marketing-button"
                href="/leads"
                onClick={handleRouteNavigate('/leads')}
              >
                See a real lead review
              </a>
              <a className="marketing-button marketing-button--secondary" href="#top">
                Request demo
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="marketing-footer">
        <div className="marketing-footer__inner">
          <div className="marketing-footer__brand">
            <a className="marketing-brand marketing-brand--footer" href="#top" aria-label="SignalScout">
              <span className="marketing-brand__lockup">
                <strong className="marketing-brand__wordmark">SignalScout</strong>
              </span>
            </a>
            <p className="marketing-copy">
              Decision workspace for local-service outbound. Review the site first, then
              decide whether the lead deserves attention at all.
            </p>
          </div>

          <nav className="marketing-footer__links" aria-label="Footer">
            {footerLinks.map((link) =>
              link.route ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleRouteNavigate(link.route)}
                >
                  {link.label}
                </a>
              ) : (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <p className="marketing-footer__meta">
            Local-service qualification before outbound, with the operator keeping the
            last decision.
          </p>
        </div>
      </footer>
    </div>
  );
}
