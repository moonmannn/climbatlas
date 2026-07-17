# ClimbAtlas Brand Voice

## Product identity

ClimbAtlas is a personalized climbing discovery platform.

**Core promise:** Find places that fit how you climb.

The voice combines a knowledgeable climbing friend with a modern outdoor editor. It should be clear, useful, informed, calm, outdoors-aware, and distinctive without becoming poetic. Adventure may be present, but exaggeration should not be.

ClimbAtlas should not sound like generic SaaS copy, tourism advertising, a luxury hotel, extreme-sports marketing, an internal data dashboard, or AI-generated poetry.

## Voice priorities

1. **Useful before atmospheric.** Tell the reader what helps them choose.
2. **Specific before impressive.** Prefer a concrete style, fit, or trade-off over a grand adjective.
3. **Calm before performative.** Sound confident without selling too hard.
4. **Climbing-aware before jargon-heavy.** Use climbing language when it clarifies a decision.
5. **Human before branded.** Not every sentence needs a clever turn.

## Evidence model

Keep three content layers separate:

- **Sourced fact:** A verifiable name, grade, type, length, location, historical event, access notice, or other supported detail. Preserve its source and uncertainty.
- **ClimbAtlas editorial judgment:** An original interpretation about fit, trade-offs, or how a route may suit a preference. Phrase it as guidance, not fact.
- **Inferred DNA attribute:** A transparent match derived from structured data. Label it as inferred and never present it as ability or safety advice.

If a claim cannot be assigned to one layer, do not publish it yet.

## Current-copy audit

This audit records recurring patterns observed before the editorial system was created. It is not a production rewrite.

### Existing strengths

- The homepage has a clear product promise: “Find places that fit how you climb.”
- Route content often answers a real decision question through `bestFor`, `decisionHint`, and practice focus.
- The voice understands climbing motivations beyond grade: movement, endurance, social energy, exploration, and commitment.
- Source-aware route pages explain that ClimbAtlas is an index rather than a replacement for beta or guidebooks.
- English and Chinese are treated as first-class display languages rather than an afterthought.
- Climbing DNA copy is warm and identity-led without relying on competition language.

### Recurring problems

- Several route and destination entries stack two or three metaphors where one concrete sentence would work better.
- Repeated templates such as “Choose it when...” and “This card is for climbers who...” make a large catalog feel machine-generated.
- Some routes are personified so strongly that route type, fit, and trade-offs become harder to find.
- Some claims about movement, conditions, history, or route character read as factual even when their evidence status is unclear.
- Internal labels such as source status and verification workflow can leak into public-facing copy.
- Match percentages can appear more precise than the underlying preference model supports.
- Some English and Chinese pairs preserve topic but not tone, intensity, or factual caution.
- The repository contains mojibake in some Chinese strings. Encoding corruption is a blocking quality issue, not a stylistic preference.

## Voice controls by mode

| Mode | Plain | Editorial | Expressive |
| --- | ---: | ---: | ---: |
| UI copy | High | Low | None |
| Homepage product copy | Medium | High | Low |
| Destination copy | Medium | High | Medium |
| Route card | High | Medium | Low |
| Route detail | High | Medium | Low |
| DNA quiz | High | Medium | Low |
| DNA archetype | Medium | High | High |
| DNA Match explanation | High | Medium | Low |

Expressive does not mean vague. Even the most identity-led copy must preserve the product’s factual boundaries.
