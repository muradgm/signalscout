import { useEffect, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import heroIllustration from '../assets/signalscout-hero-illustration.svg';

type MarketingHomePageProps = {
  onNavigate: (path: string) => void;
};

type MarketingTheme = 'dark' | 'light';

const marketingThemeStorageKey = 'signalscout-marketing-theme';

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

function HeroImageVisual() {
  return (
    <div className="marketing-artifact marketing-artifact--image">
      <img
        className="marketing-artifact__hero-image"
        src={heroIllustration}
        alt="Structured SignalScout illustration showing a lead review board, attached evidence, and one operator decision."
        decoding="async"
        loading="eager"
      />
    </div>
  );
}

function HeroVisual() {
  return <HeroImageVisual />;
}

type SplitHeadlineProps = {
  as: 'h1' | 'h2';
  lines: string[];
};

function SplitHeadline({ as: Tag, lines }: SplitHeadlineProps) {
  let wordIndex = 0;

  return (
    <Tag className="marketing-split-text">
      {lines.map((line, lineIndex) => {
        const words = line.trim().split(/\s+/);
        const content: ReactNode[] = [];

        words.forEach((word, index) => {
          const style = {
            '--word-index': wordIndex,
          } as CSSProperties;

          content.push(
            <span
              key={`${lineIndex}-${wordIndex}`}
              className="marketing-split-word"
              style={style}
            >
              {word}
            </span>,
          );

          wordIndex += 1;

          if (index < words.length - 1) {
            content.push(' ');
          }
        });

        return (
          <span key={`line-${lineIndex}`} className="marketing-split-line">
            {content}
          </span>
        );
      })}
    </Tag>
  );
}

export function MarketingHomePage({ onNavigate }: MarketingHomePageProps) {
  const [theme, setTheme] = useState<MarketingTheme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const storedTheme = window.localStorage.getItem(marketingThemeStorageKey);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

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
    window.localStorage.setItem(marketingThemeStorageKey, theme);
  }, [theme]);

  const handleRouteNavigate =
    (path: string) =>
    (event: MouseEvent<HTMLAnchorElement>): void => {
      event.preventDefault();
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

  return (
    <div className="marketing-home" data-theme={theme}>
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
            <button
              type="button"
              className="marketing-theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
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
          <div className="marketing-hero__copy" data-reveal-item="0">
            <p className="eyebrow" data-reveal-item="0">Website review and outreach qualification for local-service outbound</p>
            <SplitHeadline
              as="h1"
              lines={[
                'Review local-service',
                'leads before you',
                'commit to outreach.',
              ]}
            />
            <p className="marketing-copy marketing-copy--lead" data-reveal-item="2">
              SignalScout keeps trust, booking, and contact evidence attached to the
              lead, builds a grounded audit, and lets the operator make the final send
              call.
            </p>

            <div className="marketing-actions" data-reveal-item="3">
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

            <p className="marketing-action-note" data-reveal-item="4">
              Best for teams that would rather review 20 qualified opportunities than
              blast 200 weak ones.
            </p>
          </div>

          <div className="marketing-hero__visual" aria-hidden="true" data-reveal-item="1">
            <HeroVisual />
          </div>
        </section>

        <section className="marketing-proof" id="proof" data-reveal>
          <div className="marketing-section-heading marketing-section-heading--centered" data-reveal-item="0">
            <p className="eyebrow">Concrete proof</p>
            <SplitHeadline as="h2" lines={['What the product already does today.']} />
            <p className="marketing-copy marketing-copy--centered" data-reveal-item="1">
              This is not a promise stack. The product already supports the review loop
              from website inspection to operator-approved outreach.
            </p>
          </div>

          <div className="marketing-proof__grid">
            {productProofs.map((proof, index) => (
              <article
                key={proof.title}
                className={`marketing-proof-card${
                  index === 0
                    ? ' marketing-proof-card--spotlight marketing-proof-card--spotlight-violet'
                    : index === 3
                      ? ' marketing-proof-card--spotlight marketing-proof-card--spotlight-coral'
                      : ''
                }`}
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
          <div className="marketing-section-heading" data-reveal-item="0">
            <p className="eyebrow">How it works</p>
            <SplitHeadline
              as="h2"
              lines={[
                'Three steps from site review',
                'to an outreach decision.',
              ]}
            />
            <p className="marketing-copy" data-reveal-item="1">
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
          <div className="marketing-section-heading" data-reveal-item="0">
            <p className="eyebrow">Inside the workspace</p>
            <SplitHeadline
              as="h2"
              lines={[
                'See the whole lead',
                'before you touch the draft.',
              ]}
            />
            <p className="marketing-copy" data-reveal-item="1">
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

            <div className="marketing-product-stage__canvas">
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
          </div>
        </section>

        <section className="marketing-selective" id="fit" data-reveal>
          <div className="marketing-section-heading" data-reveal-item="0">
            <p className="eyebrow">Fit check</p>
            <SplitHeadline
              as="h2"
              lines={[
                'Who it helps,',
                'and who should skip it.',
              ]}
            />
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
          <div className="marketing-close__note" data-reveal-item="0">
            <p className="eyebrow">See the live workflow</p>
            <p className="marketing-copy">
              Open the review workspace first. Book a demo after the product has earned it.
            </p>
          </div>

          <div className="marketing-close__cta" data-reveal-item="1">
            <SplitHeadline
              as="h2"
              lines={[
                'See the live review first.',
                'Book a walkthrough after.',
              ]}
            />
            <p className="marketing-copy marketing-copy--lead" data-reveal-item="2">
              Open the workspace to inspect the live flow. If the review model matches
              your team, request a closer walkthrough.
            </p>
            <div className="marketing-actions" data-reveal-item="3">
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
