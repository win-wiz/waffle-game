interface HintData {
  date: string;
  count: number;
}

const HINT_STORAGE_KEY = 'waffleHintData';

export const hintStorage = {
  get(): HintData | null {
    try {
      const data = localStorage.getItem(HINT_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set(data: HintData): void {
    try {
      localStorage.setItem(HINT_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Handle storage errors gracefully
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(HINT_STORAGE_KEY);
    } catch {
      // Handle storage errors gracefully
    }
  }
};

export type { HintData };
