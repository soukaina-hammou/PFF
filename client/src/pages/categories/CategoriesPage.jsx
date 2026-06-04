import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tags, Package } from "lucide-react";
import { getCategories } from "../../api/categories";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Categories</h1>
          <p className="mt-1 text-muted-foreground">Browse products by category</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Tags className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No categories available</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Card
                key={cat._id}
                className="border-border bg-card cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Tags className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-base">{cat.name}</CardTitle>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    Browse Products &rarr;
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
