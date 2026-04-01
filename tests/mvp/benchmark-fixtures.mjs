export const benchmarkFixtures = [
  {
    id: 'good-local',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresSignalLabels: [
        'mentions long tradition',
        'mentions family-led practice',
        'mentions patient comfort',
      ],
    },
    lead: {
      id: 'lead-good-local',
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
    },
    html: `
      <html lang="de">
        <head>
          <title>Zahnarzt Michael Prenzlauer Berg</title>
          <meta name="description" content="Familienzahnarzt für Angstpatienten in Berlin Prenzlauer Berg" />
        </head>
        <body>
          <h1>Ihr Zahnarzt im Prenzlauer Berg</h1>
          <a href="#termin-buchen">Termin online buchen</a>
          <p>Seit über 50 Jahren in Berlin Prenzlauer Berg.</p>
          <p>Als Vater und Sohn führen wir eine der ältesten ansässigen Zahnarztpraxen.</p>
          <p>Wohlbefinden, Kinderecke, Erfrischungsgetränke und schmerzfreie Behandlung.</p>
          <p>Unser erfahrenes Team ist für Sie da.</p>
          <address>Dunckerstrasse 11 10437 Berlin – Prenzlauer Berg</address>
          <a href="mailto:info@zahnarztmichael.de">info@zahnarztmichael.de</a>
          <a href="tel:+49304445656">030 444 56 56</a>
        </body>
      </html>
    `,
  },
  {
    id: 'messy-valid',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'medium',
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      rejectedPhones: ['2015-2020', '171805278-1', '11 10437'],
    },
    lead: {
      id: 'lead-messy-valid',
      companyName: 'Praxis am Park Berlin',
      website: 'https://praxis-am-park.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: '',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-18T10:00:00.000Z'),
      updatedAt: new Date('2026-03-18T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Praxis am Park Berlin</title>
          <meta name="description" content="Zahnarzt Berlin mit Online-Termin und sanfter Behandlung" />
        </head>
        <body>
          <p>Jetzt buchen</p>
          <a href="/termin">Termin vereinbaren</a>
          <p>Unsere Patienten schätzen die schonende Behandlung.</p>
          <p>11 10437</p>
          <p>2015-2020</p>
          <p>171805278-1</p>
          <p>Kontakt: 030 987 65 43</p>
          <a href="mailto:kontakt@praxis-am-park.de?subject=Termin">E-Mail</a>
          <address>Parkallee 8 10115 Berlin</address>
        </body>
      </html>
    `,
  },
  {
    id: 'bad-fit-chain',
    expectation: {
      placeholder: false,
      outreachFit: 'poor',
      recommendation: 'do_not_send',
      trustSignalStrength: 'high',
      confidence: 'medium',
      requiresAddress: false,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-bad-fit-chain',
      companyName: 'Berlin Dental Group',
      website: 'https://berlin-dental-group.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-19T10:00:00.000Z'),
      updatedAt: new Date('2026-03-19T10:00:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>National Dental Group</title>
          <meta name="description" content="More than 40 locations across Germany. Same-day appointment. Advanced technology." />
        </head>
        <body>
          <h1>Over 40 locations nationwide</h1>
          <p>More than 40 locations and over 200 dentists.</p>
          <p>Same-day appointment, emergency care, modern technology.</p>
          <p>Call us on 040 12345678</p>
          <a href="mailto:hello@nationaldental.example">Email</a>
        </body>
      </html>
    `,
  },
  {
    id: 'network-brand',
    expectation: {
      placeholder: false,
      outreachFit: 'poor',
      recommendation: 'do_not_send',
      trustSignalStrength: 'medium',
      confidence: 'medium',
      requiresAddress: false,
      requiresPhone: false,
      requiresEmail: false,
      rejectedTrustSignalLabels: ['mentions family-led practice'],
    },
    lead: {
      id: 'lead-network-brand',
      companyName: 'AllDent Zahnzentrum Berlin',
      website: 'https://www.alldent-zahnzentrum-berlin.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: '',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-22T10:00:00.000Z'),
      updatedAt: new Date('2026-03-22T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Zahnarzt Berlin | AllDent Zahnzentrum Berlin</title>
          <meta name="description" content="365 Tage Notdienst. Hochmoderne Zahnmedizin. AllDent in der Friedrichstraße." />
        </head>
        <body>
          <p>Berlin Friedrichstraße 94</p>
          <p>München Ost, Augsburg, Nürnberg, Stuttgart, Mannheim, Karlsruhe, Hamburg, Frankfurt, Wiesbaden, Mainz, Bremen, Essen, Bochum, Köln, Dresden, Leipzig</p>
          <p>AllDent verfügt über ein umfangreiches Praxisnetz in ganz Deutschland.</p>
          <p>Zahnzentrum Berlin. Standortleitung. Geschäftsleitung. Medical Board.</p>
          <p>Termine buchen. Notdienst 365 Tage. Angstpatienten willkommen.</p>
          <a href="https://www.doctolib.de/zmvz-zahnmedizinisches-versorgungszentrum/berlin/alldent-zahnzentrum-berlin">Termin buchen</a>
        </body>
      </html>
    `,
  },
  {
    id: 'uncertain-review',
    expectation: {
      placeholder: false,
      outreachFit: 'uncertain',
      recommendation: 'review',
      trustSignalStrength: 'medium',
      confidence: 'medium',
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-uncertain-review',
      companyName: 'Praxis Mitte Dental',
      website: 'https://praxis-mitte.example/',
      niche: 'dentist',
      location: 'Hamburg',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-20T10:00:00.000Z'),
      updatedAt: new Date('2026-03-20T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Praxis Mitte Dental Germany</title>
          <meta name="description" content="Online-Termin für Patienten in Berlin Mitte, Germany" />
        </head>
        <body>
          <h1>Praxis in Berlin Mitte</h1>
          <a href="/book">Online booking</a>
          <p>Unser Team ist für Sie da.</p>
          <p>Patient comfort matters to us.</p>
          <a href="mailto:team@praxis-mitte.example">team@praxis-mitte.example</a>
          <p>030 33334444</p>
          <address>Friedrichstrasse 20 10117 Berlin Mitte</address>
        </body>
      </html>
    `,
  },
  {
    id: 'placeholder',
    expectation: {
      placeholder: true,
      outreachFit: 'poor',
      recommendation: 'do_not_send',
      trustSignalStrength: 'low',
      confidence: 'low',
      requiresAddress: false,
      requiresPhone: false,
      requiresEmail: false,
    },
    lead: {
      id: 'lead-placeholder',
      companyName: 'Future Dental Studio',
      website: 'https://future-dental.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: '',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-21T10:00:00.000Z'),
      updatedAt: new Date('2026-03-21T10:00:00.000Z'),
    },
    html: `
      <html>
        <head>
          <title>Website coming soon</title>
        </head>
        <body>
          <p>This site is under construction.</p>
          <p>Website coming soon.</p>
        </body>
      </html>
    `,
  },
];
