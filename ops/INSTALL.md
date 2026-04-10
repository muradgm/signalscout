# Install Notes

1. Back up the current `ops/` folder.
2. Replace it with this `ops/` tree.
3. Confirm all agent launch references point to the new paths.
4. Update any hard-coded path references in external tooling or prompts.
5. Start by reading `ops/README.md` and the files in `ops/core/`.

## Bootstrap chats

Use the files in `ops/runtime/bootstrap/` to initialize one dedicated chat per lane: `PM`, `QA`, `AI`, `DATA`, `UX`, `FS`, `DEVOPS`, and `GTM`. Each chat should load its matching `*_BOOT.md` file and then wait for an assignment packet before doing meaningful work.
