# Outreach

## Endpoint

```text
POST http://localhost:4000/api/leads/{leadId}/outreach
```

## Latest response

Lead ID: `69b96554963538de69ca8ee5`

```json
{
  "success": true,
  "data": {
    "id": "69cd96f260ea31d21e9852a0",
    "leadId": "69b96554963538de69ca8ee5",
    "auditId": "69cd96ee60ea31d21e98529b",
    "channel": "email",
    "recommendation": "send",
    "status": "drafted",
    "fitReason": "The lead is strongly aligned with the current local-practice outreach strategy and shows enough real commercial signal to justify a send-ready draft.",
    "bestAngle": "Lead with the gap between strong trust-building and a more decisive booking case.",
    "subject": "Quick thought on booking at Torhaus – Ihre Zahnärzte",
    "body": "Hi,\n\nI took a quick look at Torhaus – Ihre Zahnärzte. The site already builds a lot of trust, especially around the long-standing local presence.\n\nMy main thought is that the step from reassurance to booking still feels a little softer than it should.\n\nSo someone who already feels good about the practice may still not get pushed quite enough to book.\n\nIf useful, I can send over 2 or 3 specific changes I'd test first.\n\nBest,\n[Your Name]",
    "createdAt": "2026-04-01T22:06:42.027Z"
  }
}
```

## Response log

### 2026-04-02T00:06:42+02:00

Lead ID: `69b96554963538de69ca8ee5`

```json
{
  "success": true,
  "data": {
    "id": "69cd96f260ea31d21e9852a0",
    "leadId": "69b96554963538de69ca8ee5",
    "auditId": "69cd96ee60ea31d21e98529b",
    "recommendation": "send",
    "subject": "Quick thought on booking at Torhaus – Ihre Zahnärzte"
  }
}
```

### 2026-04-01T21:28:51+02:00

Lead ID: `69b96554963538de69ca8ee1`

```json
{
  "success": true,
  "data": {
    "id": "69cd8e13ab709479d729e588",
    "leadId": "69b96554963538de69ca8ee1",
    "auditId": "69cd8e0fab709479d729e583",
    "recommendation": "send",
    "subject": "Quick thought on booking at Zahnarzt Michael Prenzlauer Berg"
  }
}
```
