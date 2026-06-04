import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/admin";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import ConfirmDialog from "../../components/ui/confirm-dialog";

export default function CategoriesPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!loading && isAdmin) {
      loadCategories();
    }
  }, [loading, isAdmin]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to load categories" });
    } finally {
      setLoadingCategories(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat._id);
    setShowForm(true);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" });
      return;
    }
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setMessage({ type: "success", text: "Category updated" });
      } else {
        await createCategory(form);
        setMessage({ type: "success", text: "Category created" });
      }
      resetForm();
      loadCategories();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Operation failed" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setMessage({ type: "success", text: "Category deleted" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete category" });
    } finally {
      setConfirmDelete(null);
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
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Manage Categories</h1>
              <p className="mt-1 text-sm text-muted-foreground">Create and manage product categories</p>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-1">
              <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add Category"}
            </Button>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-sm border ${
              message.type === "error"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-secondary/20 text-secondary-foreground border-secondary/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {showForm && (
          <Card className="mb-8 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">{editingId ? "Edit Category" : "New Category"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Category name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">{editingId ? "Update" : "Create"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCategories ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-border border-t-primary" />
              </div>
            ) : categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No categories yet. Add one above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-b border-border transition-colors hover:bg-muted/50">
                        <td className="py-3 px-4 text-foreground font-medium">{cat.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{cat.description || "—"}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-xs" onClick={() => handleEdit(cat)} className="text-muted-foreground hover:text-primary">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-xs" onClick={() => setConfirmDelete(cat)} className="text-muted-foreground hover:text-destructive">
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

        <ConfirmDialog
          open={!!confirmDelete}
          title="Delete Category"
          message={`Are you sure you want to delete "${confirmDelete?.name}"?`}
          onConfirm={() => handleDelete(confirmDelete._id)}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    </Layout>
  );
}
