# AI Coding Stress Test

A deliberately feature-dense single-page project-management dashboard built as a practical coding stress test.

The goal is not to maximize framework complexity. The goal is to test whether an AI can design a coherent product, split logic into maintainable modules, implement interactive state, persist data, add keyboard/UX polish, and keep the project verifiable with automated tests.

## Planned capabilities

- Responsive SaaS-style dashboard
- Kanban workflow with drag-and-drop
- Task creation, editing, filtering, and search
- Persistent state via localStorage
- Activity feed and project metrics
- Dark/light theme
- Keyboard shortcuts and command palette
- JSON export/import
- Zero runtime dependencies
- Automated state/logic tests with Node
- GitHub Actions CI

## Run locally

Once implementation lands:

```bash
npm test
npm run serve
```

Then open `http://localhost:4173`.

