import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "../../api/admin";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const emptyProduct = { name: "", description: "", price: "", image: "", category: "", countInStock: "" };

export default function ProductsPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!loading && isAdmin) {
      loadProducts();
    }
  }, [loading, isAdmin]);

  const loadProducts = async () => {
    try {
      const data = await getAdminProducts();
      setProducts(data.products || []);
    } catch {
      /* ignore */
    } finally {
      setLoadingProducts(false);
    }
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image || "",
      category: product.category,
      countInStock: String(product.countInStock),
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      resetForm();
      loadProducts();
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      /* ignore */
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4 gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Manage Products</h1>
              <p className="mt-1 text-sm text-muted-foreground">Add, edit and remove products</p>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-1">
              <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add Product"}
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">{editingId ? "Edit Product" : "New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Price ($)</label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Stock</label>
                  <Input type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">Image URL</label>
                  <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 resize-none"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <Button type="submit">{editingId ? "Update" : "Create"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-border border-t-primary" />
              </div>
            ) : products.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No products yet. Add one above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b border-border transition-colors hover:bg-muted/50">
                        <td className="py-3 px-4 text-foreground font-medium">{p.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{p.category}</Badge>
                        </td>
                        <td className="py-3 px-4 text-foreground">${p.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={p.countInStock > 0 ? "success" : "destructive"}>
                            {p.countInStock > 0 ? `${p.countInStock} in stock` : "Out of stock"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-xs" onClick={() => handleEdit(p)} className="text-muted-foreground hover:text-primary">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(p._id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
