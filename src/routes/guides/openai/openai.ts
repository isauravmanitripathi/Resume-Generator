import { promptDb } from '$lib/promptDb';
import { toasts } from '$lib/toastStore';

/**
 * Gets a cookie value by name
 */
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Sets a cookie value
 */
export function setCookie(name: string, value: string, days = 30) {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

/**
 * Validates OpenAI Key and Connection
 */
export async function validateOpenAIAndActivate(key: string, model: string) {
    const toastId = toasts.add("Initializing Activation Flow...", "loading");

    try {
        // 1. Store the key in cookie
        toasts.update(toastId, { message: "Storing API Key safely in cookies..." });
        setCookie('openai_api_key', key);

        // 2. Fetch the "Hello JSON" prompt
        toasts.update(toastId, { message: "Fetching 'Hello JSON' verification prompt..." });
        const prompt = await promptDb.prompts.get('hello-json');
        if (!prompt) {
            throw new Error("Activation prompt not found in database.");
        }

        // 3. Prepare OpenAI Request
        toasts.update(toastId, { message: `Connecting to OpenAI (${model})...` });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: prompt.systemPrompt },
                    { role: 'user', content: prompt.userPromptTemplate }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to connect to OpenAI");
        }

        // 4. Validate Response
        toasts.update(toastId, { message: "Verifying hand-shake response..." });
        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            const parsed = JSON.parse(content);
            if (parsed.greetings === 'hi') {
                toasts.update(toastId, {
                    message: "Connection Activated! Key is valid and handshake successful.",
                    type: 'success'
                });
                return true;
            } else {
                throw new Error("Handshake failed: Unexpected response format.");
            }
        } catch (e) {
            console.error("Parse Error", content, e);
            throw new Error("Handshake failed: Response was not valid JSON.");
        }

    } catch (error: any) {
        toasts.update(toastId, {
            message: `Activation Failed: ${error.message}`,
            type: 'error'
        });
        return false;
    }
}
