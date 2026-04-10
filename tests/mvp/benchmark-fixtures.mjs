export const benchmarkFixtures = [
  {
    id: 'good-local',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['family-led', 'long-standing'],
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
    id: 'realcase-torhaus',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 4,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresSignalLabels: [
        'mentions patient comfort',
        'mentions advanced technology',
      ],
      requiresAuditSummaryPhrases: [
        'multi-specialty practice',
        'direct booking path',
      ],
      requiresAuditEvidencePhrases: [
        'multi-specialty practice',
      ],
      requiresOutreachSubjectPhrases: ['multi-specialty practice'],
      requiresOutreachBodyPhrases: [
        'multi-specialty practice',
        '2 or 3 specific changes',
      ],
      requiresOutreachFitReasonPhrases: ['multi-specialty practice'],
      requiresOutreachAnglePhrases: ['multi-specialty practice'],
      requiresOutreachReasoningPhrases: ['multi-specialty practice'],
      requiresOutreachEvidencePhrases: ['multi-specialty practice'],
    },
    lead: {
      id: 'lead-realcase-torhaus',
      companyName: 'Torhaus – Ihre Zahnärzte',
      website: 'https://www.zahnarzt-torhaus.de/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-24T11:00:00.000Z'),
      updatedAt: new Date('2026-03-24T11:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Torhaus - Ihre Zahnärzte | Berlin Mitte</title>
          <meta name="description" content="Berlin Mitte mit Implantologie, Endodontie, Alignerbehandlung und ästhetischer Zahnmedizin. Termin online buchen." />
        </head>
        <body>
          <h1>Torhaus - Ihre Zahnärzte in Berlin Mitte</h1>
          <p>Implantologie, Endodontie, Alignerbehandlung und ästhetische Zahnmedizin unter einem Dach.</p>
          <p>Unser Team begleitet Familien und Berufstätige mit klaren Kontaktwegen und einer ruhigen Beratung.</p>
          <p>Modern technology, calm support and patient comfort for local visitors.</p>
          <a href="https://www.zahnarzt-torhaus.de/termin">Termin online buchen</a>
          <a href="/appointment">Request appointment</a>
          <a href="mailto:kontakt@zahnarzt-torhaus.de">kontakt@zahnarzt-torhaus.de</a>
          <a href="tel:+493012345678">030 123 45 678</a>
          <address>Torstrasse 100 10119 Berlin Mitte</address>
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
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAuditStrengthPhrases: ['contact', 'local'],
      requiresAuditSummaryPhrases: ['commercially interesting', 'rough around the edges'],
      requiresOutreachBodyPhrases: [
        'credible first impression',
        'work a little harder than they should',
      ],
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
    id: 'multilingual-good-munich',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['bilingual', 'long-standing'],
      requiresSignalLabels: [
        'mentions long tradition',
        'mentions patient comfort',
        'mentions advanced technology',
      ],
      requiresOutreachSubjectPhrases: ['clear booking'],
      requiresOutreachBodyPhrases: [
        'reassurance on the page',
        'The bilingual presentation is a strength',
      ],
      requiresOutreachFitReasonPhrases: ['bilingual presentation'],
      requiresOutreachAnglePhrases: ['bilingual presentation'],
      requiresOutreachReasoningPhrases: [
        'accessible in both German and English',
      ],
      requiresOutreachEvidencePhrases: ['The site uses both German and English'],
      rejectsOutreachBodyPhrases: ['credible first impression'],
    },
    lead: {
      id: 'lead-multilingual-good-munich',
      companyName: 'Dental Atelier Schwabing',
      website: 'https://dental-atelier.example/',
      niche: 'dentist',
      location: 'Munich',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-18T12:00:00.000Z'),
      updatedAt: new Date('2026-03-18T12:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Dental Atelier Schwabing | Zahnarzt MÃ¼nchen</title>
          <meta name="description" content="Seit Ã¼ber 40 Jahren in Munich Schwabing, Germany. Gentle dentistry with modern technology and online booking." />
        </head>
        <body>
          <h1>Zahnarztpraxis in Munich Schwabing</h1>
          <p>Seit uber 40 Jahren begleiten wir Familien in Schwabing.</p>
          <p>Patient comfort, modern technology and a calm atmosphere.</p>
          <p>Serving Munich, Germany with local family care.</p>
          <p>Book online or call our team directly.</p>
          <a href="https://booking.example/schwabing">Termin online buchen</a>
          <a href="mailto:hallo@dental-atelier.example">hallo@dental-atelier.example</a>
          <a href="tel:+49891234567">089 123 45 67</a>
          <address>Leopoldstrasse 42 80802 Munich Schwabing</address>
        </body>
      </html>
    `,
  },
  {
    id: 'english-local-cologne',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditStrengthPhrases: ['contact', 'local'],
      requiresAuditSummaryPhrases: ['English-led'],
      requiresAuditEvidencePhrases: ['English while still naming the local market'],
      requiresOutreachSubjectPhrases: ['clear booking'],
      requiresOutreachBodyPhrases: [
        'English-led presentation is (helpful|a strength)',
        'booking step still needs to feel unmistakable',
      ],
      requiresOutreachFitReasonPhrases: ['English-led presentation'],
      requiresOutreachAnglePhrases: ['English-led presentation'],
      requiresOutreachReasoningPhrases: ['easy to read in English'],
      requiresOutreachEvidencePhrases: ['English-led while still naming the local market'],
    },
    lead: {
      id: 'lead-english-local-cologne',
      companyName: 'Rhein Smile Clinic',
      website: 'https://rhein-smile.example/',
      niche: 'dentist',
      location: 'Cologne',
      country: '',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-18T13:00:00.000Z'),
      updatedAt: new Date('2026-03-18T13:00:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>Rhein Smile Clinic | Cologne Ehrenfeld</title>
          <meta name="description" content="Friendly dental clinic in Cologne Ehrenfeld with online appointment requests." />
        </head>
        <body>
          <h1>Dental care in Cologne Ehrenfeld</h1>
          <p>Our team focuses on patient comfort, modern treatment rooms and a calm patient experience.</p>
          <p>Request your appointment online today.</p>
          <a href="/appointment">Request appointment</a>
          <a href="mailto:hello@rhein-smile.example">hello@rhein-smile.example</a>
          <p>0221 765 43 21</p>
          <address>Venloer Strasse 120 50823 Cologne Ehrenfeld</address>
        </body>
      </html>
    `,
  },
  {
    id: 'specialty-good-implant-berlin',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['implant-focused care', 'implant'],
      requiresAuditEvidencePhrases: ['implant-focused care'],
      requiresSignalLabels: ['mentions advanced technology'],
      requiresOutreachSubjectPhrases: ['implant-focused care'],
      requiresOutreachBodyPhrases: [
        'implant-focused care practice',
        'The bilingual presentation is a strength',
      ],
      requiresOutreachFitReasonPhrases: ['implant-focused care focus'],
      requiresOutreachAnglePhrases: ['implant-focused care'],
      requiresOutreachReasoningPhrases: ['implant-focused care'],
      requiresOutreachEvidencePhrases: ['implant-focused care'],
    },
    lead: {
      id: 'lead-specialty-good-implant-berlin',
      companyName: 'Implant Studio Berlin Mitte',
      website: 'https://implant-studio.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-18T14:00:00.000Z'),
      updatedAt: new Date('2026-03-18T14:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Implant Studio Berlin Mitte</title>
          <meta name="description" content="Implantologie in Berlin Mitte, digital planned and anxiety-friendly." />
        </head>
        <body>
          <h1>Implantologie in Berlin Mitte</h1>
          <p>Digitally planned implant care with modern technology.</p>
          <p>Angstpatienten sind willkommen. Unser Team begleitet Sie ruhig und klar durch jeden Schritt.</p>
          <p>Book your consultation online.</p>
          <a href="/booking">Termin online buchen</a>
          <a href="mailto:hello@implant-studio.example">hello@implant-studio.example</a>
          <a href="tel:+493012345678">030 123 45 678</a>
          <address>Invalidenstrasse 12 10115 Berlin Mitte</address>
        </body>
      </html>
    `,
  },
  {
    id: 'multilingual-specialty-stuttgart',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['bilingual', 'oral-surgery care', 'oral-surgery'],
      requiresAuditEvidencePhrases: ['German and English messaging', 'oral-surgery care'],
      requiresOutreachSubjectPhrases: ['oral-surgery care'],
      requiresOutreachBodyPhrases: [
        'oral-surgery care practice',
        'The bilingual presentation is a strength',
      ],
      requiresOutreachFitReasonPhrases: ['oral-surgery care focus'],
      requiresOutreachBodyPhrasesAny: ['an oral-surgery care practice', 'oral-surgery care practice'],
      requiresOutreachAnglePhrases: ['oral-surgery care'],
      requiresOutreachReasoningPhrases: ['oral-surgery care'],
      requiresOutreachEvidencePhrases: ['German and English', 'oral-surgery care'],
    },
    lead: {
      id: 'lead-multilingual-specialty-stuttgart',
      companyName: 'Oral Surgery Atelier Stuttgart',
      website: 'https://oral-surgery-atelier.example/',
      niche: 'dentist',
      location: 'Stuttgart',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-18T15:00:00.000Z'),
      updatedAt: new Date('2026-03-18T15:00:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>Oral Surgery Atelier Stuttgart</title>
          <meta name="description" content="Oral surgery and wisdom tooth care in Stuttgart West. Calm care, request your consultation online." />
        </head>
        <body>
          <h1>Oralchirurgie in Stuttgart West</h1>
          <p>Wisdom tooth removal, oral surgery and calm patient care.</p>
          <p>Our team combines modern treatment rooms with clear patient guidance.</p>
          <p>Request your consultation online.</p>
          <a href="/request">Request consultation</a>
          <a href="mailto:team@oral-surgery-atelier.example">team@oral-surgery-atelier.example</a>
          <p>0711 234 56 70</p>
          <address>Rotebuhlstrasse 88 70178 Stuttgart West</address>
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
      minAuditStrengths: 2,
      minAuditEvidence: 2,
      requiresAddress: false,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['large, multi-location dental network'],
      rejectsAuditSummaryPhrases: ['family-led', 'long-standing local presence'],
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
      minAuditStrengths: 1,
      minAuditEvidence: 2,
      requiresAddress: false,
      requiresPhone: false,
      requiresEmail: false,
      requiresAuditSummaryPhrases: ['brand-led multi-site practice'],
      requiresAuditEvidencePhrases: ['network-style branding'],
      requiresOutreachFitReasonPhrases: [
        'scaled multi-location network',
        'locally owned practice',
      ],
      requiresOutreachReasoningPhrases: [
        'scale that does not match the current local-practice campaign focus',
      ],
      requiresOutreachEvidencePhrases: [
        'large multi-location provider rather than a single local practice',
      ],
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
    id: 'realcase-ku64',
    expectation: {
      placeholder: false,
      outreachFit: 'uncertain',
      recommendation: 'review',
      trustSignalStrength: 'low',
      confidence: 'medium',
      minAuditStrengths: 2,
      minAuditEvidence: 3,
      requiresEmail: true,
      requiresPhone: true,
      requiresAuditSummaryPhrases: [
        'brand-heavy multi-specialty practice',
        'visible booking path',
      ],
      requiresAuditStrengthPhrases: [
        'multiple specialty cues with a visible booking path',
      ],
      requiresAuditEvidencePhrases: [
        'brand-heavy multi-specialty practice with visible booking access',
        'booking path is already present',
      ],
      requiresOutreachFitReasonPhrases: ['brand-heavy multi-specialty presentation'],
      requiresOutreachSubjectPhrases: ['multi-specialty booking'],
      requiresOutreachBodyPhrases: ['brand-heavy multi-specialty practice', 'worth reviewing'],
      requiresOutreachAnglePhrases: ['multi-specialty practice'],
      requiresOutreachReasoningPhrases: ['brand-heavy multi-specialty presentation'],
      requiresOutreachEvidencePhrases: ['brand-heavy multi-specialty practice', 'direct booking access'],
    },
    lead: {
      id: 'lead-ku64-realcase',
      companyName: 'KU64 Die Zahnspezialisten',
      website: 'https://ku64.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-25T10:00:00.000Z'),
      updatedAt: new Date('2026-03-25T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>KU64 Die Zahnspezialisten | Berlin</title>
          <meta name="description" content="Moderne Zahnmedizin in Berlin mit Implantologie, Endodontie, Kieferorthopädie und Zahnästhetik." />
        </head>
        <body>
          <h1>KU64 Die Zahnspezialisten</h1>
          <p>Berlin Charlottenburg, Berlin Mitte, Berlin Prenzlauer Berg</p>
          <p>Implantologie, Oralchirurgie, Endodontie, Aligner, Kinderzahnmedizin, Zahnästhetik.</p>
          <p>Call us on 030 1234567</p>
          <p>Call us on 030 7654321</p>
          <a href="mailto:info@ku64.example">info@ku64.example</a>
          <a href="https://booking.example">Termin online</a>
        </body>
      </html>
    `,
  },
  {
    id: 'realcase-ku64-friedrichstrasse',
    expectation: {
      placeholder: false,
      outreachFit: 'uncertain',
      recommendation: 'review',
      trustSignalStrength: 'low',
      confidence: 'medium',
      minAuditStrengths: 2,
      minAuditEvidence: 3,
      requiresEmail: true,
      requiresPhone: true,
      requiresAuditSummaryPhrases: [
        'brand-heavy multi-specialty practice',
        'visible booking path',
      ],
      requiresAuditStrengthPhrases: [
        'multiple specialty cues with a visible booking path',
      ],
      requiresAuditEvidencePhrases: [
        'brand-heavy multi-specialty practice with visible booking access',
        'booking path is already present',
      ],
      requiresOutreachFitReasonPhrases: ['brand-heavy multi-specialty presentation'],
      requiresOutreachSubjectPhrases: ['multi-specialty booking'],
      requiresOutreachBodyPhrases: [
        'brand-heavy multi-specialty practice',
        'Friedrichstrasse',
        'worth reviewing',
      ],
      requiresOutreachAnglePhrases: ['multi-specialty practice'],
      requiresOutreachReasoningPhrases: ['brand-heavy multi-specialty presentation'],
      requiresOutreachEvidencePhrases: [
        'brand-heavy multi-specialty practice',
        'direct booking access',
      ],
    },
    lead: {
      id: 'lead-ku64-friedrichstrasse',
      companyName: 'KU64 Die Zahnspezialisten Friedrichstrasse',
      website: 'https://ku64-friedrichstrasse.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-26T10:00:00.000Z'),
      updatedAt: new Date('2026-03-26T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>KU64 Die Zahnspezialisten Friedrichstrasse | Berlin</title>
          <meta name="description" content="Multi-specialty implant-, endodontie- und zahnästhetik-werkstatt in Berlin Friedrichstrasse mit direkter Buchung." />
        </head>
        <body>
          <h1>KU64 Die Zahnspezialisten Friedrichstrasse</h1>
          <p>Implantologie, Oralchirurgie, Endodontie, Kieferorthopädie, Aligner, Zahnästhetik.</p>
          <p>Friedrichstrasse 64 Berlin Mitte</p>
          <p>Call us on 030 1234567</p>
          <p>Call us on 030 7654321</p>
          <a href="mailto:info@ku64.example">info@ku64.example</a>
          <a href="https://booking.example">Termin online</a>
        </body>
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
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAuditStrengthPhrases: ['contact', 'local'],
      requiresAuditSummaryPhrases: [
        'commercially valid',
        'does not line up cleanly with the recorded lead geography',
      ],
      requiresAuditEvidencePhrases: [
        'does not line up cleanly with the recorded lead location',
      ],
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresOutreachFitReasonPhrases: [
        'does not line up cleanly with the recorded lead geography',
      ],
      requiresOutreachSubjectPhrases: ['geographic fit'],
      requiresOutreachBodyPhrases: [
        'geography still needs a human check',
        'review territory',
      ],
      requiresOutreachAnglePhrases: ['qualification gap'],
      requiresOutreachReasoningPhrases: ['geographic match'],
      requiresOutreachEvidencePhrases: ['qualification gap', 'recorded lead location'],
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
    id: 'good-local-stuttgart-vaihingen',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresSignalLabels: [
        'mentions patient comfort',
        'mentions advanced technology',
        'mentions team',
      ],
    },
    lead: {
      id: 'lead-good-local-stuttgart-vaihingen',
      companyName: 'Zahnatelier Vaihingen',
      website: 'https://zahnatelier-vaihingen.example/',
      niche: 'dentist',
      location: 'Stuttgart',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T10:00:00.000Z'),
      updatedAt: new Date('2026-03-23T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Zahnatelier Vaihingen | Stuttgart Vaihingen</title>
          <meta name="description" content="Moderne Zahnmedizin in Stuttgart Vaihingen mit Online-Termin und patientenfreundlicher Betreuung." />
        </head>
        <body>
          <h1>Zahnarztpraxis in Stuttgart Vaihingen</h1>
          <p>Unser erfahrenes Team verbindet moderne Technologie mit ruhiger, patientenfreundlicher Betreuung.</p>
          <p>Jetzt online Termin buchen.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:hallo@zahnatelier-vaihingen.example">hallo@zahnatelier-vaihingen.example</a>
          <a href="tel:+497112223344">0711 222 33 44</a>
          <address>Vaihinger Markt 12 70563 Stuttgart Vaihingen</address>
        </body>
      </html>
    `,
  },
  {
    id: 'alias-local-dusseldorf-underbilk',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: false,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-alias-local-dusseldorf-underbilk',
      companyName: 'Praxis Unterbilk',
      website: 'https://praxis-unterbilk.example/',
      niche: 'dentist',
      location: 'Dusseldorf',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T11:00:00.000Z'),
      updatedAt: new Date('2026-03-23T11:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Praxis Unterbilk | Duesseldorf Unterbilk</title>
          <meta name="description" content="Lokale Zahnarztpraxis in Duesseldorf Unterbilk mit Online-Buchung." />
        </head>
        <body>
          <h1>Zahnarzt in Duesseldorf Unterbilk</h1>
          <p>Freundliches Team, ruhige Atmosphaere und klare Terminbuchung.</p>
          <a href="/booking">Online booking</a>
          <a href="mailto:kontakt@praxis-unterbilk.example">kontakt@praxis-unterbilk.example</a>
          <a href="tel:+492119998877">0211 999 88 77</a>
          <address>Lorettostrasse 15 40219 Duesseldorf Unterbilk</address>
        </body>
      </html>
    `,
  },
  {
    id: 'specialty-local-frankfurt-sachsenhausen',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresSignalLabels: ['mentions advanced technology', 'mentions patient comfort'],
    },
    lead: {
      id: 'lead-specialty-local-frankfurt-sachsenhausen',
      companyName: 'Implant Studio Sachsenhausen',
      website: 'https://implant-studio-sachsenhausen.example/',
      niche: 'dentist',
      location: 'Frankfurt am Main',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T12:00:00.000Z'),
      updatedAt: new Date('2026-03-23T12:00:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>Implant Studio | Frankfurt Sachsenhausen</title>
          <meta name="description" content="Implant-focused dental care in Frankfurt Sachsenhausen, Germany with online appointments." />
        </head>
        <body>
          <h1>Implant dentistry in Frankfurt Sachsenhausen</h1>
          <p>Advanced imaging, calm chairside experience and clear digital treatment planning.</p>
          <p>Book your consultation online.</p>
          <a href="/consultation">Book consultation</a>
          <a href="mailto:team@implant-studio-sachsenhausen.example">team@implant-studio-sachsenhausen.example</a>
          <a href="tel:+496912345678">069 123 45 678</a>
          <address>Brueckenstrasse 28 60594 Frankfurt Sachsenhausen</address>
        </body>
      </html>
    `,
  },
  {
    id: 'multilingual-local-nuremberg-langwasser',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-multilingual-local-nuremberg-langwasser',
      companyName: 'Smile Praxis Langwasser',
      website: 'https://smile-praxis-langwasser.example/',
      niche: 'dentist',
      location: 'Nuremberg',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T13:00:00.000Z'),
      updatedAt: new Date('2026-03-23T13:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Smile Praxis | Nuernberg Langwasser</title>
          <meta name="description" content="Familienfreundliche Zahnmedizin in Nuernberg Langwasser. Online appointment available." />
        </head>
        <body>
          <h1>Zahnarztpraxis in Nuernberg Langwasser</h1>
          <p>Sanfte Behandlung, multilingual support and an approachable local team.</p>
          <p>Jetzt online appointment anfragen.</p>
          <a href="/appointment">Online appointment</a>
          <a href="mailto:info@smile-praxis-langwasser.example">info@smile-praxis-langwasser.example</a>
          <a href="tel:+499118887766">0911 888 77 66</a>
          <address>Glogauer Strasse 8 90473 Nuernberg Langwasser</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-leipzig-plagwitz',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-leipzig-plagwitz',
      companyName: 'Zahnraum Plagwitz',
      website: 'https://zahnraum-plagwitz.example/',
      niche: 'dentist',
      location: 'Leipzig',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T14:00:00.000Z'),
      updatedAt: new Date('2026-03-23T14:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Zahnraum Plagwitz | Leipzig Plagwitz</title>
          <meta name="description" content="Lokale Zahnarztpraxis in Leipzig Plagwitz mit digitaler Terminbuchung." />
        </head>
        <body>
          <h1>Zahnarzt in Leipzig Plagwitz</h1>
          <p>Lokales Team, klare Terminbuchung und patientenfreundliche Kommunikation.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:hallo@zahnraum-plagwitz.example">hallo@zahnraum-plagwitz.example</a>
          <a href="tel:+493412223344">0341 222 33 44</a>
          <address>Zschochersche Strasse 55 04229 Leipzig Plagwitz</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-freiburg-herdern',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-freiburg-herdern',
      companyName: 'Praxis Herdern',
      website: 'https://praxis-herdern.example/',
      niche: 'dentist',
      location: 'Freiburg im Breisgau',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T15:00:00.000Z'),
      updatedAt: new Date('2026-03-23T15:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Praxis Herdern | Freiburg Herdern</title>
          <meta name="description" content="Lokale Zahnarztpraxis in Freiburg Herdern mit Online-Termin." />
        </head>
        <body>
          <h1>Zahnarztpraxis in Freiburg Herdern</h1>
          <p>Unser lokales Team begleitet Familien mit ruhiger, patientenfreundlicher Betreuung.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:kontakt@praxis-herdern.example">kontakt@praxis-herdern.example</a>
          <a href="tel:+497611234567">0761 123 45 67</a>
          <address>Habsburgerstrasse 90 79104 Freiburg Herdern</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-hanover-list',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: false,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-hanover-list',
      companyName: 'List Smile Studio',
      website: 'https://list-smile-studio.example/',
      niche: 'dentist',
      location: 'Hanover',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T16:00:00.000Z'),
      updatedAt: new Date('2026-03-23T16:00:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>List Smile Studio | Hannover List</title>
          <meta name="description" content="Friendly dental care in Hannover List, Germany with online booking." />
        </head>
        <body>
          <h1>Dental care in Hannover List</h1>
          <p>Patient comfort, a calm local team and clear appointment access.</p>
          <a href="/appointment">Book online</a>
          <a href="mailto:hello@list-smile-studio.example">hello@list-smile-studio.example</a>
          <a href="tel:+495112223344">0511 222 33 44</a>
          <address>Lister Meile 40, 30161 Hannover</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-bonn-bad-godesberg',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-bonn-bad-godesberg',
      companyName: 'Rheinblick Dental',
      website: 'https://rheinblick-dental.example/',
      niche: 'dentist',
      location: 'Bonn',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T17:00:00.000Z'),
      updatedAt: new Date('2026-03-23T17:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Rheinblick Dental | Bonn Bad Godesberg</title>
          <meta name="description" content="Lokale Zahnarztpraxis in Bonn Bad Godesberg mit Online-Termin." />
        </head>
        <body>
          <h1>Zahnarzt in Bonn Bad Godesberg</h1>
          <p>Ruhige Behandlung, ein erfahrenes Team und eine klare Terminbuchung.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:kontakt@rheinblick-dental.example">kontakt@rheinblick-dental.example</a>
          <a href="tel:+492282223344">0228 222 33 44</a>
          <address>Koblenzer Strasse 61 53173 Bonn Bad Godesberg</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-muenster-kreuzviertel',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-muenster-kreuzviertel',
      companyName: 'Zahnraum Kreuzviertel',
      website: 'https://zahnraum-kreuzviertel.example/',
      niche: 'dentist',
      location: 'Munster',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T18:00:00.000Z'),
      updatedAt: new Date('2026-03-23T18:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Zahnraum Kreuzviertel | Muenster Kreuzviertel</title>
          <meta name="description" content="Lokale Zahnarztpraxis in Muenster Kreuzviertel mit Online-Termin." />
        </head>
        <body>
          <h1>Zahnarztpraxis in Muenster Kreuzviertel</h1>
          <p>Patientenfreundliche Betreuung, modernes Umfeld und klare Terminwege.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:hallo@zahnraum-kreuzviertel.example">hallo@zahnraum-kreuzviertel.example</a>
          <a href="tel:+492511234567">0251 123 45 67</a>
          <address>Grevener Strasse 52 48149 Muenster Kreuzviertel</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-heidelberg-neuenheim',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-heidelberg-neuenheim',
      companyName: 'Neuenheim Dental',
      website: 'https://neuenheim-dental.example/',
      niche: 'dentist',
      location: 'Heidelberg',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T19:00:00.000Z'),
      updatedAt: new Date('2026-03-23T19:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Neuenheim Dental | Heidelberg-Neuenheim</title>
          <meta name="description" content="Lokale Zahnarztpraxis in Heidelberg-Neuenheim mit Online-Termin." />
        </head>
        <body>
          <h1>Zahnarzt in Heidelberg-Neuenheim</h1>
          <p>Ruhige Betreuung, ein lokales Team und ein klarer Online-Terminweg.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:hello@neuenheim-dental.example">hello@neuenheim-dental.example</a>
          <a href="tel:+496221123456">06221 123456</a>
          <address>Ladenburger Strasse 10 69120 Heidelberg-Neuenheim</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-regensburg-kumpfmuehl',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-regensburg-kumpfmuehl',
      companyName: 'Praxis Kumpfmuehl',
      website: 'https://praxis-kumpfmuehl.example/',
      niche: 'dentist',
      location: 'Regensburg',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T20:00:00.000Z'),
      updatedAt: new Date('2026-03-23T20:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Praxis Kumpfmuehl | Regensburg</title>
          <meta name="description" content="Zahnarztpraxis in Regensburg Kumpfmühl mit Online-Termin." />
        </head>
        <body>
          <h1>Zahnarzt in Regensburg Kumpfmühl</h1>
          <p>Patientenfreundliche Betreuung, klare Terminbuchung und ein eingespieltes lokales Team.</p>
          <a href="/termin">Termin online buchen</a>
          <a href="mailto:kontakt@praxis-kumpfmuehl.example">kontakt@praxis-kumpfmuehl.example</a>
          <a href="tel:+499411234567">0941 123 45 67</a>
          <address>Kumpfmuehler Strasse 20 93051 Regensburg Kumpfmühl</address>
        </body>
      </html>
    `,
  },
  {
    id: 'good-local-kiel-wik',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
    },
    lead: {
      id: 'lead-good-local-kiel-wik',
      companyName: 'Wik Dental',
      website: 'https://wik-dental.example/',
      niche: 'dentist',
      location: 'Kiel',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T21:00:00.000Z'),
      updatedAt: new Date('2026-03-23T21:00:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>Wik Dental | Kiel Wik</title>
          <meta name="description" content="Friendly local dental care in Kiel Wik with online appointments." />
        </head>
        <body>
          <h1>Dental care in Kiel Wik</h1>
          <p>Calm patient care, clear appointment flow and a practical local site.</p>
          <a href="/appointment">Request appointment</a>
          <a href="mailto:team@wik-dental.example">team@wik-dental.example</a>
          <a href="tel:+49431123456">0431 123 456</a>
          <address>Holtenauer Strasse 140 24105 Kiel Wik</address>
        </body>
      </html>
    `,
  },
  {
    id: 'weaker-contact-endodontics-dresden',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'medium',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: false,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['endodontic care', 'more decisive reason to book now'],
      requiresAuditEvidencePhrases: ['endodontic care', 'no phone path stands out'],
      requiresOutreachSubjectPhrases: ['endodontic care'],
      requiresOutreachBodyPhrases: [
        'endodontic care practice',
        'email-only, so the next step should stay very simple',
      ],
      requiresOutreachFitReasonPhrases: ['endodontic care focus', 'Only an email path stands out'],
      requiresOutreachAnglePhrases: ['endodontic care'],
      requiresOutreachReasoningPhrases: ['email-only', 'next step'],
      requiresOutreachEvidencePhrases: ['no phone path stands out', 'An email path stands out'],
    },
    lead: {
      id: 'lead-weaker-contact-endodontics-dresden',
      companyName: 'Endo Studio Neustadt',
      website: 'https://endo-studio-neustadt.example/',
      niche: 'dentist',
      location: 'Dresden',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-23T22:00:00.000Z'),
      updatedAt: new Date('2026-03-23T22:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Endo Studio Neustadt | Dresden Neustadt</title>
          <meta name="description" content="Endodontie in Dresden Neustadt mit ruhiger Behandlung und Anfrageformular." />
        </head>
        <body>
          <h1>Endodontie in Dresden Neustadt</h1>
          <p>Ruhige Wurzelbehandlung, patientenfreundliche Begleitung und ein klares Anfrageformular.</p>
          <a href="/kontakt">Termin anfragen</a>
          <a href="mailto:kontakt@endo-studio-neustadt.example">kontakt@endo-studio-neustadt.example</a>
          <address>Königsbrücker Strasse 14 01099 Dresden Neustadt</address>
        </body>
      </html>
    `,
  },
  {
    id: 'multilingual-aligners-bonn',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: false,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['aligner-focused treatment', 'bilingual'],
      requiresAuditEvidencePhrases: ['German and English messaging'],
      requiresSignalLabels: ['mentions patient comfort'],
      requiresOutreachSubjectPhrases: ['aligner-focused treatment'],
      requiresOutreachBodyPhrases: [
        'aligner-focused treatment practice',
        'The bilingual presentation is a strength',
      ],
      requiresOutreachFitReasonPhrases: ['aligner-focused treatment focus'],
      requiresOutreachAnglePhrases: ['aligner-focused treatment'],
      requiresOutreachReasoningPhrases: ['aligner-focused treatment'],
      requiresOutreachEvidencePhrases: ['German and English'],
    },
    lead: {
      id: 'lead-multilingual-aligners-bonn',
      companyName: 'Clear Smile Godesberg',
      website: 'https://clear-smile-godesberg.example/',
      niche: 'dentist',
      location: 'Bonn',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-23T22:10:00.000Z'),
      updatedAt: new Date('2026-03-23T22:10:00.000Z'),
    },
    html: `
      <html lang="en">
        <head>
          <title>Clear Smile Godesberg | Bonn</title>
          <meta name="description" content="Clear aligner care in Bonn Bad Godesberg. Calm support, online consultation requests." />
        </head>
        <body>
          <h1>Aligner care in Bonn Bad Godesberg</h1>
          <p>Clear aligner planning, sanfte Betreuung and a calm consultation flow.</p>
          <a href="/consultation">Request consultation</a>
          <a href="mailto:hello@clear-smile-godesberg.example">hello@clear-smile-godesberg.example</a>
          <a href="tel:+492282223355">0228 222 33 55</a>
          <address>Am Michaelshof 5 53177 Bonn Bad Godesberg</address>
        </body>
      </html>
    `,
  },
  {
    id: 'weaker-contact-pediatric-hamburg',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'medium',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: false,
      requiresAuditSummaryPhrases: ['family and pediatric care', 'pediatric'],
      requiresAuditEvidencePhrases: ['no email path stands out'],
      requiresOutreachSubjectPhrases: ['family and pediatric care'],
      requiresOutreachBodyPhrases: [
        'family and pediatric care practice',
        'The contact setup is phone-only',
      ],
      requiresOutreachFitReasonPhrases: ['family and pediatric care focus', 'Only a phone path stands out'],
      requiresOutreachAnglePhrases: ['family and pediatric care'],
      requiresOutreachReasoningPhrases: ['phone-only', 'next step'],
      requiresOutreachEvidencePhrases: ['no email path stands out', 'A phone path stands out'],
    },
    lead: {
      id: 'lead-weaker-contact-pediatric-hamburg',
      companyName: 'Kinderzahn Altona',
      website: 'https://kinderzahn-altona.example/',
      niche: 'dentist',
      location: 'Hamburg',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-23T22:20:00.000Z'),
      updatedAt: new Date('2026-03-23T22:20:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Kinderzahn Altona | Hamburg Altona</title>
          <meta name="description" content="Kinderzahnarzt in Hamburg Altona mit Online-Anfrage und kindgerechter Betreuung." />
        </head>
        <body>
          <h1>Kinderzahnarzt in Hamburg Altona</h1>
          <p>Kindgerechte Behandlung, ruhige Kommunikation und eine klare Online-Anfrage.</p>
          <a href="/anfrage">Online-Anfrage</a>
          <p>040 456 78 90</p>
          <address>Ottenser Hauptstrasse 21 22765 Hamburg Altona</address>
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
      minAuditStrengths: 0,
      minAuditEvidence: 1,
      requiresAddress: false,
      requiresPhone: false,
      requiresEmail: false,
      requiresAuditSummaryPhrases: ['placeholder', 'inactive'],
      requiresAuditEvidencePhrases: ['under construction'],
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
  {
    id: 'stored-validation-isarbogen',
    expectation: {
      placeholder: false,
      outreachFit: 'poor',
      recommendation: 'review',
      trustSignalStrength: 'high',
      confidence: 'high',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['brand-led multi-site practice'],
      requiresOutreachSubjectPhrases: ['new-patient booking clearer'],
      requiresOutreachBodyPhrases: [
        'strong first impression',
        'review case instead of an automatic send',
        'more immediate next step for new patients',
      ],
      requiresOutreachFitReasonPhrases: [
        'scaled dental brand and a locally credible clinic',
      ],
      requiresOutreachAnglePhrases: [
        'trust already visible on the site',
        'clearer next step for new patients',
      ],
      requiresOutreachReasoningPhrases: [
        'reviewed trust-to-booking case',
      ],
      requiresOutreachEvidencePhrases: [
        'network-style branding and multiple location references',
        'Contact options and a local address are clearly visible',
      ],
    },
    lead: {
      id: 'lead-stored-validation-isarbogen',
      companyName: 'Isarbogen Zahnzentrum',
      website: 'https://isarbogen-zahnzentrum.example/',
      niche: 'dentist',
      location: 'Munich',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-24T10:00:00.000Z'),
      updatedAt: new Date('2026-03-24T10:00:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Isarbogen Zahnzentrum | Zahnarztpraxis in Muenchen Haidhausen</title>
          <meta name="description" content="Moderne Zahnarztpraxis in Muenchen Haidhausen mit Online-Termin, Implantologie, Kinderzahnheilkunde und klaren Kontaktwegen." />
        </head>
        <body>
          <h1>Isarbogen Zahnzentrum in Muenchen Haidhausen</h1>
          <p>Moderne Zahnmedizin fuer Familien, Berufstaetige und Angstpatienten.</p>
          <p>Patient comfort, modern technology and calm support for families.</p>
          <p>Online-Termin buchen, Implantologie, Kinderzahnheilkunde, Prophylaxe und ruhige Begleitung bei anspruchsvollen Behandlungen.</p>
          <p>Unser Team zeigt echte Behandlungsbereiche, klare Kontaktwege und eine direkte Terminoption fuer neue Patienten.</p>
          <a href="https://isarbogen-zahnzentrum-booking.example/request-appointment">Termin online buchen</a>
          <a href="mailto:hallo@isarbogen.example">hallo@isarbogen.example</a>
          <a href="tel:+498945218800">089 4521 8800</a>
          <address>Einsteinstrasse 12 81675 Muenchen Haidhausen</address>
        </body>
      </html>
    `,
  },
  {
    id: 'stored-validation-decent-quality',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'medium',
      confidence: 'medium',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: false,
      requiresEmail: false,
      requiresAuditSummaryPhrases: ['direct booking path', 'more workmanlike than the strongest leads'],
      requiresAuditEvidencePhrases: ['Direct booking link found'],
      requiresOutreachSubjectPhrases: ['direct booking'],
      requiresOutreachBodyPhrases: [
        'direct way to book',
        'surrounding contact surface still feels thinner',
      ],
      requiresOutreachFitReasonPhrases: ['direct booking path', 'surrounding contact surface still feels thinner'],
      requiresOutreachAnglePhrases: ['direct booking path'],
      requiresOutreachReasoningPhrases: ['direct booking path', 'surrounding contact surface still feels thinner'],
      requiresOutreachEvidencePhrases: ['A direct booking path is already present'],
    },
    lead: {
      id: 'lead-stored-validation-decent-quality',
      companyName: 'Decent Quality Test Lead',
      website: 'https://decent-quality.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-24T10:10:00.000Z'),
      updatedAt: new Date('2026-03-24T10:10:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Decent Quality Test Lead | Berlin</title>
          <meta name="description" content="Praxis in Berlin mit direkter Online-Buchung und ruhiger Behandlung." />
        </head>
        <body>
          <h1>Praxis in Berlin</h1>
          <p>Wohlbefinden und eine direkte Online-Buchung stehen im Mittelpunkt.</p>
          <p>Direkt online Termin anfragen.</p>
          <a href="https://booking.example/berlin/request-appointment">Termin online buchen</a>
          <address>Friedrichstrasse 10 10117 Berlin</address>
        </body>
      </html>
    `,
  },
  {
    id: 'stored-validation-low-quality',
    expectation: {
      placeholder: true,
      outreachFit: 'poor',
      recommendation: 'do_not_send',
      trustSignalStrength: 'low',
      confidence: 'low',
      minAuditStrengths: 0,
      minAuditEvidence: 1,
      requiresAddress: false,
      requiresPhone: false,
      requiresEmail: false,
      requiresAuditSummaryPhrases: ['placeholder', 'inactive'],
      requiresAuditEvidencePhrases: ['under construction'],
    },
    lead: {
      id: 'lead-stored-validation-low-quality',
      companyName: 'Low Quality Test Lead',
      website: 'https://low-quality-test-lead.example/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'legacy_incomplete',
      createdAt: new Date('2026-03-24T10:20:00.000Z'),
      updatedAt: new Date('2026-03-24T10:20:00.000Z'),
    },
    html: `
      <html>
        <head>
          <title>Low Quality Test Lead</title>
        </head>
        <body>
          <p>This site is under construction.</p>
          <p>Website coming soon.</p>
        </body>
      </html>
    `,
  },
  {
    id: 'stored-validation-ladewig',
    expectation: {
      placeholder: false,
      outreachFit: 'good',
      recommendation: 'send',
      trustSignalStrength: 'high',
      confidence: 'medium',
      minAuditStrengths: 3,
      minAuditEvidence: 3,
      requiresAddress: true,
      requiresPhone: true,
      requiresEmail: true,
      requiresAuditSummaryPhrases: ['family-led, long-standing positioning', 'no clear booking path'],
      requiresOutreachSubjectPhrases: ['turning trust into bookings'],
      rejectsOutreachSubjectPhrases: ['making booking easier'],
      requiresOutreachBodyPhrases: ['long-standing local presence', 'family feel'],
      requiresOutreachReasoningPhrases: ['strong trust-building material'],
      requiresOutreachEvidencePhrases: ['family-led, long-standing positioning'],
    },
    lead: {
      id: 'lead-stored-validation-ladewig',
      companyName: 'Zahnärzte Ladewig & Ladewig',
      website: 'https://zahnarzt-ladewig.de/',
      niche: 'dentist',
      location: 'Berlin',
      country: 'Germany',
      source: 'manual',
      status: 'new',
      completeness: 'complete',
      createdAt: new Date('2026-03-24T10:30:00.000Z'),
      updatedAt: new Date('2026-03-24T10:30:00.000Z'),
    },
    html: `
      <html lang="de">
        <head>
          <title>Zahnärzte Ladewig & Ladewig | Berlin Wilmersdorf</title>
          <meta name="description" content="Seit über 40 Jahren in Berlin Wilmersdorf. Familiengeführte Zahnarztpraxis mit ruhiger Behandlung und klaren Kontaktwegen." />
        </head>
        <body>
          <h1>Zahnärzte Ladewig & Ladewig in Berlin Wilmersdorf</h1>
          <p>Seit über 40 Jahren begleiten wir Familien in Berlin Wilmersdorf.</p>
          <p>Als Vater und Sohn führen wir eine der ältesten ansässigen Zahnarztpraxen.</p>
          <p>Wohlbefinden, Kinderecke und schmerzfreie Behandlung.</p>
          <p>Unser erfahrenes Team ist für Sie da.</p>
          <a href="mailto:info@zahnarzt-ladewig.de">info@zahnarzt-ladewig.de</a>
          <a href="tel:+49308541451">030 854 14 51</a>
          <address>Berliner Straße 9 10715 Berlin - Wilmersdorf</address>
        </body>
      </html>
    `,
  },
];
