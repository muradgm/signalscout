import { useEffect } from 'react';
import type { MouseEvent } from 'react';

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
    title: 'Review the evidence',
    body: 'Read trust, booking, and contact signals, then inspect the audit and draft without losing the source context.',
  },
  {
    step: '03',
    title: 'Approve or skip',
    body: 'Edit, hold, send, or skip with the operator still in control of the final action.',
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

const heroClayChips = [
  {
    label: 'Inspect site',
    title: 'Visible local-service surface',
    position: 'left',
  },
  {
    label: 'Read signals',
    title: 'Trust, booking, and contact',
    position: 'right',
  },
  {
    label: 'Approve send',
    title: 'Operator keeps the final call',
    position: 'bottom',
  },
];

const heroMetrics = [
  {
    label: 'Local fit',
    value: 'Qualified',
  },
  {
    label: 'Trust',
    value: 'Visible',
  },
  {
    label: 'Send control',
    value: 'Operator',
  },
];

const heroProofs = [
  {
    title: 'Lead queue + detail review',
    body: 'Move from the queue into a full lead review without switching tools.',
  },
  {
    title: 'Operator approves every send',
    body: 'The system can draft and send, but the send decision stays human.',
  },
  {
    title: 'Reply visibility already exists',
    body: 'Send and reply activity support the review loop instead of replacing it.',
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
    title: 'Send and reply visibility',
    body: 'Sending and reply tracking exist, but they stay subordinate to the core qualification decision.',
  },
];

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
      artifact.style.setProperty('--artifact-glow-y', '36%');
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
      artifact.style.setProperty('--artifact-rotate-y', `${relativeX * 13}deg`);
      artifact.style.setProperty('--artifact-shift-x', `${relativeX * 18}px`);
      artifact.style.setProperty('--artifact-shift-y', `${relativeY * 18}px`);
      artifact.style.setProperty('--artifact-glow-x', `${50 + relativeX * 18}%`);
      artifact.style.setProperty('--artifact-glow-y', `${36 + relativeY * 18}%`);
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
          <a className="marketing-brand" href="#top">
            <strong className="marketing-brand__wordmark">SignalScout</strong>
            <span className="marketing-brand__descriptor">Lead review workspace</span>
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
            <h1>Qualify local-service leads before you write the first outreach email.</h1>
            <p className="marketing-copy marketing-copy--lead">
              SignalScout reviews the site, surfaces trust, booking, and contact
              signals, builds a grounded audit, and keeps the final send decision with
              the operator.
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

            <div className="marketing-proofgrid" aria-label="Highlights">
              {heroProofs.map((proof) => (
                <article key={proof.title} className="marketing-proofgrid__item">
                  <strong>{proof.title}</strong>
                  <p>{proof.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="marketing-hero__visual" aria-hidden="true">
            <div className="marketing-artifact">
              <div className="marketing-artifact__wash marketing-artifact__wash--blue" />
              <div className="marketing-artifact__wash marketing-artifact__wash--green" />
              <div className="marketing-artifact__light" />

              <div className="marketing-artifact__mobile">
                <div className="marketing-artifact__halo" />
                <div className="marketing-artifact__bead marketing-artifact__bead--one" />
                <div className="marketing-artifact__bead marketing-artifact__bead--two" />
                <div className="marketing-artifact__bead marketing-artifact__bead--three" />

                {heroClayChips.map((chip, index) => (
                  <article
                    key={chip.title}
                    className={`marketing-artifact__chip marketing-artifact__chip--${chip.position}`}
                    data-reveal-item={index + 1}
                  >
                    <small>{chip.label}</small>
                    <strong>{chip.title}</strong>
                  </article>
                ))}

                <div className="marketing-artifact__totem" data-reveal-item="0">
                  <div className="marketing-artifact__totem-head">
                    <span className="marketing-card-label">Selected lead</span>
                    <span className="marketing-surface-chip">Qualified to review</span>
                  </div>

                  <div className="marketing-artifact__totem-body">
                    <div className="marketing-artifact__totem-copy">
                      <small>Lead review</small>
                      <strong>Praxis am Park</strong>
                      <p>
                        Trust is visible, the booking path can be improved, and the
                        contact surface is strong enough to justify a real operator
                        decision.
                      </p>
                    </div>

                    <div className="marketing-artifact__metric-grid">
                      {heroMetrics.map((metric) => (
                        <div key={metric.label} className="marketing-artifact__metric">
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="marketing-artifact__totem-note">
                    <span className="marketing-card-label">Next move</span>
                    <p>
                      Review now: the evidence is strong enough to shape a selective
                      outreach draft without hiding ambiguity.
                    </p>
                  </div>
                </div>

                <div className="marketing-artifact__plinth" data-reveal-item="4">
                  <div className="marketing-artifact__plinth-shadow" />
                  <div className="marketing-artifact__plinth-track">
                    <span>Inspect</span>
                    <span>Qualify</span>
                    <span>Approve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-proof" id="proof" data-reveal>
          <div className="marketing-proof__intro">
            <div className="marketing-section-heading">
              <p className="eyebrow">Concrete proof</p>
              <h2>What the product already does today.</h2>
              <p className="marketing-copy">
                This is not a promise stack. The current product already supports the
                core review loop from website inspection to operator-approved outreach.
              </p>
            </div>

            <aside className="marketing-proof-callout" data-reveal-item="0">
              <span className="marketing-card-label">What it is</span>
              <strong>Qualification layer before outreach</strong>
              <p>
                SignalScout is strongest when a single operator or small team needs to
                decide whether a local-service lead deserves attention at all.
              </p>
            </aside>
          </div>

          <div className="marketing-proof__grid">
            {productProofs.map((proof, index) => (
              <article
                key={proof.title}
                className="marketing-proof-card"
                data-reveal-item={index + 1}
              >
                <span className="marketing-card-label">Live capability</span>
                <strong>{proof.title}</strong>
                <p>{proof.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-system" id="workflow" data-reveal>
          <div className="marketing-section-heading marketing-section-heading--split">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Three steps from site review to an outreach decision.</h2>
            </div>
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
          <div className="marketing-section-heading marketing-section-heading--split">
            <div>
              <p className="eyebrow">Inside the workspace</p>
              <h2>See the whole lead before you touch the draft.</h2>
            </div>
            <p className="marketing-copy">
              The workspace is built to answer four questions fast: Is the lead local?
              Is it credible? Is the booking path clear? Is the contact surface good
              enough to act on?
            </p>
          </div>

          <div className="marketing-product-stage">
            <div className="marketing-product-stage__sidebar" data-reveal-item="0">
              <span className="marketing-card-label">Current review</span>
              <div className="marketing-product-stage__list">
                <article className="marketing-product-stage__item marketing-product-stage__item--active">
                  <strong>Praxis am Park</strong>
                  <p>Strong local fit, clear trust cues, booking step could be sharper.</p>
                </article>
                <article className="marketing-product-stage__item">
                  <strong>Mitte Dental</strong>
                  <p>Commercially interesting, but contact quality needs verification.</p>
                </article>
                <article className="marketing-product-stage__item">
                  <strong>Endo Studio Neustadt</strong>
                  <p>Partial local match; ambiguity stays visible instead of being hidden.</p>
                </article>
              </div>
            </div>

            <div className="marketing-product-stage__body" data-reveal-item="1">
              <div className="marketing-product-stage__bar">
                <span className="marketing-card-label">Lead review workspace</span>
                <span className="marketing-surface-chip marketing-surface-chip--accent">
                  Worth operator review
                </span>
              </div>

              <h3>Praxis am Park</h3>
              <p className="marketing-product-stage__summary">
                The site looks credible enough to consider outreach, but the value is in
                seeing why before the draft becomes a task.
              </p>

              <div className="marketing-product-stage__metrics">
                <div className="marketing-product-stage__metric">
                  <small>Site signals</small>
                  <strong>Local fit, trust, booking, contact</strong>
                  <p>The operator can qualify the lead without switching to other tools.</p>
                </div>
                <div className="marketing-product-stage__metric">
                  <small>Audit</small>
                  <strong>Grounded reasoning, not a vague score</strong>
                  <p>The audit explains the opportunity instead of flattening it into a number.</p>
                </div>
                <div className="marketing-product-stage__metric">
                  <small>Draft</small>
                  <strong>Context attached before send</strong>
                  <p>The outreach draft stays linked to the evidence that justified it.</p>
                </div>
              </div>

              <div className="marketing-product-stage__note">
                <span className="marketing-card-label">Decision note</span>
                <p>
                  This lead deserves review because the site already does enough work to
                  justify a focused outreach angle.
                </p>
              </div>
            </div>

            <div className="marketing-product-stage__aside">
              <div
                className="marketing-product-callout marketing-product-callout--confidence"
                data-reveal-item="2"
              >
                <span className="marketing-card-label">Send control</span>
                <strong>Every send is operator-approved</strong>
                <p>The workflow supports sending, but the last decision is still human.</p>
              </div>

              <div
                className="marketing-product-callout marketing-product-callout--evidence"
                data-reveal-item="3"
              >
                <span className="marketing-card-label">Workflow reality</span>
                <strong>Best for selective outbound</strong>
                <p>Useful when judgment matters more than maximizing sequence volume.</p>
              </div>
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
                  data-reveal-item={index + 2}
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
            <h2>Start with a real lead review, then decide if SignalScout fits your outbound process.</h2>
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
    </div>
  );
}
