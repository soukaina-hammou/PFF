import { useState } from "react";
import { Settings, User, Shield, Save, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ImageUpload from "../../components/ui/image-upload";
import { updateProfile } from "../../api/auth";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const startEditing = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setMessage({ type: "", text: "" });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (form.newPassword && form.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name: form.name, email: form.email, image: form.image };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const data = await updateProfile(payload);
      setUser(data.user);
      setMessage({ type: "success", text: "Profile updated successfully" });
      setEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your account settings</p>
          </div>
          {!editing && (
            <Button variant="outline" size="sm" onClick={startEditing} className="gap-1">
              <Settings className="h-4 w-4" /> Edit Profile
            </Button>
          )}
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

        {editing ? (
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-base">Edit Profile</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <ImageUpload
                  value={form.image}
                  onChange={(val) => setForm((prev) => ({ ...prev, image: val }))}
                />

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Change Password (optional)</p>

                  <div className="space-y-3">
                    <div className="relative">
                      <label className="text-sm font-medium text-foreground mb-1 block">Current Password</label>
                      <Input
                        name="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        value={form.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm font-medium text-foreground mb-1 block">New Password</label>
                      <Input
                        name="newPassword"
                        type={showPasswords ? "text" : "password"}
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm font-medium text-foreground mb-1 block">Confirm New Password</label>
                      <Input
                        name="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat new password"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showPasswords ? "Hide" : "Show"} passwords
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={submitting} className="gap-1">
                    <Save className="h-4 w-4" /> {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEditing} className="gap-1">
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-base">Profile</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start mb-4">
                {user?.image ? (
                  <img src={user.image} alt="" className="h-20 w-20 rounded-full object-cover border-2 border-border" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted border-2 border-border">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-base">Account</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Account information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
