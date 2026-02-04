import { promptDb } from '$lib/promptDb';
import { toasts } from '$lib/toastStore';
import { logActivity } from '$lib/activityDb';
import { db } from '$lib/db';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface OpenRouterModel {
    id: string;
    name: string;
    description?: string;
    context_length?: number;
    pricing?: {
        prompt: string;
        completion: string;
    };
}

/**
 * Fetches the list of available models from OpenRouter
 */
export async function fetchOpenRouterModels(key: string): Promise<OpenRouterModel[]> {
    const toastId = toasts.add("Fetching available models...", "loading");

    try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Resume Architect'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch models");
        }

        // Transform and sort models by name
        const models: OpenRouterModel[] = data.data
            .map((m: any) => ({
                id: m.id,
                name: m.name || m.id,
                description: m.description,
                context_length: m.context_length,
                pricing: m.pricing
            }))
            .sort((a: OpenRouterModel, b: OpenRouterModel) => a.name.localeCompare(b.name));

        toasts.update(toastId, {
            message: `Found ${models.length} models`,
            type: 'success'
        });

        return models;
    } catch (error: any) {
        toasts.update(toastId, {
            message: `Failed to fetch models: ${error.message}`,
            type: 'error'
        });
        return [];
    }
}

/**
 * Validates OpenRouter Key and Connection
 */
export async function validateOpenRouterAndActivate(key: string, model: string) {
    const toastId = toasts.add("Initializing OpenRouter Activation...", "loading");

    try {
        // 1. Fetch the "Hello JSON" prompt
        toasts.update(toastId, { message: "Fetching verification prompt..." });
        const prompt = await promptDb.prompts.get('hello-json');
        if (!prompt) {
            throw new Error("Activation prompt not found in database.");
        }

        // 2. Prepare OpenRouter Request
        toasts.update(toastId, { message: `Connecting to OpenRouter (${model})...` });

        const requestPayload = {
            model: model,
            messages: [
                { role: 'system', content: prompt.systemPrompt },
                { role: 'user', content: prompt.userPromptTemplate }
            ]
        };

        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Resume Architect'
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error?.message || "Failed to connect to OpenRouter";
            await logActivity({
                timestamp: Date.now(),
                provider: 'openrouter',
                model: model,
                request: requestPayload,
                response: data,
                status: 'error'
            });
            throw new Error(errorMsg);
        }

        // 3. Validate Response - be lenient with parsing
        toasts.update(toastId, { message: "Verifying hand-shake response..." });
        let content = data.choices[0].message.content;

        try {
            // Try to extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                content.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
                content = jsonMatch[1].trim();
            }

            const parsed = JSON.parse(content);
            // Be lenient - check if greetings is "hi" or "hit" (common typo)
            if (parsed.greetings === 'hi' || parsed.greetings === 'hit') {
                await logActivity({
                    timestamp: Date.now(),
                    provider: 'openrouter',
                    model: model,
                    request: requestPayload,
                    response: data,
                    status: 'success'
                });

                toasts.update(toastId, {
                    message: "OpenRouter Activated! Connection successful.",
                    type: 'success'
                });
                return true;
            } else {
                throw new Error("Handshake failed: Unexpected response format.");
            }
        } catch (e) {
            await logActivity({
                timestamp: Date.now(),
                provider: 'openrouter',
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
            message: `OpenRouter Activation Failed: ${error.message}`,
            type: 'error'
        });
        return false;
    }
}

/**
 * Generates tailored content using OpenRouter
 */
export async function generateOpenRouterContent(
    systemPrompt: string,
    userPrompt: string,
    model: string
) {
    // Fetch key from local database
    const settings = await db.settings.get('app');
    const key = settings?.providers.openrouter.key;

    if (!key) {
        throw new Error("OpenRouter API Key not found. Please activate your connection in Settings.");
    }

    const toastId = toasts.add("AI Architect is starting...", "loading");

    try {
        toasts.update(toastId, { message: "Contacting OpenRouter AI..." });

        const requestPayload = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        };

        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Resume Architect'
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error?.message || "Failed to reach OpenRouter";
            await logActivity({
                timestamp: Date.now(),
                provider: 'openrouter',
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
            provider: 'openrouter',
            model: model,
            request: requestPayload,
            response: data,
            status: 'success'
        });

        toasts.update(toastId, { message: "Response received! Processing...", type: 'success' });
        return content;
    } catch (error: any) {
        toasts.update(toastId, {
            message: `OpenRouter Error: ${error.message}`,
            type: 'error'
        });
        throw error;
    }
}
