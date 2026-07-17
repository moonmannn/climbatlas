# Route grade parsing and filtering

PP-4 separates source wording from the values used by the route explorer.
This keeps the catalog traceable without making every source use the same
grading system.

## Data layers

- `original` is the source wording. The parser never replaces it.
- `primarySystem` identifies the locally relevant comparable system when it
  can be read safely.
- `rangeMin` and `rangeMax` support range overlap filtering.
- `sortValue` is the midpoint used for stable easy-to-hard ordering.
- `filterBands` contains every broad difficulty band crossed by a range.
- `aidGrade` and `commitmentGrade` remain additional context instead of being
  mixed into the primary free-climbing grade.
- `parseStatus: "unparsed"` means ClimbAtlas could not classify the wording
  safely. The UI keeps the original text and does not invent a conversion.

## Supported catalog systems

The parser currently recognizes YDS, V-scale, French sport, Font boulder,
UIAA, Australian, Alpine, aid, ice, and mixed grades. Destination and climbing
type provide context when one string contains more than one system.

Examples covered by the regression script include `5.10a/b`, `5.9-5.12`,
`V6-V15`, `6a-7c`, `V/VI- with VI+ step`, `VI 5.11 A2`, and
`33 / 5.14b`.

## Filter behavior

- A destination shows only difficulty bands that exist in its route data.
- Comparable grade options use the destination's most common primary system.
- A route range matches any selected grade range it overlaps.
- Sector and grade controls are omitted when there are no useful options.
- Cross-system equivalents are source-provided context, not computed claims.

## Validation

Run:

```powershell
npm.cmd run grades:validate
```

The command checks the regression samples and every public catalog route. At
the PP-4 checkpoint, 1,107 routes were checked and 35 descriptive or incomplete
grade strings were deliberately left unparsed.
