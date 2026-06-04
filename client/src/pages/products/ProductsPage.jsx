import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Package } from "lucide-react";
import { getProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const firstImage = (p) => {
  if (p.images && p.images.length > 0) return p.images[0];
  if (p.image) return p.image;
  return null;
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, setCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("category") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    setLoading(true);
    getProducts({ page, limit: 12 })
      .then((data) => {
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSearch(category);
      setActiveCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = { page: String(page) };
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params);
  }, [page, activeCategory, setSearchParams]);

  const goToPage = (p) => {
    if (p >= 1 && p <= pages) setPage(p);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setCartOpen(true);
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Products</h1>
          <p className="mt-1 text-muted-foreground">{total} products available</p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveCategory(""); }}
            className="max-w-md"
          />
          {activeCategory && (
            <Badge variant="secondary" className="gap-1 text-sm px-3 py-1.5">
              <Package className="h-3.5 w-3.5" />
              {activeCategory}
              <button onClick={() => { setSearch(""); setActiveCategory(""); }} className="ml-1 hover:text-foreground">&times;</button>
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {firstImage(product) ? (
                      <img
                        src={firstImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Package className="h-12 w-12" />
                      </div>
                    )}
                    <Badge variant="secondary" className="absolute left-3 top-3">
                      {product.category}
                    </Badge>
                    {product.countInStock === 0 && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.countInStock === 0}
                        className="gap-1"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && !search && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            {pageNumbers.map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(p)}
                className="min-w-9"
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= pages}
              className="gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
