import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Star, StarOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import ImageUpload from "../../components/ui/image-upload";
import ConfirmDialog from "../../components/ui/confirm-dialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("auth_token");

const fetchSlides = async () => {
  const res = await fetch(`${API_BASE_URL}/api/admin/hero`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

const createSlide = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/hero`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create");
  return data;
};

const updateSlide = async (id, payload) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/hero/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update");
  return data;
};

const deleteSlide = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/hero/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
};

const emptyForm = { image: "", title: "", subtitle: "", active: true, order: 0 };

export default function HeroSlidesPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!loading && isAdmin) loadSlides();
  }, [loading, isAdmin]);

  const loadSlides = async () => {
    try {
      const data = await fetchSlides();
      setSlides(data.slides || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoadingSlides(false);
    }
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const handleEdit = (s) => {
    setForm({ image: s.image, title: s.title, subtitle: s.subtitle, active: s.active, order: s.order });
    setEditingId(s._id);
    setShowForm(true);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!form.image) { setMessage({ type: "error", text: "Image is required" }); return; }
    try {
      if (editingId) {
        await updateSlide(editingId, form);
        setMessage({ type: "success", text: "Hero slide updated" });
      } else {
        await createSlide(form);
        setMessage({ type: "success", text: "Hero slide created" });
      }
      resetForm();
      loadSlides();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Operation failed" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlide(id);
      setSlides((prev) => prev.filter((s) => s._id !== id));
      setMessage({ type: "success", text: "Hero slide deleted" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete" });
    } finally {
      setConfirmDelete(null);
    }
  };

  const toggleActive = async (slide) => {
    try {
      await updateSlide(slide._id, { active: !slide.active });
      loadSlides();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
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
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Hero Slides</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage homepage hero images</p>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-1">
              <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add Slide"}
            </Button>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-sm border ${
            message.type === "error"
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-secondary/20 text-secondary-foreground border-secondary/30"
          }`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <Card className="mb-8 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">{editingId ? "Edit Slide" : "New Slide"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <ImageUpload value={form.image} onChange={(val) => setForm({ ...form, image: val })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. CAPTURE" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Subtitle</label>
                    <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Short description" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Order</label>
                    <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-border" />
                      <span className="text-sm text-foreground">Active</span>
                    </label>
                  </div>
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
            <CardTitle className="text-foreground">All Slides ({slides.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSlides ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-border border-t-primary" />
              </div>
            ) : slides.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No slides yet. Add one above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Image</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subtitle</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Active</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map((s) => (
                      <tr key={s._id} className="border-b border-border transition-colors hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <img src={s.image} alt="" className="h-12 w-20 rounded-md object-cover" />
                        </td>
                        <td className="py-3 px-4 text-foreground font-medium">{s.title || "—"}</td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">{s.subtitle || "—"}</td>
                        <td className="py-3 px-4 text-muted-foreground">{s.order}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => toggleActive(s)} className="text-muted-foreground hover:text-foreground transition-colors">
                            {s.active ? <Star className="h-4 w-4 text-primary" /> : <StarOff className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-xs" onClick={() => handleEdit(s)} className="text-muted-foreground hover:text-primary">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-xs" onClick={() => setConfirmDelete(s)} className="text-muted-foreground hover:text-destructive">
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
          title="Delete Slide"
          message={`Delete this hero slide?`}
          onConfirm={() => handleDelete(confirmDelete._id)}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    </Layout>
  );
}
