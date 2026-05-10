# DEVOPS VALIDATION RULES

An output fails validation if any of the following is true:
- Readiness is claimed without verifiable checks.
- Provider setup omits secrets, DNS, webhook, or failure-mode handling.
- Proposal introduces unnecessary infra for the MVP stage.
- Local-only success is described as production readiness.

## Minimum Acceptance Standard
- Output matches the assignment packet.
- Output matches the requested contract or review format.
- Risks and uncertainty are stated honestly.
- Claims are traceable to truth files, evidence, or verified execution results.

## Preferred Quality
- concise
- grounded
- operator-useful
- easy for PM and QA to compare against the packet
