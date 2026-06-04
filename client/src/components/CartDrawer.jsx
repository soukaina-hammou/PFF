import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Sheet, SheetHeader, SheetTitle, SheetClose, SheetContent, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";

export default function CartDrawer({ open, onClose, items, onRemove, onUpdateQuantity }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onClose={onClose}>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <SheetTitle>Cart ({items.length})</SheetTitle>
        </div>
        <SheetClose onClose={onClose} />
      </SheetHeader>

      <SheetContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground text-xs font-medium">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(item._id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item._id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item._id)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>

      {items.length > 0 && (
        <SheetFooter>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-lg font-semibold text-foreground">${total.toFixed(2)}</span>
          </div>
          <Button className="mt-3 w-full">Checkout</Button>
        </SheetFooter>
      )}
    </Sheet>
  );
}
