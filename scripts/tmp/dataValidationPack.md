# DATA-P0-001 Real-Case Validation Pack

Generated from existing stored Mongo data only on 2026-04-03.

## Slice coverage

- Multilingual + niche + uncertain-review: `Isarbogen Zahnzentrum`
- Thinner-but-valid: `Decent Quality Test Lead`
- Weak-contact / low-content boundary: `Low Quality Test Lead`
- Strong local baseline contrast: `Zahnärzte Ladewig & Ladewig`

## Cases

| Lead ID | Company | Location | Contact surface summary | Why this case belongs | Snapshot / audit / outreach refs |
| --- | --- | --- | --- | --- | --- |
| `69cf8e09d2c9269b66d22ca9` | Isarbogen Zahnzentrum | Munich | 1 email, 1 phone, 1 address, 1 booking link, 4 trust signals | Mixed EN/DE site, implant-focused niche, and reviewed as a border case with `edited` outreach and `do_not_send` recommendation | Snapshot `69cf8e09d2c9269b66d22cb7`; Audit `69cf8e09d2c9269b66d22cb9`; Outreach `69cf8e09d2c9269b66d22cbf` |
| `69b7e8031277674f1d38814b` | Decent Quality Test Lead | Berlin | No lead-level email/phone; snapshot shows direct booking path, strong URL-derived contact noise, and 1 trust signal | Thin but still valid local case with medium-confidence audit, direct booking, and accepted outreach review | Snapshot `69cee316b934720d4f2f8ce0`; Audit `69cee325b934720d4f2f8ce6`; Outreach `69cf21d9d0f1a46faeef2d3e` |
| `69b802744b981ba617be7c71` | Low Quality Test Lead | Berlin | No email, no phone, no snapshot, no booking, no usable structured content | Weak-contact / low-content boundary case; useful for checking skip behavior and avoiding false confidence on sparse records | Audit `69b856ce65b84a7e0f6bee91` (skip); also `69b856bf65b84a7e0f6bee8b`, `69b81f200d877d7fe865376c`; no outreach found |
| `69b96554963538de69ca8ee9` | Zahnärzte Ladewig & Ladewig | Berlin | 1 email, 2 phones across snapshots, 1 address, no booking link, 4 trust signals | Strong local baseline contrast case with complete contact surface and send-ready review history | Snapshot `69cd9c7946768e3296f84314` (latest); Audit `69cd8f2cab709479d729e594`; Outreach `69cd8f31ab709479d729e599` |

## Review Notes

- This pack is intentionally compact and uses only stored records already present in the repository-backed Mongo data.
- It is meant to give PM and AI a grounded slice set for audit/outreach pressure, not to expand acquisition or add a reporting system.
- The strongest validation signal in the pack is the mix of a multilingual niche case, a thinner-but-valid local case, a sparse boundary case, and a richer local baseline.
