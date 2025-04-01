import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(6);  // Limit to 6 featured products for homepage
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <>
      <Head>
        <title>ElectroMart - Home of Electronics</title>
        <meta name="description" content="Find the best electronics at affordable prices" />
      </Head>
      <Header />
      <main className="container mx-auto p-4 min-h-screen">
        <h1 className="text-3xl font-bold text-center my-8">Welcome to ElectroMart</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image} 
                />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}