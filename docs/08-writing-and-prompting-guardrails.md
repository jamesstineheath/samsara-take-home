# Writing And Prompting Guardrails

Date created: 2026-06-12

Triggered by James annotation on the prompt sentence: "We value concise, direct, plain-language writing."

Status: project-wide style guardrail. Applies to future research synthesis, memo drafting, prototype copy, README writing, and prompts given to other AI models.

## Source Requirement

`[SOURCE]` The Samsara assignment says they value concise, direct, plain-language writing.

`[JAMES]` James wants this requirement reflected clearly in all prompting.

## Core Rule

Write like a Principal PM explaining product judgment to a smart operator:

- Short sentences.
- Plain words.
- Concrete nouns and verbs.
- One claim per sentence when possible.
- No ornamental phrasing.
- No vague strategy language.
- No AI-sounding breadth.

## Prompting Rule

Every future prompt to an AI model for this project should include this constraint:

> Use concise, direct, plain-language writing. Avoid jargon, consulting language, inflated claims, and generic AI/product phrasing. Prefer specific operational language that James can defend live.

For drafting prompts, also include:

> Do not optimize for polish before logic. Keep claims source-backed, assumptions explicit, and wording simple enough that a maintenance supervisor would understand it.

For research prompts, include:

> Return cited findings in plain language. Separate source facts from inference. Do not turn research into memo prose.

For prototype copy prompts, include:

> Use shop-floor language. Labels should be short, concrete, and action-oriented. Avoid cute AI language.

## Bad Patterns To Cut

- "Leverage AI to optimize operational workflows."
- "Unlock end-to-end visibility across the maintenance lifecycle."
- "A single pane of glass."
- "Seamless orchestration."
- "AI-powered productivity."
- "Transformative command center."
- "Empower teams to..."
- "Drive efficiency at scale."

## Better Patterns

- "Show what needs attention before the shift starts."
- "Flag work that is blocked by parts or technician skill."
- "Help the supervisor commit a plan they can explain."
- "Make missed defects less likely."
- "Show why the system ranked this work first."
- "Let the supervisor override the plan and capture why."

## Draft Review Checklist

Before any memo section is marked ready:

- Can James say every sentence out loud without sounding unlike himself?
- Does each paragraph make one point?
- Is every claim either sourced, James-owned, or clearly marked as an assumption?
- Are abstract words replaced with operational specifics?
- Are we explaining judgment, not decorating it?
- Did we remove any sentence that only sounds impressive?

## Prompt Review Note

This guardrail applies to all future model work. If another model returns polished but generic language, reject or rewrite it before it enters any project artifact.
