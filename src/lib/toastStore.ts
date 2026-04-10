import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'error' | 'loading';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    function add(message: string, type: ToastType = 'info', duration = 4500) {
        const id = Math.random().toString(36).substring(2, 9);
        update(all => [{ id, message, type, duration }, ...all]);

        if (type !== 'loading') {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
        return id;
    }

    function remove(id: string) {
        update(all => all.filter(t => t.id !== id));
    }

    function updateToast(id: string, updates: Partial<Toast>) {
        update(all => all.map(t => t.id === id ? { ...t, ...updates } : t));
        // When a loading toast transitions to a resolved state, start auto-dismiss
        if (updates.type && updates.type !== 'loading') {
            const duration = updates.duration ?? 4500;
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    }

    return {
        subscribe,
        add,
        remove,
        update: updateToast
    };
}

export const toasts = createToastStore();
