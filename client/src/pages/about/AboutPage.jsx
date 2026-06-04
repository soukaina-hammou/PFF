import { Shield, Truck, Headphones, CreditCard } from "lucide-react";
import Layout from "../../components/Layout";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "Free shipping on all orders over $50" },
  { icon: Shield, title: "Secure Payment", desc: "100% secure payment with encryption" },
  { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock customer support" },
  { icon: CreditCard, title: "Easy Returns", desc: "30-day hassle-free return policy" },
];

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(75,86,148,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About <span className="text-primary">PFF</span>
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            We're on a mission to make premium products accessible to everyone.
            Quality, design, and customer satisfaction are at the heart of everything we do.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our Story</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, PFF started with a simple idea: create a curated
                  marketplace where quality meets design. We partner with independent
                  makers and established brands to bring you products that stand out.
                </p>
                <p>
                  Every item in our collection is carefully selected for its design,
                  durability, and value. We believe that the things you own should
                  bring joy and functionality to your daily life.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { value: "500+", label: "Products" },
                  { value: "10K+", label: "Customers" },
                  { value: "50+", label: "Brands" },
                  { value: "98%", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-muted/50 p-4">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Why Choose Us</h2>
            <p className="mt-2 text-muted-foreground">We go the extra mile for our customers</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/50">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
