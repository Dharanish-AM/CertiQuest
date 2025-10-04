import { Certification } from "@/types/certification";
import { mockCertifications } from "@/data/mockCertifications";

const KEY = "pq_certs_added";

export const loadCerts = (): Certification[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const added: Certification[] = raw ? JSON.parse(raw) : [];
    // combine built-in mocks with added ones (added should come first)
    return [...added, ...mockCertifications];
  } catch (e) {
    return [...mockCertifications];
  }
};

export const saveAddedCerts = (certs: Certification[]) => {
  localStorage.setItem(KEY, JSON.stringify(certs));
};

export const addCert = (cert: Certification) => {
  const raw = localStorage.getItem(KEY);
  const added: Certification[] = raw ? JSON.parse(raw) : [];
  added.unshift(cert);
  saveAddedCerts(added);
};

export const removeAddedCert = (id: string) => {
  const raw = localStorage.getItem(KEY);
  const added: Certification[] = raw ? JSON.parse(raw) : [];
  const filtered = added.filter((c) => c.id !== id);
  saveAddedCerts(filtered);
};

export const removeCert = (id: string) => {
  const raw = localStorage.getItem(KEY);
  const added: Certification[] = raw ? JSON.parse(raw) : [];
  const filtered = added.filter((c) => c.id !== id);
  saveAddedCerts(filtered);
};