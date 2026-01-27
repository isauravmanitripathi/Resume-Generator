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

    function add(message: string, type: ToastType = 'info', duration = 3000) {
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
    }

    return {
        subscribe,
        add,
        remove,
        update: updateToast
    };
}

export const toasts = createToastStore();
