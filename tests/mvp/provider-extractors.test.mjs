import assert from 'node:assert/strict';
import test from 'node:test';
import { extractProviderSpecificContactInfo } from '../../packages/scraper/dist/index.js';

test('provider-specific extractor prefers structured jameda contact info', () => {
  const html = `
    <html lang="de">
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Dentist",
            "name": "Praxis Dr. Beispiel",
            "telephone": "+49 30 8541451",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Berliner Straße 9",
              "postalCode": "10715",
              "addressLocality": "Berlin"
            }
          }
        </script>
      </head>
      <body>
        <main>
          <div class="location-card">
            <p>Öffentlicher Zugangsinformationen Gebührenpflichtige Parkplätze</p>
            <p>Berliner Straße 9, 10715 Berlin</p>
          </div>
        </main>
      </body>
    </html>
  `;

  const result = extractProviderSpecificContactInfo(html, 'https://www.jameda.de/praxis-dr-beispiel');

  assert.deepEqual(result.emails, []);
  assert.deepEqual(result.phones, ['030 854 14 51']);
  assert.deepEqual(result.addresses, ['Berliner Straße 9 10715 Berlin']);
});

test('provider-specific extractor prefers structured doctolib contact info over listing noise', () => {
  const html = `
    <html lang="de">
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Dentist",
            "name": "Zahnarztpraxis Mitte",
            "telephone": "+49 30 959999400",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Robert-Koch-Platz 11",
              "postalCode": "10115",
              "addressLocality": "Berlin"
            }
          }
        </script>
      </head>
      <body>
        <main>
          <div data-testid="address-card">
            <p>Robert-Koch-Platz 11, 10115 Berlin</p>
            <p>Mo - Fr von 08:00 Uhr bis 18:00 Uhr</p>
            <p>Bus 120, Tram M8, U6 Naturkundemuseum</p>
          </div>
          <div data-testid="contact-card">
            <p>+49 30 95 99 99 400</p>
            <p>Öffentlicher Zugang</p>
          </div>
        </main>
      </body>
    </html>
  `;

  const result = extractProviderSpecificContactInfo(
    html,
    'https://www.doctolib.de/zahnarzt/berlin/zahnarztpraxis-mitte',
  );

  assert.deepEqual(result.emails, []);
  assert.deepEqual(result.phones, ['030 95 99 99 400']);
  assert.deepEqual(result.addresses, ['Robert-Koch-Platz 11 10115 Berlin']);
});
