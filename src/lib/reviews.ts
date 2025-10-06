import { Review } from "@/types/certification";

const KEY_PREFIX = "cert_reviews_";

export const loadReviews = (certId: string): Review[] => {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + certId);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveReviews = (certId: string, reviews: Review[]) => {
  localStorage.setItem(KEY_PREFIX + certId, JSON.stringify(reviews));
};

export const computeAggregate = (reviews: Review[]) => {
  if (!reviews || reviews.length === 0) return { rating: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { rating: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
};
