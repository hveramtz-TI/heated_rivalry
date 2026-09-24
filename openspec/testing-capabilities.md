## Testing Capabilities

**Strict TDD Mode**: disabled
**Detected**: 2026-09-24

Strict TDD is disabled because the workspace has one discovered project but no
explicit workspace-wide test command covering it. The project-local lint and
build commands are preserved below; neither is a test runner.

### Projects

| Relative path | Stack | Test command | Framework |
| --- | --- | --- | --- |
| `frontend/` | Next.js 16.3.6, React 19.3.0, TypeScript 5 | — (no test script) | — |

### Test Layers

| Relative path | Layer | Available | Tool |
| --- | --- | --- | --- |
| `frontend/` | Unit | ❌ | — |
| `frontend/` | Integration | ❌ | — |
| `frontend/` | E2E | ❌ | — |

### Coverage

| Relative path | Available | Command |
| --- | --- | --- |
| `frontend/` | ❌ | — |

### Quality Tools

| Relative path | Tool | Available | Command |
| --- | --- | --- | --- |
| `frontend/` | Linter | ✅ | `npm run lint` |
| `frontend/` | Type checker | ❌ | — (no standalone script) |
| `frontend/` | Formatter | ❌ | — |
| `frontend/` | Build | ✅ | `npm run build` |

### Baseline

`npm run lint` is configured but currently exits non-zero with 7 errors and 13
warnings in existing frontend components. This baseline must be distinguished
from new regressions during implementation.
