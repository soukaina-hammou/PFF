import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Trash2, Minus, Plus, MessageCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const WHATSAPP_NUMBER = "212624725234";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const buildWhatsAppMessage = () => {
    const lines = ["*New Order - PFF Store*", ""];
    cartItems.forEach((item, i) => {
      lines.push(
        `${i + 1}. ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`,
      );
    });
    lines.push("");
    lines.push(`*Total: $${total.toFixed(2)}*`);
    lines.push("");
    lines.push(`*Customer:* ${user?.name || "Guest"}`);
    lines.push(`*Email:* ${user?.email || "N/A"}`);
    return encodeURIComponent(lines.join("\n"));
  };

  const handleCheckout = () => {
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    clearCart();
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/products")}>Browse Products</Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Cart Items ({cartItems.length})</h2>
              {cartItems.map((item) => (
                <Card key={item._id} className="border-border bg-card">
                  <CardContent className="p-4 flex gap-4">
                    <div className="h-20 w-20 shrink-0 rounded-lg border border-border bg-muted overflow-hidden">
                      {item.images?.[0] || item.image ? (
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ${item.price.toFixed(2)} each
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="border-border bg-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between text-muted-foreground">
                        <span className="truncate max-w-[200px]">
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-base font-semibold text-foreground">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full gap-2 mt-2"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Complete Order via WhatsApp
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    You'll be redirected to WhatsApp to confirm your order
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
