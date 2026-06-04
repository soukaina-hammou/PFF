import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight, Send, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { getHeroSlides } from "../../api/hero";
import { getProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";

const sponsors = [
  "NIKON", "CANON", "SONY", "FUJIFILM", "LEICA", "HASSELBLAD", "POLAROID", "KODAK",
  "NIKON", "CANON", "SONY", "FUJIFILM", "LEICA", "HASSELBLAD", "POLAROID", "KODAK",
];

const firstImage = (p) => {
  if (p.images && p.images.length > 0) return p.images[0];
  if (p.image) return p.image;
  return null;
};

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart, setCartOpen } = useCart();
  const [slides, setSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    getHeroSlides()
      .then((data) => setSlides(data.slides || []))
      .catch(() => {});
    getProducts({ page: 1, limit: 3 })
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const activeSlides = slides.filter((s) => s.active);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setCartOpen(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="bg-sage min-h-screen">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {activeSlides.length > 0 ? (
          <>
            {activeSlides.map((slide, i) => (
              <div
                key={slide._id}
                className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
              >
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-dark/30" />
              </div>
            ))}
            {activeSlides.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {activeSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-lime" : "w-2 bg-white/50 hover:bg-white/80"}`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-none drop-shadow-lg">
                {activeSlides[currentSlide]?.title || "CAPTURE"}
              </h1>
              {activeSlides[currentSlide]?.subtitle && (
                <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl mx-auto drop-shadow">
                  {activeSlides[currentSlide].subtitle}
                </p>
              )}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gap-2 bg-lime text-dark hover:brightness-110" onClick={() => navigate("/products")}>
                  <Camera className="h-5 w-5" /> Shop Now
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/about")}>
                  Learn More
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-dark to-dark/80" />
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-none drop-shadow-lg">
                CAPTURE
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl mx-auto">
                A STYLISH JOURNEY TOWARD A VERDANT TOMORROW
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gap-2 bg-lime text-dark hover:brightness-110" onClick={() => navigate("/products")}>
                  <Camera className="h-5 w-5" /> Shop Now
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/about")}>
                  Learn More
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ─── Featured Products ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark">Featured Products</h2>
              <p className="mt-1 text-sm text-dark/60">Handpicked just for you</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-dark/70 hover:text-dark" onClick={() => navigate("/products")}>
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-dark/5 animate-pulse h-80" />
              ))
            ) : (
              products.map((product) => {
                const img = firstImage(product);
                return (
                  <Card
                    key={product._id}
                    className="group overflow-hidden border-0 bg-white/60 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-dark/5 cursor-pointer"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-dark/5">
                      {img ? (
                        <img src={img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-dark/20"><Camera className="h-12 w-12" /></div>
                      )}
                      <Badge variant="secondary" className="absolute left-3 top-3 bg-white/80 text-dark border-0">{product.category}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-base font-semibold text-dark">{product.name}</h3>
                      <p className="mt-1 text-xs text-dark/50 line-clamp-2">{product.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-dark">${product.price.toFixed(2)}</span>
                        <Button size="sm" className="gap-1 bg-lime text-dark hover:brightness-110" onClick={(e) => handleAddToCart(product, e)}>
                          <ShoppingCart className="h-3.5 w-3.5" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ─── Sponsors Marquee ─── */}
      <section className="py-16 border-y border-dark/10 bg-dark/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-sm font-medium text-dark/40 tracking-widest uppercase">Trusted by leading brands</p>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {sponsors.map((name, i) => (
              <div key={i} className="flex items-center gap-3 text-dark/30 font-bold text-lg tracking-widest">
                <Camera className="w-5 h-5" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact & CTA ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-dark/5 backdrop-blur-sm border border-dark/10 p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight">
                  Get in <span className="text-lime">Touch</span>
                </h2>
                <p className="mt-4 text-dark/60 leading-relaxed max-w-md">
                  Have a question or want to collaborate? We'd love to hear from you.
                  Send us a message and we'll respond as soon as possible.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/20">
                      <Camera className="w-5 h-5 text-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">Email</p>
                      <p className="text-sm text-dark/50">hello@aurastore.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="w-full rounded-xl border border-dark/20 bg-white/60 px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:border-lime focus:ring-2 focus:ring-lime/30 transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="w-full rounded-xl border border-dark/20 bg-white/60 px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:border-lime focus:ring-2 focus:ring-lime/30 transition-all"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Your message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    className="w-full rounded-xl border border-dark/20 bg-white/60 px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:border-lime focus:ring-2 focus:ring-lime/30 transition-all resize-none"
                  />
                  <Button type="submit" className="w-full gap-2 bg-lime text-dark hover:brightness-110" size="lg">
                    <Send className="h-4 w-4" /> {contactSent ? "Message Sent!" : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
