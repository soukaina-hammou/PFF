import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                P
              </div>
              <span className="text-sm font-semibold text-foreground">PFF</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Premium e-commerce platform offering curated products with seamless shopping experience.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-xs text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
              <Link to="/about" className="block text-xs text-muted-foreground transition-colors hover:text-foreground">
                About
              </Link>
              <Link to="/auth" className="block text-xs text-muted-foreground transition-colors hover:text-foreground">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Contact Us</p>
              <p className="text-xs text-muted-foreground">FAQ</p>
              <p className="text-xs text-muted-foreground">Shipping Info</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Privacy Policy</p>
              <p className="text-xs text-muted-foreground">Terms of Service</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PFF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
