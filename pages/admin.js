// pages/admin.js
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase"; // Client-side with anon key
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/globals.css";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchProducts();
    }
  }, [status, session, router]);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch products error:", err.message);
      setError("Failed to load products: " + err.message);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (session?.user?.role !== "admin") {
      setError("Access Denied");
      return;
    }

    try {
      setError("");
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, image, quantity }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to add product");
      setTitle("");
      setPrice("");
      setImage("");
      setQuantity("");
      fetchProducts();
    } catch (err) {
      console.error("Add product error:", err.message);
      setError("Failed to add product: " + err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (session?.user?.role !== "admin") {
      setError("Access Denied");
      return;
    }

    try {
      setError("");
      const response = await fetch("/api/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete product");
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err.message);
      setError("Failed to delete product: " + err.message);
    }
  }

  async function handleUpdateQuantity(id, newQuantity) {
    if (session?.user?.role !== "admin") {
      setError("Access Denied");
      return;
    }

    try {
      setError("");
      const response = await fetch("/api/products/update-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update quantity");
      fetchProducts();
    } catch (err) {
      console.error("Update quantity error:", err.message);
      setError("Failed to update quantity: " + err.message);
    }
  }

  if (status === "loading") return <p className="text-center">Loading...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAddProduct} className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
            step="0.01"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded-md"
            min="0"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900"
          >
            Add Product
          </button>
        </form>
        <ul className="space-y-4">
          {products.map(({ id, title, price, image, quantity }) => (
            <li key={id} className="flex items-center justify-between border p-4 rounded-md">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-lg">${price}</p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 mr-2">Stock: {quantity}</p>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleUpdateQuantity(id, e.target.value)}
                    className="w-16 p-1 border rounded-md"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <img src={image} alt={title} className="w-16 h-16 mr-4" />
                <button
                  onClick={() => handleDeleteProduct(id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}