# Submission Packaging Plan

Date created: 2026-06-12

Triggered by James annotation on the submission requirement: "Hosting it is really no problem. Let's go with a Google Doc, which will be easier for the reviewer to use."

Status: deliverable packaging decision. This does not change product scope.

## Source Requirement

`[SOURCE]` The assignment asks James to send both the memo and a link to the prototype.

`[SOURCE]` The memo may be a PDF or Google Doc.

`[SOURCE]` Providing files and a README to run locally is acceptable; hosting is not required.

## James's Decision

`[JAMES]` Use a Google Doc for the memo because it is easier for the reviewer to use.

`[JAMES]` Canonical memo document: https://docs.google.com/document/d/1dnKK33IUMR6ZnNyZMWJpKV9zKxZBWwPjsXiSuqAzKEk/edit?tab=t.0#heading=h.8zgdrfx486jm

`[JAMES]` Hosting the prototype is acceptable; no need to rely only on local files.

## Planned Submission Package

Primary deliverables:

- Google Doc memo: https://docs.google.com/document/d/1dnKK33IUMR6ZnNyZMWJpKV9zKxZBWwPjsXiSuqAzKEk/edit?tab=t.0#heading=h.8zgdrfx486jm
- Hosted prototype URL: https://prototype-xi-lemon.vercel.app
- GitHub repo link or package link with README/run instructions.

Fallback deliverables:

- PDF export of the memo for archive or backup.
- Local run instructions in `README.md`.
- Optional demo screenshots or short fallback notes if live hosting fails.

## Packaging Quality Bar

Before submission:

- Google Doc is shared with the correct permissions.
- Google Doc title is clear and professional.
- Hosted prototype URL works in a fresh browser session.
- README can run the app from a clean checkout.
- Repo does not contain private notes that should not be shared.
- Memo and prototype describe the same v1, not two different products.
- Submission email includes only the minimum necessary links and a brief process note if useful.

## Open Packaging Decisions

- Hosting provider for prototype. Current deployment uses Vercel.
- Whether prototype link should be public, unlisted, or password-protected.
- Whether to share the Google Doc with view-only or comment permissions.
- Whether to include the private GitHub repo directly or send a packaged archive/README link.
- Whether to include a PDF backup alongside the Google Doc.

## Anti-Drift Rule

Do not spend early time polishing submission packaging before the product logic is sound. Packaging matters late; scope and rationale matter now.

## Source Of Truth

The Google Doc is the canonical memo. Local Markdown and Notion versions are working history unless James explicitly moves canonical ownership again.

Future memo edits should be applied directly to the Google Doc through the Google Docs connector when possible. If connector write access fails or a change is safer for James to review manually, provide paste-ready replacement text targeted to the exact section.
