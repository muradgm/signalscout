# Audits

## Endpoint

```text
POST http://localhost:4000/api/leads/{leadId}/audit
```

## Latest response

Lead ID: `69b96554963538de69ca8ee5`

```json
{
  "success": true,
  "data": {
    "id": "69cd96ee60ea31d21e98529b",
    "leadId": "69b96554963538de69ca8ee5",
    "snapshotId": "69cd96e960ea31d21e985295",
    "summary": "Torhaus – Ihre Zahnärzte has a credible local presence with a direct booking path and clear contact options. The strongest commercial opportunity is less about adding trust and more about turning existing credibility into a more decisive conversion experience.",
    "strengths": [
      "Direct booking is already available.",
      "Contact options are clear and easy to find.",
      "The site puts real emphasis on patient comfort and reassurance."
    ],
    "opportunities": [
      "The site builds trust well, but it does not turn that trust into a decisive enough reason to book."
    ],
    "recommendedAngle": "Lead with how existing credibility could be turned into a sharper, more decisive path from reassurance to booking.",
    "confidenceNote": "Confidence is medium: the website content is strong enough for a grounded review, though incomplete lead metadata still limits precision slightly.",
    "createdAt": "2026-04-01T22:06:38.996Z"
  }
}
```

## Response log

### 2026-04-02T00:06:39+02:00

Lead ID: `69b96554963538de69ca8ee5`

```json
{
  "success": true,
  "data": {
    "id": "69cd96ee60ea31d21e98529b",
    "leadId": "69b96554963538de69ca8ee5",
    "snapshotId": "69cd96e960ea31d21e985295",
    "summary": "Torhaus – Ihre Zahnärzte has a credible local presence with a direct booking path and clear contact options. The strongest commercial opportunity is less about adding trust and more about turning existing credibility into a more decisive conversion experience.",
    "confidenceNote": "Confidence is medium: the website content is strong enough for a grounded review, though incomplete lead metadata still limits precision slightly."
  }
}
```

### 2026-04-01T21:28:47+02:00

Lead ID: `69b96554963538de69ca8ee1`

```json
{
  "success": true,
  "data": {
    "id": "69cd8e0fab709479d729e583",
    "leadId": "69b96554963538de69ca8ee1",
    "snapshotId": "69cd7eadb3f67b8e10715260",
    "summary": "Zahnarzt Michael Prenzlauer Berg has a credible local presence with direct booking and strong trust foundations. Its family-led, long-standing positioning is a real asset, but that trust is described more than it is converted into a decisive booking case.",
    "confidenceNote": "Confidence is medium: the website content is strong enough for a grounded review, though incomplete lead metadata still limits precision slightly."
  }
}
```
