# Push Discipline

Use this default sequence for meaningful tracked work:

`assignment -> return -> qa -> decision -> runtime update -> push`

## Operating rule

- After each accepted tracked code task, create one clean commit and push it.
- Use a proper commit message that matches the task outcome and changed surface.
- If work runs long, push a WIP snapshot at least every 60-90 minutes or before switching tasks.
- Do not batch unrelated work into one delayed push.
- Do not push local-only `ops/` runtime artifacts.
- If something should stay local-only, keep it out of tracked paths before pushing.
