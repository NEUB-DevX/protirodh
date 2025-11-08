import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProtirodhState {
    savedMessages: any[];
    saveMessages: (messages: any[]) => void;
}

export const useProtirodhStore = create<ProtirodhState>()(
    persist(
        (set) => ({
            savedMessages: [],
            saveMessages: (messages) => set({ savedMessages: messages }),
        }),
        {
            name: 'protirodh-ai-messages', // 🧠 key for localStorage
        }
    )
);