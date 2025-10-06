export interface FlaggedItem {
  id: string;
  certId?: string;
  reason: string;
  reportedBy?: string;
  createdAt: string;
}

const KEY = "pq_flags";

export const loadFlags = (): FlaggedItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveFlags = (flags: FlaggedItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(flags));
};

export const addFlag = (flag: FlaggedItem) => {
  const flags = loadFlags();
  flags.unshift(flag);
  saveFlags(flags);
};

export const clearFlag = (id: string) => {
  const flags = loadFlags();
  saveFlags(flags.filter((f) => f.id !== id));
};
