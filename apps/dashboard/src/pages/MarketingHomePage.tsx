import { useEffect } from 'react';
import type { MouseEvent } from 'react';

type MarketingHomePageProps = {
  onNavigate: (path: string) => void;
};

const workflowSteps = [
  {
    title: 'Inspect the site',
    body: 'Pull the visible website surface into one place so review starts from what is actually on the page.',
  },
  {
    title: 'Surface the signals',
    body: 'See local relevance, trust cues, booking strength, and contact quality with evidence attached.',
  },
  {
    title: 'Review the audit',
    body: 'Turn the site into a grounded audit with strengths, opportunities, and the reasoning behind them.',
  },
  {
    title: 'Generate the draft',
    body: 'Create outreach that stays tied to the site, the visible gaps, and the commercial context.',
  },
  {
    title: 'Decide the next move',
    body: 'Keep the operator in control of what gets sent, edited, held, or skipped.',
  },
];

const proofCards = [
  {
    title: 'Evidence-led recommendations',
    body: 'The product points back to visible website signals instead of hiding behind vague AI conclusions.',
    detail: 'Signals, audit framing, and outreach guidance stay tied to what the site actually shows.',
  },
  {
    title: 'Confidence and ambiguity handling',
    body: 'Strong cases stay strong, and ambiguous cases stay explicit instead of being overstated.',
    detail: 'Confidence and evidence are part of the review surface, not an afterthought.',
  },
  {
    title: 'Local relevance and commercial fit',
    body: 'The workflow looks at whether the business is locally relevant and whether the site gives a credible reason to contact them.',
    detail: 'Local signals, contact quality, and booking clarity all shape the recommendation.',
  },
  {
    title: 'Operator review before send',
    body: "SignalScout supports the next action, but it does not replace the operator's judgment.",
    detail: 'Audit, outreach, and send all sit inside one review loop.',
  },
];

const fitCards = [
  {
    title: 'Founder-led outbound',
    body: 'Review leads more selectively, understand the opportunity faster, and send outreach with better grounding.',
  },
  {
    title: 'Solo operator research',
    body: 'Keep website review, audit reasoning, and outreach generation inside one focused decision surface.',
  },
  {
    title: 'Small internal review workflows',
    body: 'Give a compact internal team a cleaner way to inspect local-service websites before deciding what is worth sending.',
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
        <a className="marketing-brand" href="#top">
          <span className="eyebrow">SignalScout</span>
          <strong>Decision Workspace</strong>
        </a>

        <nav className="marketing-nav__links" aria-label="Marketing">
          <a href="#product">Product</a>
          <a href="#workflow">How it works</a>
          <a href="#fit">Fit</a>
          <a className="marketing-nav__cta" href="#cta">
            Request demo
          </a>
        </nav>
      </header>

      <main className="marketing-shell" id="top">
        <section className="marketing-hero" id="product" data-reveal>
          <div className="marketing-hero__copy">
            <p className="eyebrow">Evidence-led lead review</p>
            <h1>Lead review and outreach recommendations for local-service websites.</h1>
            <p className="marketing-copy marketing-copy--lead">
              SignalScout helps a single operator inspect website signals, review a grounded audit,
              generate outreach, and decide what to send next from one clean workspace.
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

            <div className="marketing-proof-row" aria-label="Highlights">
              <span>Evidence-led review</span>
              <span>Local relevance and confidence</span>
              <span>Audit to draft to send</span>
            </div>

            <p className="marketing-note">
              Strongest today for dental, clinic-style, and trust-sensitive local-service reviews.
            </p>
          </div>

          <div className="marketing-hero__visual" aria-hidden="true">
            <div className="marketing-hero-art">
              <div className="marketing-hero-art__glow marketing-hero-art__glow--olive" />
              <div className="marketing-hero-art__glow marketing-hero-art__glow--warm" />
              <div className="marketing-hero-grid">
                <div className="marketing-hero-card marketing-hero-card--main" data-reveal-item="0">
                  <div className="marketing-hero-card__bar">
                    <span className="marketing-pill marketing-pill--accent">High local fit</span>
                    <span className="marketing-pill">Decision in progress</span>
                  </div>
                  <strong>Lead review</strong>
                  <p>
                    Dental clinic site with visible trust, clear contact paths, and a softer
                    booking next step.
                  </p>
                  <div className="marketing-mini-grid">
                    <span>Signals</span>
                    <span>Audit</span>
                    <span>Draft</span>
                    <span>Decision</span>
                  </div>
                </div>

                <div className="marketing-hero-rail">
                  <div className="marketing-hero-card marketing-hero-card--note" data-reveal-item="1">
                    <span className="marketing-card-label">Evidence</span>
                    <strong>Booking path is visible</strong>
                    <p>Trust is strong, but the next action still feels softer than it should.</p>
                  </div>

                  <div className="marketing-hero-card marketing-hero-card--signal" data-reveal-item="2">
                    <span className="marketing-card-label">Confidence</span>
                    <strong>High</strong>
                    <p>Clear local cues with enough signal to support an operator decision.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-workflow" id="workflow" data-reveal>
          <div className="marketing-section-heading">
            <p className="eyebrow">How it works</p>
            <h2>One workflow from website review to outreach decision.</h2>
            <p className="marketing-copy">
              SignalScout keeps the review path simple: inspect the site, surface the signals,
              review the audit, generate a draft, and decide what happens next.
            </p>
          </div>

          <div className="marketing-workflow-rail">
            {workflowSteps.map((step, index) => (
              <article
                key={step.title}
                className="marketing-step-card"
                data-reveal-item={index}
              >
                <span className="marketing-step-card__index">0{index + 1}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-credibility" data-reveal>
          <div className="marketing-section-heading marketing-section-heading--split">
            <div>
              <p className="eyebrow">Why it works</p>
              <h2>Grounded recommendations, not generic automation.</h2>
            </div>
            <p className="marketing-copy">
              SignalScout is built around evidence, confidence, local relevance, and operator
              review so the next action is clearer and more defensible.
            </p>
          </div>

          <div className="marketing-proof-grid">
            {proofCards.map((card) => (
              <article
                key={card.title}
                className="marketing-proof-card"
                data-reveal-item={proofCards.indexOf(card)}
              >
                <span className="marketing-card-label">Proof</span>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
                <small>{card.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-workspace" data-reveal>
          <div className="marketing-section-heading marketing-section-heading--split">
            <div>
              <p className="eyebrow">Workspace</p>
              <h2>One workspace for review, judgment, and action.</h2>
            </div>
            <p className="marketing-copy">
              See the lead, inspect the signal quality, review the audit, and generate a stronger
              draft without bouncing between disconnected tools.
            </p>
          </div>

          <div className="marketing-workspace-frame">
            <div className="marketing-workspace-pane marketing-workspace-pane--queue">
              <div className="marketing-pane-heading">
                <span className="marketing-card-label">Queue</span>
                <span className="marketing-pill marketing-pill--soft">Priority review lane</span>
              </div>
              <div className="marketing-queue-list">
                <article className="marketing-queue-item marketing-queue-item--active">
                  <strong>Praxis am Park</strong>
                  <p>High local fit with visible trust and a softer booking next step.</p>
                </article>
                <article className="marketing-queue-item">
                  <strong>Mitte Dental</strong>
                  <p>Useful lead, but the contact and booking surface still need closer review.</p>
                </article>
                <article className="marketing-queue-item">
                  <strong>Endo Studio Neustadt</strong>
                  <p>Partial local match with explicit ambiguity preserved in the evidence.</p>
                </article>
              </div>
            </div>

            <div className="marketing-workspace-pane marketing-workspace-pane--detail">
              <div className="marketing-pane-heading">
                <span className="marketing-card-label">Lead review</span>
                <span className="marketing-pill marketing-pill--accent">Send-ready</span>
              </div>
              <div className="marketing-detail-grid">
                <div className="marketing-detail-block">
                  <small>Signals</small>
                  <strong>High local relevance</strong>
                  <p>Booking path visible, trust cues strong, contact surface credible.</p>
                </div>
                <div className="marketing-detail-block">
                  <small>Audit</small>
                  <strong>Trust is already present</strong>
                  <p>The opportunity is to turn visible confidence into a clearer booking action.</p>
                </div>
                <div className="marketing-detail-block marketing-detail-block--full">
                  <small>Outreach</small>
                  <strong>Grounded draft, operator still in control</strong>
                  <p>
                    Draft language stays tied to the site and the evidence, with the final send
                    decision still owned by the operator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-fit" id="fit" data-reveal>
          <div className="marketing-section-heading">
            <p className="eyebrow">Best fit</p>
            <h2>Built for focused outbound review, not broad workflow sprawl.</h2>
            <p className="marketing-copy">
              SignalScout is strongest where one operator needs a cleaner way to assess
              local-service business websites and decide how to follow up.
            </p>
          </div>

          <div className="marketing-fit-grid">
            {fitCards.map((card) => (
              <article
                key={card.title}
                className="marketing-fit-card"
                data-reveal-item={fitCards.indexOf(card)}
              >
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </article>
            ))}
          </div>

          <p className="marketing-note marketing-note--centered">
            Strongest today for dental, clinic-style, and other trust-sensitive local-service businesses.
          </p>
        </section>

        <section className="marketing-secondary" data-reveal>
          <div className="marketing-secondary__heading">
            <p className="eyebrow">Secondary capabilities</p>
            <h2>Real execution support, kept in the right place.</h2>
            <p className="marketing-copy">
              SignalScout supports sending and reply visibility, while keeping the core product
              centered on evidence-led review and outreach decisions.
            </p>
          </div>

          <div className="marketing-secondary__grid">
            <article className="marketing-secondary-card" data-reveal-item="0">
              <span className="marketing-card-label">Sending supported</span>
              <strong>Move from review to send in one workflow.</strong>
              <p>Execution is real, but it stays downstream of the review and audit loop.</p>
            </article>
            <article className="marketing-secondary-card" data-reveal-item="1">
              <span className="marketing-card-label">Replies visible</span>
              <strong>Reply visibility exists, without taking over the promise.</strong>
              <p>Replies stay secondary to the main review, judgment, and outreach flow.</p>
            </article>
          </div>
        </section>

        <section className="marketing-cta" id="cta" data-reveal>
          <div className="marketing-cta__inner">
            <p className="eyebrow">See the workflow</p>
            <h2>See how SignalScout sharpens the next outreach decision.</h2>
            <p className="marketing-copy marketing-copy--lead">
              Get a closer look at the workflow, the evidence framing, and how the product fits a
              focused local-service outbound process.
            </p>
            <div className="marketing-actions marketing-actions--centered">
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
