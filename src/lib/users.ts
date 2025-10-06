import { UserProfile } from "@/types/user";

const KEY = "pq_users";

export const loadUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveUsers = (users: UserProfile[]) => {
  localStorage.setItem(KEY, JSON.stringify(users));
};

export const addUser = (user: UserProfile) => {
  const users = loadUsers();
  users.unshift(user);
  saveUsers(users);
};

export const removeUser = (id: string) => {
  const users = loadUsers();
  saveUsers(users.filter((u) => u.id !== id));
};
