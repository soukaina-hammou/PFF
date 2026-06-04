import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ImageUpload from "../../components/ui/image-upload";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signin, signup } = useAuth();
  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (mode === "signup") {
      if (!formData.name.trim()) return "Name is required";
      if (formData.password.length < 6) return "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    } else {
      if (!formData.email) return "Email is required";
      if (!formData.password) return "Password is required";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: formData.image,
        });
      } else {
        await signin({ email: formData.email, password: formData.password });
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
    setError("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(75,86,148,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(114,136,174,0.08),transparent_50%)]" />

        <div className="relative w-full max-w-5xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden grid md:grid-cols-2">
          <div className="relative hidden md:block overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
            {mode === "signin" ? (
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80"
                alt="Login"
                className="h-full w-full object-cover opacity-80"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80"
                alt="Sign Up"
                className="h-full w-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary mb-4">
                <span className="text-lg font-bold text-primary-foreground">P</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {mode === "signin" ? "Welcome Back!" : "Join Us Today!"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to access your account and continue shopping."
                  : "Create an account and start exploring premium products."}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-sm">
              <div className="mb-6 text-center md:text-left">
                <div className="mx-auto md:mx-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary mb-3 md:hidden">
                  <span className="text-lg font-bold text-primary-foreground">P</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mode === "signin"
                    ? "Enter your credentials to continue"
                    : "Fill in the details to get started"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <ImageUpload
                    value={formData.image}
                    onChange={(val) => setFormData((prev) => ({ ...prev, image: val }))}
                  />
                )}

                {mode === "signup" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                    <Input
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Password {mode === "signup" && <span className="text-muted-foreground font-normal">(min. 6 characters)</span>}
                  </label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Confirm Password</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2" disabled={submitting} size="lg">
                  {mode === "signin" ? (
                    <><LogIn className="h-4 w-4" /> Sign In</>
                  ) : (
                    <><UserPlus className="h-4 w-4" /> Create Account</>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button onClick={switchMode} className="font-medium text-primary hover:underline">
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button onClick={switchMode} className="font-medium text-primary hover:underline">
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
