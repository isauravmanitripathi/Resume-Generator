<script lang="ts">
  const title = "How to Get a Gemini API Key (Google AI Studio)";
  const subtitle =
    "This guide shows only one thing: how to obtain a Gemini API key using Google AI Studio (not Google Cloud Console). It follows the exact UI flow and includes the official links you need.";

  const steps = [
    {
      id: "step-1",
      title: "Step 1 — Open Google AI Studio",
      body:
        "Go to Google AI Studio in your browser. This is the official place where you can generate and manage Gemini API keys without using Google Cloud Console.",
      hintLabel: "Open this link:",
      hintLinkText: "https://aistudio.google.com/",
      hintLinkHref: "https://aistudio.google.com/"
    },
    {
      id: "step-2",
      title: "Step 2 — Sign in with your Google Account",
      body:
        "Sign in using the Google account you want to use for Gemini API access. If you manage multiple accounts, make sure you're logged in to the correct one before generating the key.",
      hint:
        "Tip: If the wrong account opens, sign out and re-open AI Studio using the correct Google account."
    },
    {
      id: "step-3",
      title: "Step 3 — Go to “Get API key” / “API keys” section",
      body:
        "Inside Google AI Studio, open the API key section. You will typically see a button or menu item like “Get API key” or “API keys”. That section is where keys are created and shown.",
      hintLabel: "Direct API key page (if available):",
      hintLinkText: "https://aistudio.google.com/app/apikey",
      hintLinkHref: "https://aistudio.google.com/app/apikey"
    },
    {
      id: "step-4",
      title: "Step 4 — Create a new API key",
      body:
        "Click the option to create a new API key (usually labeled “Create API key” or similar). Google AI Studio will generate a Gemini API key for your account.",
      hint:
        "If you already generated a key previously, it may be listed here. You can generate additional keys if needed."
    },
    {
      id: "step-5",
      title: "Step 5 — Copy the API key and store it safely",
      body:
        "Once the key appears, copy it immediately and store it securely (password manager recommended). Treat it as a secret — anyone with this key can use your API quota/billing.",
      danger:
        "Important: Never paste your Gemini API key into public repositories, screenshots, frontend code, or client-side apps. If it gets exposed, delete/revoke it and generate a new key immediately."
    }
  ];

  const footerLinks = [
    {
      label: "Google AI Studio",
      href: "https://aistudio.google.com/"
    },
    {
      label: "AI Studio API Keys page",
      href: "https://aistudio.google.com/app/apikey"
    }
  ];
</script>

<svelte:head>
  <title>{title}</title>
  <meta
    name="description"
    content="Step-by-step guide to obtaining a Gemini API key using Google AI Studio (not Google Cloud Console)."
  />
</svelte:head>

<div class="page">
  <div class="container">
    <header class="hero">
      <h1>{title}</h1>
      <p class="subtitle">{subtitle}</p>

      <div class="chips" aria-label="Quick info">
        <span class="chip">~2 minutes</span>
        <span class="chip">AI Studio only</span>
        <span class="chip">Official links</span>
      </div>
    </header>

    <main class="main">
      <section class="card">
        <h2>Step-by-Step Guide</h2>

        {#each steps as step}
          <article class="step" id={step.id}>
            <h3 class="stepTitle">{step.title}</h3>

            <p class="body">{step.body}</p>

            {#if step.danger}
              <div class="danger">
                <strong>Important:</strong>
                <span>{step.danger.replace("Important:", "").trim()}</span>
              </div>
            {/if}

            {#if step.hint}
              <div class="hint">{step.hint}</div>
            {/if}

            {#if step.hintLinkHref}
              <div class="hint">
                <div class="hintLabel">{step.hintLabel}</div>
                <a class="hintLink" href={step.hintLinkHref} target="_blank" rel="noopener noreferrer">
                  {step.hintLinkText}
                </a>
              </div>
            {/if}
          </article>
        {/each}
      </section>

      <footer class="footer">
        {#each footerLinks as link, i}
          <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
          {#if i !== footerLinks.length - 1}
            <span class="sep">•</span>
          {/if}
        {/each}
      </footer>
    </main>
  </div>
</div>

<style>
  /* Uber-style: white background + black text */
  :global(html, body) {
    height: 100%;
  }

  :global(body) {
    margin: 0;
    background: #ffffff;
    color: #000000;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica,
      Arial, "Apple Color Emoji", "Segoe UI Emoji";
    line-height: 1.65;
    letter-spacing: -0.01em;
  }

  a {
    color: #000000;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  a:hover {
    opacity: 0.75;
  }

  .page {
    width: 100%;
  }

  .container {
    max-width: 920px;
    margin: 0 auto;
    padding: 48px 18px 72px;
  }

  .hero {
    padding: 28px 22px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0));
  }

  h1 {
    margin: 0 0 10px 0;
    font-size: 34px;
    font-weight: 750;
    letter-spacing: -0.03em;
  }

  .subtitle {
    margin: 0;
    max-width: 75ch;
    color: rgba(0, 0, 0, 0.72);
    font-size: 15px;
  }

  .chips {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 0, 0, 0.05);
    font-size: 13px;
    color: rgba(0, 0, 0, 0.72);
    white-space: nowrap;
  }

  .main {
    margin-top: 18px;
  }

  .card {
    margin-top: 16px;
    padding: 22px 22px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 18px;
    background: #ffffff;
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .step {
    margin-top: 16px;
    padding: 16px 16px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 16px;
    background: #ffffff;
  }

  .stepTitle {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 700;
    color: #000000;
  }

  .body {
    margin: 10px 0;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.72);
  }

  .hint {
    margin-top: 12px;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 0, 0, 0.025);
    color: rgba(0, 0, 0, 0.72);
    font-size: 14px;
  }

  .hintLabel {
    font-weight: 650;
    margin-bottom: 6px;
    color: rgba(0, 0, 0, 0.8);
  }

  .hintLink {
    word-break: break-word;
  }

  .danger {
    margin-top: 14px;
    padding: 14px 14px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }

  .danger strong {
    font-weight: 750;
    margin-right: 8px;
  }

  .footer {
    margin-top: 18px;
    padding: 18px 22px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 18px;
    background: rgba(0, 0, 0, 0.015);
    color: rgba(0, 0, 0, 0.72);
    font-size: 13px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .sep {
    opacity: 0.5;
  }
</style>