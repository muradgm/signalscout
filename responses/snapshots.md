# Snapshots

## Endpoint

```text
POST http://localhost:4000/api/leads/{leadId}/snapshot
```

## Latest response

Lead ID: `69b96554963538de69ca8ee3`

```json
{
  "success": true,
  "data": {
    "id": "69cda1b81c8497dae1f9b5ad",
    "leadId": "69b96554963538de69ca8ee3",
    "url": "https://www.alldent-zahnzentrum-berlin.de/",
    "pageTitle": "Zahnarzt Berlin | AllDent Zahnzentrum Berlin",
    "metaDescription": "Zahnarzt Berlin ➤ Täglich von 7 bis 21 Uhr. Samstags von 8 bis 20 Uhr. 365 Tage Notdienst. ✔Hochmoderne Zahnmedizin ✔Verständlich erklärt ✔Attraktive Preise. AllDent - Ihr Zahnarzt in der Friedrichstraße.",
    "contactInfo": {
      "emails": [],
      "phones": [
        "030 58 76 91 110"
      ],
      "addresses": [
        "Friedrichstraße 94 10117 Berlin"
      ]
    },
    "contactEnrichment": {
      "emails": [],
      "phones": [
        {
          "type": "phone",
          "value": "030 58 76 91 110",
          "sourceKind": "main_page",
          "sourceUrl": "https://www.alldent-zahnzentrum-berlin.de/",
          "confidence": "high"
        }
      ],
      "addresses": [
        {
          "type": "address",
          "value": "Friedrichstraße 94 10117 Berlin",
          "sourceKind": "external_public",
          "sourceUrl": "https://www.doctolib.de/zmvz-zahnmedizinisches-versorgungszentrum/berlin/alldent-zahnzentrum-berlin",
          "confidence": "low"
        }
      ]
    },
    "bookingLinks": [
      "https://www.doctolib.de/zmvz-zahnmedizinisches-versorgungszentrum/berlin/alldent-zahnzentrum-berlin"
    ],
    "trustSignals": [
      "mentions team",
      "mentions reviews",
      "mentions emergency availability",
      "mentions patient volume",
      "mentions advanced technology",
      "mentions anxiety-patient reassurance"
    ],
    "isPlaceholderContent": false,
    "extractedAt": "2026-04-01T22:52:27.640Z"
  }
}
```

## Response log

### 2026-04-02T00:52:27+02:00

Lead ID: `69b96554963538de69ca8ee3`

```json
{
  "success": true,
  "data": {
    "id": "69cda1b81c8497dae1f9b5ad",
    "leadId": "69b96554963538de69ca8ee3",
    "contactInfo": {
      "emails": [],
      "phones": [
        "030 58 76 91 110"
      ],
      "addresses": [
        "Friedrichstraße 94 10117 Berlin"
      ]
    },
    "contactEnrichment": {
      "emails": [],
      "phones": [
        {
          "value": "030 58 76 91 110",
          "sourceKind": "main_page",
          "sourceUrl": "https://www.alldent-zahnzentrum-berlin.de/",
          "confidence": "high"
        }
      ],
      "addresses": [
        {
          "value": "Friedrichstraße 94 10117 Berlin",
          "sourceKind": "external_public",
          "sourceUrl": "https://www.doctolib.de/zmvz-zahnmedizinisches-versorgungszentrum/berlin/alldent-zahnzentrum-berlin",
          "confidence": "low"
        }
      ]
    }
  }
}
```

### 2026-04-02T00:36:18+02:00

Lead ID: `69b96554963538de69ca8ee3`

```json
{
  "success": true,
  "data": {
    "id": "69cd9ded7a5bbd28f5bb8bd8",
    "leadId": "69b96554963538de69ca8ee3",
    "contactInfo": {
      "emails": [],
      "phones": [
        "030 58 76 91 110"
      ],
      "addresses": []
    },
    "contactEnrichment": {
      "emails": [],
      "phones": [
        {
          "value": "030 58 76 91 110",
          "sourceKind": "main_page",
          "sourceUrl": "https://www.alldent-zahnzentrum-berlin.de/",
          "confidence": "high"
        }
      ],
      "addresses": []
    }
  }
}
```

### 2026-04-02T00:30:15+02:00

Lead ID: `69b96554963538de69ca8ee9`

```json
{
  "success": true,
  "data": {
    "id": "69cd9c7946768e3296f84314",
    "leadId": "69b96554963538de69ca8ee9",
    "contactInfo": {
      "emails": [
        "info@zahnarzt-ladewig.de"
      ],
      "phones": [
        "030 854 14 51"
      ],
      "addresses": [
        "Berliner StraÃŸe 9 10715 Berlin - Wilmersdorf"
      ]
    },
    "contactEnrichment": {
      "emails": [
        {
          "value": "info@zahnarzt-ladewig.de",
          "sourceKind": "official_site",
          "sourceUrl": "https://zahnarzt-ladewig.de/impressum.html",
          "confidence": "high"
        }
      ]
    }
  }
}
```
