import { UserProfile } from "@/types/user";

export const getDefaultProfile = (role: 'student' | 'faculty' | 'admin'): UserProfile => {
  const baseProfile = {
    id: '1',
    email: 'user@example.com',
    fullName: 'Demo User',
    role,
    joinedDate: new Date().toISOString(),
  };

  if (role === 'student') {
    return {
      ...baseProfile,
      university: 'Demo University',
      degree: 'Computer Science',
      graduationYear: 2026,
      interests: ['Machine Learning', 'Cloud Computing'],
    };
  } else if (role === 'faculty') {
    return {
      ...baseProfile,
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      yearsOfExperience: 5,
    };
  } else {
    return {
      ...baseProfile,
      adminLevel: 'moderator' as const,
    };
  }
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const loadProfile = (): UserProfile | null => {
  const saved = localStorage.getItem('userProfile');
  return saved ? JSON.parse(saved) : null;
};
