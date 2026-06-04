const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHeroSlides = async () => {
  const res = await fetch(`${API_BASE_URL}/api/hero`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch hero slides");
  return data;
};
