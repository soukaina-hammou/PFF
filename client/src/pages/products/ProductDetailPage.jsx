import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package, Minus, Plus, Star } from "lucide-react";
import { getProduct } from "../../api/products";
import { useCart } from "../../context/CartContext";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartOpen, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError("");
    getProduct(id)
      .then((data) => {
        if (!data.product) {
          setError("Product not found");
        } else {
          setProduct(data.product);
        }
      })
      .catch((err) => setError(err.message || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const cartItem = cartItems.find((item) => item._id === id);
  const inCartCount = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setCartOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">{error || "Product not found"}</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/products")}
          className="mb-6 gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Button>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="h-20 w-20" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit mb-4">
              {product.category}
            </Badge>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Badge
                variant={product.countInStock > 0 ? "success" : "destructive"}
                className="text-sm"
              >
                {product.countInStock > 0
                  ? `${product.countInStock} in stock`
                  : "Out of stock"}
              </Badge>
            </div>

            {inCartCount > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {inCartCount} item{inCartCount > 1 ? "s" : ""} in cart
              </p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.countInStock === 0}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-muted rounded-l-lg transition-colors disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.countInStock === 0}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-muted rounded-r-lg transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="gap-2 flex-1 sm:flex-none"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Category</span>
                  <p className="font-medium text-foreground mt-0.5">{product.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price</span>
                  <p className="font-medium text-foreground mt-0.5">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
