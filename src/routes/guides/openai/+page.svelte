<script lang="ts">
  const title = "How to Generate a New OpenAI API Key";
  const subtitle =
    "This guide explains only one thing: how to create and obtain a brand-new OpenAI API key from the official OpenAI Developer Platform. No terminal, no coding setup — only the exact UI flow with direct links.";

  const steps = [
    {
      id: "step-1",
      title: "Step 1 — Open the OpenAI API Keys page",
      body:
        "Open the official API Keys page in your browser and sign in to your OpenAI account.",
      hintLabel: "Open this link:",
      hintLinkText: "https://platform.openai.com/settings/organization/api-keys",
      hintLinkHref: "https://platform.openai.com/settings/organization/api-keys"
    },
    {
      id: "step-2",
      title: "Step 2 — Click “Create new secret key”",
      body:
        "On the API Keys page, click “Create new secret key”. This generates a new API key for you.",
      hint:
        "If you do not see the button, ensure you’re in the correct organization/project and that your account has permission to create API keys."
    },
    {
      id: "step-3",
      title: "Step 3 — Set the key permissions (recommended)",
      body:
        "When asked, choose the permission level for the key: All, Restricted, or Read Only.",
      hintLabel: "Official permissions guide:",
      hintLinkText: "https://help.openai.com/en/articles/8867743-assign-api-key-permissions",
      hintLinkHref: "https://help.openai.com/en/articles/8867743-assign-api-key-permissions"
    },
    {
      id: "step-4",
      title: "Step 4 — Copy the key (shown only once)",
      body:
        "After creation, OpenAI will show the secret key value. Copy it immediately and store it safely. In most cases, the full key is only shown once.",
      danger:
        "Important: Never share your API key publicly. Do not paste it in GitHub, screenshots, or public code. If you suspect it was exposed, revoke the key immediately and generate a new one.",
      hintLabel: "Official help page:",
      hintLinkText: "https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key",
      hintLinkHref: "https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key"
    },
    {
      id: "step-5",
      title: "Step 5 — Confirm the key appears in your list",
      body:
        "Your newly created key will appear in your API Keys list on the same page. You can create multiple keys for different projects.",
      hintLabel: "Return here anytime:",
      hintLinkText: "API Keys page",
      hintLinkHref: "https://platform.openai.com/settings/organization/api-keys"
    }
  ];

  const footerLinks = [
    {
      label: "Official: API Keys",
      href: "https://platform.openai.com/settings/organization/api-keys"
    },
    {
      label: "Help: Where do I find my API key?",
      href: "https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key"
    }
  ];
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="Step-by-step guide to generating a new OpenAI API key from the OpenAI Developer Platform." />
</svelte:head>

<div class="page">
  <div class="container">
    <header class="hero">
      <h1>{title}</h1>
      <p class="subtitle">{subtitle}</p>

      <div class="chips" aria-label="Quick info">
        <span class="chip">~2 minutes</span>
        <span class="chip">Official links</span>
        <span class="chip">Security-safe steps</span>
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