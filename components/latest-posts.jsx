"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [{ db }, { collection, getDocs, query, orderBy, limit }] = await Promise.all([
          import("@/lib/firebase"),
          import("firebase/firestore"),
        ]);

        // Buscamos los últimos 3 artículos en la colección "blog" ordenados por fecha de creación
        const q = query(collection(db, "blog"), orderBy("createdAt", "desc"), limit(3));
        const snapshot = await getDocs(q);
        
        const postsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(postsList);
      } catch (error) {
        console.error("Error al cargar el blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Si está cargando o no hay artículos publicados todavía, ocultamos la sección
  if (isLoading || posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Últimos Artículos</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Estrategias, liderazgo y ventas para potenciar tu negocio.
          </p>
        </div>
        <Button variant="ghost" className="hover:bg-transparent hover:text-primary group" asChild>
          <Link href="/blog">
            Ver el blog completo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full bg-muted">
              {post.image ? (
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full w-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
                  Sin imagen
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                {post.category || "Ventas"}
              </div>
              <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug || post.id}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {post.excerpt || post.description || "Haz clic para leer el artículo completo y descubrir más sobre este tema."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
