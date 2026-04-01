# Signals

## Endpoint

```text
GET http://localhost:4000/api/leads/{leadId}/signals
```

## Latest response

Lead ID: `69b96554963538de69ca8ee5`

```json
{
  "success": true,
  "data": {
    "lead": {
      "id": "69b96554963538de69ca8ee5",
      "companyName": "Torhaus – Ihre Zahnärzte",
      "website": "https://www.zahnarzt-torhaus.de/",
      "niche": "dentist",
      "location": "Berlin",
      "status": "new",
      "completeness": "legacy_incomplete"
    },
    "snapshotId": "69cd96e960ea31d21e985295",
    "signals": {
      "bookingPresence": "direct",
      "contactClarity": "high",
      "trustSignalStrength": "high",
      "businessScale": "single_location",
      "localRelevance": "high_match",
      "outreachFit": "good",
      "fitReason": "The lead appears locally aligned and structurally close to the intended single-practice offer.",
      "confidence": "high",
      "leadCompleteness": "legacy_incomplete",
      "issuesDetected": [],
      "evidence": [
        "direct booking access detected via 2 extracted booking links",
        "booking link extracted: javascript:toggleDrFlexAppointments()",
        "booking link extracted: https://www.zahnarzt-torhaus.de/zahnarzt-berlin/mitte/zahnarzt-termin/",
        "clear contact surface detected with 2 email(s) and 2 phone number(s)",
        "trust indicator detected: mentions team",
        "trust indicator detected: mentions long tradition",
        "trust indicator detected: mentions patient volume",
        "trust indicator detected: mentions patient comfort",
        "no strong multi-location evidence detected",
        "lead location appears in site content: Berlin",
        "lead country is missing",
        "outreach fit reasoning: The lead appears locally aligned and structurally close to the intended single-practice offer.",
        "signal confidence assessed as: high"
      ]
    }
  }
}
```

## Response log

### 2026-04-02T00:06:21+02:00

Lead ID: `69b96554963538de69ca8ee5`

```json
{
  "success": true,
  "data": {
    "lead": {
      "id": "69b96554963538de69ca8ee5",
      "companyName": "Torhaus – Ihre Zahnärzte",
      "website": "https://www.zahnarzt-torhaus.de/",
      "niche": "dentist",
      "location": "Berlin",
      "status": "new",
      "completeness": "legacy_incomplete"
    },
    "snapshotId": "69cd96e960ea31d21e985295",
    "signals": {
      "bookingPresence": "direct",
      "contactClarity": "high",
      "trustSignalStrength": "high",
      "businessScale": "single_location",
      "localRelevance": "high_match",
      "outreachFit": "good",
      "fitReason": "The lead appears locally aligned and structurally close to the intended single-practice offer.",
      "confidence": "high"
    }
  }
}
```

### 2026-04-01T22:34:53+02:00

Lead ID: `69b96554963538de69ca8ee1`

```json
{
  "success": true,
  "data": {
    "lead": {
      "id": "69b96554963538de69ca8ee1",
      "companyName": "Zahnarzt Michael Prenzlauer Berg",
      "website": "https://zahnarztmichael.de/"
    },
    "snapshotId": "69cd7eadb3f67b8e10715260",
    "signals": {
      "bookingPresence": "direct",
      "contactClarity": "high",
      "trustSignalStrength": "high",
      "businessScale": "single_location",
      "localRelevance": "high_match",
      "outreachFit": "good",
      "confidence": "high"
    }
  }
}
```
