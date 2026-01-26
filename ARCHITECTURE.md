# I Need A Resume - Architectural Blueprint

## 1. Technical Framework & Libraries
- **Framework**: SvelteKit (using `@sveltejs/adapter-static` for 100% client-side execution on Vercel).
- **Database**: Dexie.js (IndexedDB) for local JSON storage.
- **Interactivity**: Svelte Actions for custom drag-and-resize logic.
- **Validation**: Zod for strictly typed JSON responses from AI.
- **Styling**: Tailwind CSS v4 with `print:` utilities.

## 2. Security & API Governance
**"Bring Your Own Key" (BYOK) Strategy:**
- **Cookie-Based Keys**: API keys are stored in a browser cookie with a 24-hour expiry (`Max-Age=86400`).
- **HttpOnly/Strict**: The cookie is set to `SameSite=Strict`. Since the app is client-side, the frontend reads it directly to make calls.
- **Encryption at Rest**: Master Data in IndexedDB is optionally encrypted using a user-provided local password (AES-256) via Web Crypto API.
- **One-Click Purge**: "Panic Button" in Settings clears all cookies and wipes IndexedDB instantly.

## 3. Page-by-Page Design Plan

### Page 1: The AI Architect (Dashboard)
- **UI**: Split-screen. Left: Markdown input for Job Description (JD). Right: "Quick View" of Master Profile.
- **Logic**:
    - Loops through Master JSON.
    - Sends parallel requests to provider (Gemini, Grok, etc.).
    - Prompt: "Using this JD: [TEXT], rewrite my role... Return strictly as JSON."

### Page 2: The Design Canvas (The Editor)
- **The Page**: White div styled to A4 dimensions (210mm x 297mm).
- **The Boxes**: Draggable/resizable containers for sections.
- **Interaction Logic**:
    - **Drag & Place**: Move anywhere.
    - **Resize**: Corner handles.
    - **Auto-Font Scaling**: Svelte reactive statement calculates `scrollHeight` vs `clientHeight` and shrinks font until it fits.
- **Style Tools**: Floating toolbar for Dividers, Fonts, Bold/Italic.

### Page 3: The Profile Vault (Data Entry)
- **UI**: Multi-tab form (Experience, Education, Projects, Publications, Skills).
- **JSON Sync**: Instant save to IndexedDB.
- **Context Blobs**: "Raw Context" box for each job to dump full history for AI to use.

### Page 4: History & Saved Versions
- **Library**: Grid of cards for previously generated resumes.
- **Versioning**: Stores Layout Coordinates (X, Y, W, H) and Tailored JSON Content. Allows "Re-Open" with exact visual fidelity.

### Page 5: Settings
- **Provider Config**: Toggle OpenAI, Google, Anthropic, xAI.
- **Model Selection**: Choose models (e.g., `gemini-1.5-flash`, `gpt-4o`).
- **Key Health**: Visual indicator of session time remaining.

## 4. The JSON Data Model
```json
{
  "profile": { "name": "Saurav Tripathi", "email": "...", "phone": "..." },
  "canvas": [
    {
      "id": "exp_1",
      "type": "Experience",
      "content": { "role": "Law Firm Owner", "bullets": ["Managed 200k cases...", "Built proprietary app..."] },
      "layout": { "x": 10, "y": 60, "w": 190, "h": 50, "fontSize": "11pt" }
    },
    {
      "id": "line_1",
      "type": "Divider",
      "layout": { "x": 10, "y": 55, "w": 190, "h": 1 }
    }
  ]
}
```

## 5. Instant PDF Strategy
- **Method**: Pure CSS Paged Media (no canvas/image generation).
- **Print Styles**: `@media print` hides UI, centers A4 div.
- **Resolution**: Vector-quality text.
- **Command**: `window.print()`.
