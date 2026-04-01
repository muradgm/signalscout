export const leadFixture = {
  id: 'lead-berlin-1',
  companyName: 'Zahnarzt Michael Prenzlauer Berg',
  website: 'https://zahnarztmichael.de/',
  niche: 'dentist',
  location: 'Berlin',
  country: '',
  source: 'manual',
  status: 'new',
  completeness: 'legacy_incomplete',
  createdAt: new Date('2026-03-17T14:29:40.255Z'),
  updatedAt: new Date('2026-03-25T12:59:31.899Z'),
};

export const htmlFixture = `
<!doctype html>
<html lang="de">
  <head>
    <title>Zahnarztpraxis Michael | Ihr Zahnarzt im Prenzlauer Berg in Berlin</title>
    <meta
      name="description"
      content="Marco Michael & Dr. Peter Michael (angestellt) – Familienzahnarzt für Angstpatienten"
    />
  </head>
  <body>
    <main>
      <h1>Ihr Zahnarzt im Prenzlauer Berg</h1>
      <p>Termin online buchen</p>
      <a href="#termin-buchen">Jetzt buchen</a>
      <p>Oder rufen Sie an: 030 444 56 56</p>
      <p>Ihr Zahnarzt im Prenzlauer Berg – seit über 50 Jahren</p>
      <p>Als Vater und Sohn führen wir eine der ältesten ansässigen Zahnarztpraxen im Prenzlauer Berg in Berlin.</p>
      <p>Unser Standort hat Tradition im Prenzlauer Berg.</p>
      <p>Viele Patienten kommen generationsübergreifend in unsere Zahnarztpraxis.</p>
      <p>Neuester Stand der Technik, Korallenriffaquarium im Wartezimmer, Erfrischungsgetränke und Kinderecke.</p>
      <p>Am Allerwichtigsten ist für uns das Wohlbefinden unserer Patienten.</p>
      <p>Wir nehmen Ängste unserer Patienten ernst und legen größten Wert auf eine schonende und schmerzfreie Behandlung.</p>
      <p>Unser erfahrenes Team ist für Sie da.</p>
      <address>Zahnarzt Michael Dunckerstrasse 11 10437 Berlin – Prenzlauer Berg</address>
      <a href="mailto:info@zahnarztmichael.de?subject=Termin">E-Mail</a>
      <a href="tel:+49304445656">Telefon</a>
    </main>
  </body>
</html>
`;

export const buildSnapshotFixture = async () => {
  const { buildLeadSnapshot } = await import('../../packages/scraper/dist/index.js');

  const extracted = buildLeadSnapshot(htmlFixture, leadFixture.website);

  return {
    id: 'snapshot-berlin-1',
    leadId: leadFixture.id,
    ...extracted,
  };
};
