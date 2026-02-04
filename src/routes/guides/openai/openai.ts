import { promptDb } from '$lib/promptDb';
import { toasts } from '$lib/toastStore';
import { logActivity } from '$lib/activityDb';
import { db } from '$lib/db';

/**
 * Validates OpenAI Key and Connection
 * Note: The key should already be saved to the DB by the caller
 */
export async function validateOpenAIAndActivate(key: string, model: string) {
    const toastId = toasts.add("Initializing Activation Flow...", "loading");

    try {
        // 1. Fetch the "Hello JSON" prompt
        toasts.update(toastId, { message: "Fetching 'Hello JSON' verification prompt..." });
        const prompt = await promptDb.prompts.get('hello-json');
        if (!prompt) {
            throw new Error("Activation prompt not found in database.");
        }

        // 2. Prepare OpenAI Request
        toasts.update(toastId, { message: `Connecting to OpenAI (${model})...` });

        const requestPayload = {
            model: model,
            messages: [
                { role: 'system', content: prompt.systemPrompt },
                { role: 'user', content: prompt.userPromptTemplate }
            ]
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error?.message || "Failed to connect to OpenAI";
            await logActivity({
                timestamp: Date.now(),
                provider: 'openai',
                model: model,
                request: requestPayload,
                response: data,
                status: 'error'
            });
            throw new Error(errorMsg);
        }

        // 3. Validate Response
        toasts.update(toastId, { message: "Verifying hand-shake response..." });
        const content = data.choices[0].message.content;

        try {
            const parsed = JSON.parse(content);
            if (parsed.greetings === 'hi') {
                await logActivity({
                    timestamp: Date.now(),
                    provider: 'openai',
                    model: model,
                    request: requestPayload,
                    response: data,
                    status: 'success'
                });

                toasts.update(toastId, {
                    message: "Connection Activated! Key is valid and handshake successful.",
                    type: 'success'
                });
                return true;
            } else {
                throw new Error("Handshake failed: Unexpected response format.");
            }
        } catch (e) {
            await logActivity({
                timestamp: Date.now(),
                provider: 'openai',
                model: model,
                request: requestPayload,
                response: data,
                status: 'error'
            });
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

/**
 * Generates tailored content based on prompts and context
 */
export async function generateTailoredContent(
    systemPrompt: string,
    userPrompt: string,
    model: string
) {
    // Fetch key from secure local database instead of cookies
    const settings = await db.settings.get('app');
    const key = settings?.providers.openai.key;

    if (!key) {
        throw new Error("OpenAI API Key not found. Please activate your connection in Settings.");
    }

    const toastId = toasts.add("AI Architect is starting...", "loading");

    try {
        toasts.update(toastId, { message: "Context prepared, contacting AI..." });

        const requestPayload = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error?.message || "Failed to reach OpenAI";
            await logActivity({
                timestamp: Date.now(),
                provider: 'openai',
                model: model,
                request: requestPayload,
                response: data,
                status: 'error'
            });
            throw new Error(errorMsg);
        }

        const content = data.choices[0].message.content;

        await logActivity({
            timestamp: Date.now(),
            provider: 'openai',
            model: model,
            request: requestPayload,
            response: data,
            status: 'success'
        });

        toasts.update(toastId, { message: "Response received! Processing...", type: 'success' });
        return content;
    } catch (error: any) {
        toasts.update(toastId, {
            message: `Architect Error: ${error.message}`,
            type: 'error'
        });
        throw error;
    }
}


