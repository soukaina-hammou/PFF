const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getProducts = async ({ page = 1, limit = 12 } = {}) => {
  const res = await fetch(`${API_BASE_URL}/api/products?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch products");
  return data;
};

export const getProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch product");
  return data;
};
