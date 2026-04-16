# Learnings

## [LRN-20260416-001] knowledge_gap

**Logged**: 2026-04-16T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
API Ninjas Cars API rejects the `limit` query parameter on the free tier with HTTP 400.

### Details
When integrating `https://api.api-ninjas.com/v1/cars`, adding `limit=5` (or any value) causes the API to respond with:
```
{"error": "The limit parameter is for premium users only."}
```
Unlike many APIs that silently ignore unsupported params, API Ninjas returns a hard 400. This broke the entire specs lookup until the parameter was removed. The free tier simply returns up to a default page size when no `limit` is provided.

### Suggested Action
On free-tier API Ninjas integrations, omit the `limit` parameter entirely. Do not set it even to a small value. If pagination is required later, upgrade the plan rather than probing defaults.

### Metadata
- Source: error
- Related Files: app/api/cars/specs/route.ts
- Tags: api-ninjas, external-api, free-tier, cars-api
- See Also: LRN-20260416-002

### Resolution
- **Resolved**: 2026-04-16
- **Commit/PR**: 51cd594
- **Notes**: Removed the `limit: '5'` entry from `URLSearchParams` in the specs proxy route.

---

## [LRN-20260416-002] knowledge_gap

**Logged**: 2026-04-16T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
API Ninjas returns string error messages in premium fields for free-tier requests rather than `null` or omitting the keys — numeric transforms must guard against strings.

### Details
Fields like `city_mpg`, `highway_mpg`, and `combination_mpg` come back as the literal string `"this field is for premium subscribers only"` on the free tier. Previous code assumed `number` and used a `!v || v <= 0` check, which returned truthy for non-empty strings and propagated `NaN` through arithmetic (visible on the UI as consumption values showing `NaN L/100km`).

Similar premium-gated fields on this API probably follow the same contract, so the fix should generalize.

### Suggested Action
Type premium-gated numeric fields as `number | string` in TypeScript interfaces. In conversion helpers, coerce with `Number(x)` and reject with `isNaN(v) || v <= 0` before computing. Prefer returning an empty string (or `null`) for "not available" so UI can branch on presence.

Example pattern:
```ts
function mpgToL100(mpg: number | string): string {
  const v = Number(mpg);
  if (!v || isNaN(v) || v <= 0) return '';
  return (235.214 / v).toFixed(1);
}
```

### Metadata
- Source: error
- Related Files: app/api/cars/specs/route.ts
- Tags: api-ninjas, external-api, free-tier, type-safety, data-validation
- See Also: LRN-20260416-001

### Resolution
- **Resolved**: 2026-04-16
- **Commit/PR**: 51cd594
- **Notes**: Updated `NinjasCar` interface to allow `number | string` for mpg fields and hardened `mpgToL100` with `Number()` + `isNaN` guard.

---

## [LRN-20260416-003] best_practice

**Logged**: 2026-04-16T00:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: backend

### Summary
API Ninjas Cars model matching is literal — strip trim/suffix tokens from the user-entered model before querying.

### Details
Querying `model=3 series` or `model=330i xdrive` returns an empty array. The API matches against a base model token. User-entered values from a trim/variant selector typically include suffixes like `xDrive`, `Avant`, `Touring`, `Sportback`, etc., which must be removed.

### Suggested Action
Normalize before the request: lowercase, take the first whitespace-separated token (`model.toLowerCase().split(' ')[0]`). When no year match exists, fall back to the nearest year rather than returning null, so UI still shows something useful.

### Metadata
- Source: error
- Related Files: app/api/cars/specs/route.ts
- Tags: api-ninjas, data-normalization, fuzzy-matching
- See Also: LRN-20260416-001, LRN-20260416-002

### Resolution
- **Resolved**: 2026-04-16
- **Commit/PR**: 51cd594
- **Notes**: Added `modelBase = model.toLowerCase().split(' ')[0]` and nearest-year fallback via `cars.reduce`.

---
