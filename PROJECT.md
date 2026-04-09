# Resume Architect — Project Documentation

## Overview

Resume Architect is a local-first, AI-powered resume builder that runs entirely in the browser. The core idea: users maintain a single **Profile Vault** — a master store of all their career data with rich, unformatted context — and the AI uses that raw material to generate tailored, job-specific resume versions on demand. No backend. No accounts. No data ever leaves the user's device.

---

## The Core Concept: Vault → Tailor → Export

```
Profile Vault (master data)
       │
       ▼
  AI Architect (paste job description)
       │
       ├─── tailors Summary
       ├─── tailors Experience bullets
       ├─── tailors Education highlights
       └─── tailors Skill descriptions
                   │
                   ▼
          Resume Version (stored locally)
                   │
             ┌─────┴──────┐
             ▼            ▼
          PDF Export   Cover Letter PDF
```

The **Profile Vault** holds raw "context blobs" per experience/education entry — the user dumps everything they've ever done in a role. The AI then reads that blob alongside a job description and generates polished, ATS-optimized bullet points. This means the same experience can be tailored differently for a frontend role vs. a DevOps role without the user rewriting anything.

Each tailored set of content is saved as a **Resume Version**, which is an overlay on top of the master profile. The master data is never mutated — only the tailored delta is stored.

---

## Technology Stack

### Framework & Language

| Technology | Version | Role |
|---|---|---|
| **SvelteKit** | ^2.49.1 | Full-stack web framework (used as SPA) |
| **Svelte 5** | ^5.45.6 | UI components with Runes reactivity system |
| **TypeScript** | ^5.9.3 | Type safety across all modules |
| **Vite** | ^7.2.6 | Build tooling and dev server |

The project uses **Svelte 5 Runes** — the new compiler-based reactivity model — throughout. This means `$state`, `$derived`, `$effect`, and `$props` instead of the older `let` + stores pattern. Runes make reactivity explicit and traceable at the compiler level, reducing the "magic" of older Svelte.

### Styling

| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS v4** | ^4.1.18 | Utility-first styling |
| **@tailwindcss/vite** | ^4.1.18 | Vite plugin for zero-config Tailwind integration |
| **Lucide Svelte** | ^0.563.0 | Icon library |

Tailwind v4 is used with `@reference "tailwindcss"` in `<style>` blocks, enabling `@apply` directives alongside inline utilities. No separate `tailwind.config.js` — config lives in CSS.

### Local Data Layer (IndexedDB)

All data is stored client-side using **Dexie.js**, a typed IndexedDB wrapper.

| Database | Class | Tables | Purpose |
|---|---|---|---|
| `INeedAResumeDB` | `ResumeDatabase` | `profile`, `resumes`, `settings`, `customTemplates`, `creativeDesigns` | Core application data |
| `PromptVaultDB` | `PromptDatabase` | `prompts` | AI prompt templates |
| `ActivityLogDB` | `ActivityDatabase` | `logs` | API call audit log |

Three separate Dexie databases are used to keep concerns isolated. This also means the prompt system and activity logger are independently queryable without touching the main data.

### PDF Generation

| Library | Role |
|---|---|
| **jsPDF** | ^4.1.0 | Programmatic PDF construction |
| **html2pdf.js** | ^0.14.0 | DOM-to-PDF rendering (captures styled HTML as PDF) |
| **pdfmake** | ^0.3.3 | Document-definition-based PDF generation |

Multiple PDF libraries are available for different use cases — resume templates rendered as HTML are captured with html2pdf, while cover letters are built programmatically with jsPDF/pdfmake for precise formatting control.

### AI Integration

The app integrates with five AI providers via their REST APIs, called directly from the browser using API keys stored locally in IndexedDB:

| Provider | Usage |
|---|---|
| **OpenAI** | Default provider; GPT-4.1 for resume tailoring and cover letters |
| **OpenRouter** | Unified gateway to hundreds of models |
| **Google Gemini** | Alternative provider |
| **Anthropic (Claude)** | Alternative provider |
| **Grok (xAI)** | Alternative provider |

The active provider and model are stored in `AppSettings` in IndexedDB. All API keys are stored locally — they never touch a server.

### Utilities

| Library | Role |
|---|---|
| **uuid** | ^13.0.0 | Generating stable IDs for all data entities |
| **Zod** | ^4.3.6 | Schema validation |
| **Vercel Speed Insights** | ^1.3.1 | Client-side performance telemetry |

---

## Architecture

### Data Models

```typescript
// The master profile — one singleton record in IndexedDB
Profile {
  id: 'master'
  basics: { name, email, phone, title, summary, address, socials }
  experience: ExperienceItem[]   // each has a raw_context blob
  education: EducationItem[]     // each has a raw_context blob
  skills: SkillItem[]
  projects: ProjectItem[]        // each has a raw_context blob
  achievements: AchievementItem[]
  publications: PublicationItem[]
}

// A job-specific tailored overlay — never mutates the master profile
ResumeVersion {
  id, name, created, templateId
  tailoredContent: {
    summary?: string
    experience: Record<itemId, tailoredText>
    education: Record<itemId, tailoredText>
    skills: Record<itemId, tailoredText>
  }
}
```

The **merge** happens at render time using a `$derived` computed property in the main page. The master profile is spread-cloned and tailored content is applied on top — the original data is never touched. This means reverting a tailored version or switching between versions is instantaneous.

### Prompt System

AI prompts are stored in IndexedDB (`PromptVaultDB`) as templates with `systemPrompt` and `userPromptTemplate` fields. Template variables like `{{experience}}`, `{{jobDescription}}`, and `{{numPoints}}` are replaced at runtime before sending to the AI.

Default prompts ship with the app and auto-initialize on first load. Non-custom prompts are auto-updated when the app ships new defaults. Users can override any prompt and mark it `isCustom: true` to prevent auto-updates.

Prompts in the system:
- `resume-tailor` — rewrites experience bullet points
- `summary-gen` — generates the professional summary
- `education-tailor` — highlights relevant coursework
- `skill-extract` — extracts skills from a job description
- `cover-letter-gen` — generates a full structured cover letter

All AI responses are required to return **strict JSON** (`{"tailored_content": "..."}`) so they can be parsed and stored programmatically. The app includes fallback parsing logic to strip markdown code fences if the model wraps its response.

### Resume Templates

Templates are plain Svelte components that receive a `Profile` prop and render as styled HTML. The template system is designed so the rendered HTML can be captured as a PDF.

| Template | Style |
|---|---|
| Classic | Traditional single-column |
| Elegant | Centered header, horizontal rule separators |
| Executive | Two-column, accent colors |
| Cupertino | Clean, minimal, Apple-inspired |
| Creative | Canvas-based free-form layout |

Users can also write **custom HTML/CSS** directly in the Design tab, which overrides the selected template.

### Activity Logging

Every AI API call is logged to `ActivityLogDB` with the full request payload, response, provider, model, timestamp, and success/error status. This provides an audit trail and helps with debugging prompt issues.

---

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Main workspace — AI tailoring + live resume preview |
| `/vault` | Profile Vault — edit master career data |
| `/settings` | API keys, model selection, prompt editing |
| `/history` | Saved resume versions (in development) |
| `/documentation` | In-app developer docs |
| `/guides/openai` | OpenAI integration guide |
| `/guides/gemini` | Gemini integration guide |
| `/guides/anthropic` | Anthropic integration guide |
| `/guides/grok` | Grok integration guide |
| `/guides/openrouter` | OpenRouter integration guide |

---

## Key Design Decisions

**Local-first by design.** There is no backend, no authentication, no database server. All data lives in the user's browser via IndexedDB. This means zero infrastructure cost, zero privacy risk, and full offline capability. The trade-off is no cross-device sync.

**Raw context blobs over structured fields.** Instead of asking users to type pre-formatted bullet points into rigid fields, the Vault stores unstructured "dump everything" blobs per entry. The AI transforms that raw material into polished, tailored output on demand. This decouples data entry from presentation.

**Non-destructive tailoring.** The master profile is never modified when generating tailored content. Resume versions store only the delta — which fields changed and to what. This makes it trivial to maintain multiple tailored versions of the same resume for different job types.

**Multi-provider AI without lock-in.** API keys and model selection are stored per-provider in settings. Switching from OpenAI to OpenRouter or Claude requires no code changes — just update the active provider in settings. This future-proofs the app against pricing or availability changes.

**Svelte 5 Runes throughout.** The entire codebase uses the Runes API (`$state`, `$derived`, `$effect`, `$props`) rather than older Svelte stores and reactive declarations. This was a deliberate choice to stay on the bleeding edge of the framework and benefit from finer-grained reactivity.

---

## What Was Built

- Profile Vault with 7 section types (basics, contact/socials, experience, education, skills, projects, extras)
- AI tailoring engine supporting 4 content types (summary, experience, education, skills) with configurable bullet count
- 5 resume templates with live preview
- Custom HTML/CSS template editor
- Multi-provider AI settings (OpenAI, OpenRouter, Gemini, Anthropic, Grok)
- AI cover letter generator with PDF export
- Prompt management system with user-overridable defaults
- Full activity/audit log for all API calls
- Session persistence (last active resume restored on reload)
- Hard reset utility for clearing cached data without losing the Vault
- Toast notification system
- Vault Explorer sidebar for browsing profile data while in the AI workspace
