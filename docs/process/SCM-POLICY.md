# Software Configuration Management (SCM) Policy

## Branching Strategy

Inkwell uses GitHub Flow:

- `main` is always deployable.
- All work happens on short-lived branches named `<type>/<short-description>`,
  such as `feature/tag-search` or `fix/author-id-spoofing`.
- Contributors merge branches through pull requests that require:
  - All automated tests to pass
  - At least one reviewer to approve the change
- Contributors delete branches after merging them.

## Commit Message Conventions

Inkwell follows Conventional Commits:

    <type>(<scope>): <short summary>

Types: feat, fix, test, docs, refactor, chore, security

Examples:

    feat(posts): add tag-based search
    security(auth): fix authorId spoofing vulnerability

## CI Enforcement (Lecture 20)
`main` is now a protected branch:
- Required status checks: dependency-audit, server-tests, client-tests,
  e2e-tests, docker-build
- No direct pushes to main; all changes via pull request
- Branches must be up to date with main before merging
- The rule applies to administrators too
- This turns Lecture 17's "main is always deployable" policy from a
  documented intention into a mechanically enforced guarantee — a
  pull request cannot merge until every required check passes.
