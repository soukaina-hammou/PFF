import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, ShoppingCart, User, Settings, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, cartOpen, setCartOpen, cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-sage/90 backdrop-blur-sm border-b border-dark/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-dark">
            <Camera className="w-6 h-6" />
            <span className="font-bold text-xl">Aura</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-dark/70 hover:text-dark transition-colors">HOME</Link>
            <Link to="/about" className="text-dark/70 hover:text-dark transition-colors">ABOUT</Link>
            <Link to="/products" className="text-dark/70 hover:text-dark transition-colors">PRODUCT</Link>
            <Link to="/categories" className="text-dark/70 hover:text-dark transition-colors">CATEGORIES</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-dark/70 hover:text-dark hover:bg-dark/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4.5 h-4.5 rounded-full bg-lime text-dark text-[10px] font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg hover:bg-dark/10 transition-colors px-2 py-1.5"
                >
                  {user.image ? (
                    <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover border border-dark/20" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-dark/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-dark" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-dark hidden sm:block">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-dark/50" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-dark/10 bg-white shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-dark/10 mb-1">
                        <p className="text-sm font-medium text-dark truncate">{user.name}</p>
                        <p className="text-xs text-dark/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:text-dark hover:bg-dark/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:text-dark hover:bg-dark/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:text-dark hover:bg-dark/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-lime text-dark font-bold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </>
  );
}
