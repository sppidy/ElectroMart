import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mock purchase history - in a real app, this would come from the database
  const [purchaseHistory] = useState([
    { id: 1, date: "2025-03-25", productName: "Wireless Earbuds", price: 79.99 },
    { id: 2, date: "2025-03-15", productName: "Smart Watch", price: 149.99 },
    { id: 3, date: "2025-02-28", productName: "Bluetooth Speaker", price: 89.99 }
  ]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    // Fetch some recommended products
    if (status === "authenticated") {
      async function fetchRecommendedProducts() {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .limit(3);  // Just show 3 recommended products
          
          if (!error) setProducts(data || []);
        } catch (err) {
          console.error("Error fetching recommended products:", err);
        } finally {
          setLoading(false);
        }
      }
      
      fetchRecommendedProducts();
    }
  }, [status, router]);

  if (status === "loading" || (status === "unauthenticated" && typeof window !== "undefined")) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>ElectroMart : Dashboard</title>
        <meta name="description" content="Your ElectroMart dashboard" />
      </Head>
      <div className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto p-6 flex-grow">
          <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="mb-2"><span className="font-medium">Email:</span> {session?.user?.email}</p>
            <p><span className="font-medium">Role:</span> {session?.user?.role || "Customer"}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
            {purchaseHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseHistory.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2 text-right">${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="font-semibold">
                    <tr>
                      <td className="px-4 py-2" colSpan={2}>Total</td>
                      <td className="px-4 py-2 text-right">
                        ${purchaseHistory.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No purchase history available.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
            {loading ? (
              <p>Loading recommendations...</p>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <img src={product.image} alt={product.title} className="w-12 h-12 mr-3" />
                      <h3 className="font-semibold">{product.title}</h3>
                    </div>
                    <p className="text-purple-800 font-medium">${product.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recommendations available.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
