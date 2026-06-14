---
since: '1.0.0'
title: 'Add a New Version'
description: 'How to release a new documentation version without touching any code.'
order: 3
---

<script lang="ts">
	import { Snippet } from '$lib/components/ui/snippet';
</script>

Adding a new version requires **zero code changes** — only content edits.

## 1. Register the Version

Open `content/versions.yaml` and append a new entry. Versions are sorted automatically using Semantic Versioning.

```yaml
- version: '1.0.0'
  label: '1.0.0'
  stable: true

- version: '2.0.0'       # new entry
  label: '2.0.0'
  stable: true
```

| Field | Required | Description |
|-------|----------|-------------|
| `version` | ✅ | Full semver string used in URLs (`/docs/2.0.0/...`) |
| `label` | ❌ | Display name in the version picker. Defaults to `version`. |
| `stable` | ❌ | `false` marks the version as a pre-release. Defaults to `true`. |

> The **latest stable** version is determined automatically — it is the highest `stable: true` entry by semver order. No config change needed.

### Supported Version Formats

The `semver` library handles sorting. Valid examples:

```
1.0.0
2.1.3
2.1.3-RC1
1.0.0-SNAPSHOT
3.0.0-alpha.1
```

> Always use three numeric parts (`MAJOR.MINOR.PATCH`). `1.0-SNAPSHOT` is not valid semver — use `1.0.0-SNAPSHOT` instead.

## 2. Mark New Pages with `since`

Every page that is **new in this version** needs a `since` field in its frontmatter:

```yaml
---
title: 'New Feature'
description: 'Available starting 2.0.0.'
since: '2.0.0'
---
```

Pages without a `since` field default to `0.0.0` (visible in all versions).

## 3. Mark Removed Pages with `until`

If a page is **removed** in the new version, add `until` to its frontmatter. `until` is an **exclusive** upper bound.

```yaml
---
title: 'Legacy Setup'
description: 'Replaced by the new installer in 2.0.0.'
since: '1.0.0'
until: '2.0.0'    # visible in 1.x, hidden from 2.0.0 onwards
---
```

## 4. Pages Unchanged Across Versions

Nothing to do. A page **without** `until` stays visible in all versions from `since` onwards.

```yaml
---
title: 'Introduction'
since: '1.0.0'
# no until → visible in 1.0.0, 2.0.0, 3.0.0, ...
---
```

## Summary

| Action | What to change |
|--------|----------------|
| Add version | `content/versions.yaml` — new entry |
| New page | frontmatter `since: 'x.y.z'` |
| Removed page | frontmatter `until: 'x.y.z'` |
| Unchanged page | nothing |

After editing, rebuild or restart the dev server — the version picker and navigation update automatically.
