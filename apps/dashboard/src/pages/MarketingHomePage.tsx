import { useEffect } from 'react';
import type { MouseEvent } from 'react';

type MarketingHomePageProps = {
  onNavigate: (path: string) => void;
};

const systemMoments = [
  {
    step: '01',
    title: 'Inspect the site',
    body: 'Pull the visible website surface into one place so the review starts from what is actually on the page.',
  },
  {
    step: '02',
    title: 'Read the signals',
    body: 'See local relevance, trust cues, booking strength, and contact quality with the evidence still attached.',
  },
  {
    step: '03',
    title: 'Review the audit',
    body: 'Turn that surface into a grounded audit with strengths, opportunities, and visible reasoning.',
  },
  {
    step: '04',
    title: 'Shape the draft',
    body: 'Generate outreach that stays tied to the site, the visible gaps, and the commercial context.',
  },
  {
    step: '05',
    title: 'Decide the next move',
    body: 'Keep the operator in control of what gets sent, edited, held, or skipped.',
  },
];

const fitNotes = [
  {
    title: 'Founder-led outbound',
    body: 'Review fewer leads, understand the opportunity faster, and send outreach with better grounding.',
  },
  {
    title: 'Solo operator research',
    body: 'Keep website review, audit reasoning, and outreach generation inside one calm decision surface.',
  },
  {
    title: 'Small internal review workflows',
    body: 'Give a compact team a cleaner way to assess local-service business websites before anyone sends.',
  },
];

const credibilityNotes = [
  {
    title: 'Evidence stays visible',
    body: 'Signals, audit framing, and outreach guidance stay tied to what the site actually shows.',
  },
  {
    title: 'Ambiguity stays explicit',
    body: 'Strong cases stay strong, and partial matches stay honest instead of being polished into certainty.',
  },
  {
    title: 'Commercial fit still matters',
    body: 'Local relevance, contact quality, and booking clarity all shape whether a lead deserves attention.',
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
            <span className="marketing-brand__descriptor">Decision workspace</span>
          </a>

          <nav className="marketing-nav__links" aria-label="Marketing">
            <a href="#product">Product</a>
            <a href="#system">System</a>
            <a href="#fit">Fit</a>
            <a className="marketing-nav__cta" href="#cta">
              Request demo
            </a>
          </nav>
        </div>
      </header>

      <main className="marketing-shell" id="top">
        <section className="marketing-hero" id="product" data-reveal>
          <div className="marketing-hero__copy">
            <p className="eyebrow">Evidence-led operator workflow</p>
            <h1>Review the site. Read the signals. Decide what to send.</h1>
            <p className="marketing-copy marketing-copy--lead">
              SignalScout gives a single operator one calm surface for local-service website
              review, grounded audits, and outreach decisions.
            </p>

            <div className="marketing-actions">
              <a className="marketing-button" href="#cta">
                Request demo
              </a>
              <a
                className="marketing-button marketing-button--secondary"
                href="/leads"
                onClick={handleRouteNavigate('/leads')}
              >
                See the workflow
              </a>
            </div>

            <p className="marketing-action-note">
              Built for selective outbound review. No CRM sprawl, no automation theater, just a
              clearer next-step decision.
            </p>

            <div className="marketing-proofline" aria-label="Highlights">
              <span>Visible evidence</span>
              <span>Local fit and confidence</span>
              <span>Operator judgment</span>
            </div>
          </div>

          <div className="marketing-hero__visual" aria-hidden="true">
            <div className="marketing-artifact">
              <div className="marketing-artifact__glow marketing-artifact__glow--blue" />
              <div className="marketing-artifact__glow marketing-artifact__glow--green" />

              <div className="marketing-artifact__top">
                <span className="marketing-card-label">Decision surface</span>
                <span className="marketing-surface-chip">High local fit</span>
              </div>

              <div className="marketing-artifact__focus" data-reveal-item="0">
                <small>Lead review</small>
                <strong>Praxis am Park</strong>
                <p>
                  Trust is visible, the contact path is credible, and the opportunity is to make
                  the next action clearer.
                </p>

                <div className="marketing-artifact__rail">
                  <span>Inspect</span>
                  <span>Signals</span>
                  <span>Audit</span>
                  <span>Draft</span>
                  <span>Decision</span>
                </div>
              </div>

              <div
                className="marketing-artifact__detail marketing-artifact__detail--left"
                data-reveal-item="1"
              >
                <span className="marketing-card-label">Signals</span>
                <strong>Local relevance, trust cues, and contact quality stay visible.</strong>
              </div>

              <div
                className="marketing-artifact__detail marketing-artifact__detail--right"
                data-reveal-item="2"
              >
                <span className="marketing-card-label">Recommendation</span>
                <strong>A grounded draft is worth reviewing, not auto-sending.</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-system" id="system" data-reveal>
          <div className="marketing-section-heading marketing-section-heading--split">
            <div>
              <p className="eyebrow">System reveal</p>
              <h2>Five quiet moves from site review to the next action.</h2>
            </div>
            <p className="marketing-copy">
              The workflow is strongest when the reasoning stays visible from the first website
              snapshot through the final operator decision.
            </p>
          </div>

          <div className="marketing-system-track">
            {systemMoments.map((moment, index) => (
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
              <p className="eyebrow">Product surface</p>
              <h2>One product surface, not a stack of disconnected tools.</h2>
            </div>
            <p className="marketing-copy">
              The queue, the lead review, the audit, and the draft stay close enough to support
              judgment instead of pushing the operator across different systems.
            </p>
          </div>

          <div className="marketing-product-stage">
            <div className="marketing-product-stage__sidebar" data-reveal-item="0">
              <span className="marketing-card-label">Review lane</span>
              <div className="marketing-product-stage__list">
                <article className="marketing-product-stage__item marketing-product-stage__item--active">
                  <strong>Praxis am Park</strong>
                  <p>High trust with a softer booking next step.</p>
                </article>
                <article className="marketing-product-stage__item">
                  <strong>Mitte Dental</strong>
                  <p>Useful lead, but the contact surface still needs closer review.</p>
                </article>
                <article className="marketing-product-stage__item">
                  <strong>Endo Studio Neustadt</strong>
                  <p>Partial local match with explicit ambiguity preserved.</p>
                </article>
              </div>
            </div>

            <div className="marketing-product-stage__body" data-reveal-item="1">
              <div className="marketing-product-stage__bar">
                <span className="marketing-card-label">Lead review</span>
                <span className="marketing-surface-chip marketing-surface-chip--accent">
                  Draft worth reviewing
                </span>
              </div>

              <h3>Praxis am Park</h3>
              <p className="marketing-product-stage__summary">
                The site already signals trust. The opportunity is to make the next action feel
                clearer and more direct.
              </p>

              <div className="marketing-product-stage__metrics">
                <div>
                  <small>Signals</small>
                  <strong>High local relevance</strong>
                </div>
                <div>
                  <small>Audit</small>
                  <strong>Visible strengths, clear next move</strong>
                </div>
                <div>
                  <small>Outreach</small>
                  <strong>Grounded draft with operator control</strong>
                </div>
              </div>

              <div className="marketing-product-stage__note">
                <span className="marketing-card-label">Audit note</span>
                <p>
                  Trust is already present. The recommendation is to turn that confidence into a
                  clearer booking step and a more direct outreach angle.
                </p>
              </div>
            </div>

            <div
              className="marketing-product-callout marketing-product-callout--confidence"
              data-reveal-item="2"
            >
              <span className="marketing-card-label">Confidence</span>
              <strong>High</strong>
              <p>Enough signal is present to support a real operator decision.</p>
            </div>

            <div
              className="marketing-product-callout marketing-product-callout--evidence"
              data-reveal-item="3"
            >
              <span className="marketing-card-label">Evidence</span>
              <strong>Booking path is visible</strong>
              <p>Contact quality and trust cues remain visible inside the same surface.</p>
            </div>
          </div>
        </section>

        <section className="marketing-selective" id="fit" data-reveal>
          <div className="marketing-section-heading">
            <p className="eyebrow">Selective fit</p>
            <h2>Built for people who would rather review fewer leads and make better decisions.</h2>
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
              <p className="marketing-selective__label">Why it holds up</p>
              {credibilityNotes.map((note, index) => (
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
            Strongest today for dental, clinic-style, and other trust-sensitive local-service
            businesses.
          </p>
        </section>

        <section className="marketing-close" id="cta" data-reveal>
          <div className="marketing-close__note">
            <p className="eyebrow">Quiet capability note</p>
            <p className="marketing-copy">
              Sending is supported. Reply visibility exists. Both stay secondary to the core
              review workflow.
            </p>
          </div>

          <div className="marketing-close__cta">
            <h2>See how SignalScout sharpens the next outreach decision.</h2>
            <p className="marketing-copy marketing-copy--lead">
              Get a closer look at the workflow, the evidence framing, and how the product fits a
              focused local-service outbound process.
            </p>
            <div className="marketing-actions">
              <a className="marketing-button" href="#top">
                Request demo
              </a>
              <a
                className="marketing-button marketing-button--secondary"
                href="/leads"
                onClick={handleRouteNavigate('/leads')}
              >
                Open the workspace
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
