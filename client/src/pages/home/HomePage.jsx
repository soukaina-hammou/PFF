import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProducts } from "../../api/products";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const featuredProducts = [
  { name: "Wireless Headphones", price: 129.99, rating: 4.8, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" },
  { name: "Minimal Watch", price: 249.99, rating: 4.6, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" },
  { name: "Leather Backpack", price: 89.99, rating: 4.7, category: "Fashion", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80" },
  { name: "Smart Speaker", price: 199.99, rating: 4.5, category: "Electronics", image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=300&q=80" },
  { name: "Sunglasses", price: 159.99, rating: 4.4, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80" },
  { name: "Canvas Sneakers", price: 74.99, rating: 4.9, category: "Fashion", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80" },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(featuredProducts);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(75,86,148,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(114,136,174,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              <TrendingUp className="mr-1 h-3 w-3" />
              Premium Collection 2026
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Discover Products You'll
              <span className="text-primary"> Love</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Curated selection of premium products. Quality meets design in every item we offer.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" className="gap-2">
                Shop Now
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Products", value: "500+", desc: "Curated items" },
              { label: "Customers", value: "10K+", desc: "Happy shoppers" },
              { label: "Rating", value: "4.8", desc: "Average review" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Featured Products</h2>
              <p className="mt-1 text-sm text-muted-foreground">Handpicked just for you</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, idx) => (
              <Card key={idx} className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <Badge variant="secondary" className="absolute left-3 top-3">
                    {product.category}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-8 sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Join Our Community
              </h2>
              <p className="mt-3 text-muted-foreground">
                Be the first to know about new arrivals, exclusive deals, and more.
              </p>
              <div className="mt-6 flex max-w-md mx-auto gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
