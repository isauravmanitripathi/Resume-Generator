<script lang="ts">
  import type { Profile } from '$lib/db';

  interface Props {
    html: string;
    profile: Profile;
  }

  let { html, profile } = $props<Props>();

  let srcDoc = $derived(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Normalize & Reset */
          *, *::before, *::after { box-sizing: border-box; }
          html, body { 
            margin: 0; 
            padding: 0; 
            width: 100%; 
            min-height: 100%; 
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: white;
            /* Default Print Settings */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        </style>
        <script>
          /* --- MOCK API LAYER --- */
          window.originalFetch = window.fetch;
          
          const profileData = ${JSON.stringify(profile)};

          window.fetch = async (url) => {
            // Normalize URL to handle potential leading slashes or full paths
            const path = url.toString();
            
            if (path.endsWith('/api/profile')) {
               console.log('[Mock API] 200 OK GET /api/profile');
               // Simulate micro-delay for realism
               await new Promise(r => setTimeout(r, 50));
               
               return {
                 ok: true,
                 status: 200,
                 json: async () => (JSON.parse(JSON.stringify(profileData))) // Return clone
               };
            }
            return window.originalFetch(url);
          };

          /* --- ERROR HANDLING --- */
          window.onerror = function(msg, url, line, col, error) {
             console.error('Template Error:', error);
             const div = document.createElement('div');
             div.style.cssText = 'position:fixed; top:10px; right:10px; max-width: 300px; background:#ef4444; color:white; padding:12px; z-index:9999; font-family:monospace; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 12px;';
             div.innerHTML = '<strong>⚠️ Runtime Error</strong><br/>' + msg;
             document.body.appendChild(div);
             setTimeout(() => div.remove(), 5000);
             return false;
          };
        <\/script>
      </head>
      <body>
        ${html || '<div style="display:flex;height:100vh;align-items:center;justify-content:center;color:#94a3b8;">Empty Template</div>'}
      </body>
    </html>
  `);
</script>

<!-- The iframe itself acts as the "Page" container -->
<iframe 
  srcdoc={srcDoc}
  title="Resume Canvas"
  class="bg-white shadow-2xl mx-auto print:shadow-none print:w-full print:h-full border-none block"
  style="width: 210mm; height: 297mm; min-width: 210mm; min-height: 297mm;"
  sandbox="allow-scripts allow-same-origin allow-popups"
></iframe>
