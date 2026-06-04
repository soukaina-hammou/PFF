import { Link } from "react-router-dom";
import { Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-sage/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-dark" />
              <span className="text-sm font-semibold text-dark">Aura</span>
            </div>
            <p className="mt-3 text-xs text-dark/60 leading-relaxed">
              A stylish journey toward a verdant tomorrow. Crafted with care and eco-conscious.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-dark mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                About
              </Link>
              <Link to="/products" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                Products
              </Link>
              <Link to="/categories" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                Categories
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-dark mb-3">Support</h4>
            <div className="space-y-2">
              <p className="text-xs text-dark/60">Contact Us</p>
              <p className="text-xs text-dark/60">FAQ</p>
              <p className="text-xs text-dark/60">Shipping Info</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-dark mb-3">Account</h4>
            <div className="space-y-2">
              <Link to="/auth" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                Sign In
              </Link>
              <Link to="/settings" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                Settings
              </Link>
              <Link to="/checkout" className="block text-xs text-dark/60 hover:text-dark transition-colors">
                Checkout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-dark/10 pt-6 text-center">
          <p className="text-xs text-dark/50">
            &copy; {new Date().getFullYear()} Aura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
