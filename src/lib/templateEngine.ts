/**
 * Simple Svelte-like Template Engine for Runtime Rendering
 * Supports:
 * - Variable Interpolation: {profile.basics.name}
 * - Each Loops: {#each profile.experience as item} ... {/each}
 */

export function renderTemplate(template: string, data: any): string {
    if (!template) return '';

    // 1. Extract and Execute Scripts
    // We look for <script>...</script> blocks
    // The script can modify `profile` or add new variables to the data context

    let processedData = { ...data }; // Clone to avoid side effects on original if possible (shallow)
    // Deep clone profile to allow safe mutation
    if (processedData.profile) {
        processedData.profile = JSON.parse(JSON.stringify(processedData.profile));
    }

    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let scriptContent = '';

    // Remove scripts from template but save content
    const cleanTemplate = template.replace(scriptRegex, (match, content) => {
        scriptContent += content + '\n';
        return ''; // Remove script tag from output
    });

    if (scriptContent) {
        try {
            // Create a function that takes 'profile' and returns it (or modifies it)
            // We expose 'profile' to the script scope
            const userScript = new Function('profile', `
        ${scriptContent}
        return profile;
      `);

            // Execute user script
            const modifiedProfile = userScript(processedData.profile);

            // Update our data context with the modified profile
            if (modifiedProfile) {
                processedData.profile = modifiedProfile;
            }
        } catch (err: any) {
            console.error("Template Script Error:", err);
            return `<div class="text-red-500 font-bold p-4 border border-red-500">Script Error: ${err?.message || String(err)}</div>` + cleanTemplate;
        }
    }

    let result = cleanTemplate;

    // 2. Handle {#each} blocks (using the processed data)
    // Regex looks for: {#each ARRAY_PATH as ALIAS} CONTENT {/each}
    const eachRegex = /{#each\s+([a-zA-Z0-9_.]+)\s+as\s+([a-zA-Z0-9_]+)\}([\s\S]*?){\/each}/g;

    result = result.replace(eachRegex, (match, arrayPath, alias, content) => {
        const arrayData = getNestedValue(processedData, arrayPath);

        if (!Array.isArray(arrayData)) {
            console.warn(`Template Warning: ${arrayPath} is not an array.`);
            return '';
        }

        return arrayData.map(item => {
            // Create a context for this item
            // We replace {alias.field} with the actual value
            return renderContentWithContext(content, item, alias, processedData);
        }).join('');
    });

    // 3. Handle global variables {profile.basics.name}
    result = resolveVariables(result, processedData);

    return result;
}

function renderContentWithContext(content: string, itemData: any, alias: string, globalData: any): string {
    // Replace {alias.field}
    // AND also support {global.field} inside the loop

    return content.replace(/{([a-zA-Z0-9_.]+)}/g, (match, path) => {
        // Check if it starts with the alias (e.g. "exp.role")
        if (path.startsWith(alias + '.')) {
            const fieldPath = path.slice(alias.length + 1); // "role"
            const val = getNestedValue(itemData, fieldPath);
            return val !== undefined ? String(val) : '';
        }
        // Otherwise check global scope (e.g. "profile.basics.name")
        else {
            const val = getNestedValue(globalData, path);
            // If found in global, return it. If not, return empty string (or keep match?)
            // For now, let's return empty if not found, to clean up output
            return val !== undefined ? String(val) : '';
        }
    });
}

function resolveVariables(text: string, data: any): string {
    return text.replace(/{([a-zA-Z0-9_.]+)}/g, (match, path) => {
        const val = getNestedValue(data, path);
        return val !== undefined ? String(val) : '';
    });
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : undefined;
    }, obj);
}
