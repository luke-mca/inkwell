# Self-Review: Lecture 9 (Tagging, Strategy Search, Observer Publish Event)

**Commit reviewed:** `0441a51`
**Reviewer prep time:** ~20 minutes
**Defects found:** 6 (1 major, 5 minor)
**Outcome:** Accept with follow-ups

## Findings

1. **Validation:** `tagNames` is not validated. If a tag name appears twice (`["js", "js"]`), the insert breaks. Blank names create empty tags. `"JS"` and `"js"` become separate tags. A non-array value crashes on `.map`.
2. **Duplicated logic:** `findPublished` and `searchPublished` in `post.repository.js` both have their own copy of the pagination code (fetch `pageSize + 1`, slice, compute `hasMore`), which could just be one helper function.
3. **Node version:** `EventBus.on()` uses `??=`. Fixed by adding `engines.node` to `server/package.json`
4. **Process:** The commit message has no backlog item ID, and tagging/search has no entry in `docs/BACKLOG.md`.

