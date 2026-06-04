const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/api/products`);
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
