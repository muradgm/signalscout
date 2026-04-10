# DEVOPS READINESS CHECKS

- Do documented runtime commands execute successfully in a normal repo checkout?
- Does `ops:guard` call the same P1 test surface that `test:p1` defines?
- Are required environment variables clearly listed?
- Is provider readiness checked before send path usage?
- Are fallback failure modes recorded?
- Is local setup reproducible?
- Are deployment assumptions explicit rather than implied?
