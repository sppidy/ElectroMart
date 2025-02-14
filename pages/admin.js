import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const userRole = session?.user?.role;

  useEffect(() => { if (status === "authenticated") fetchProducts(); }, [status]);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  }

  async function handleProduct(action, product) {
    if (userRole !== "admin") return alert("Access Denied");
    const { error } = action === 'add'
    ? await supabase.from("products").insert([product])
    : await supabase.from("products").delete().eq("id", product.id);
    if (!error) fetchProducts();
  }

  if (status === "loading") return <p>Loading...</p>;
  if (userRole !== "admin") return <p className="text-red-500 font-semibold">Access Denied</p>;

  return (
    <SessionProvider session={session}>
    <Header />
    <main className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
    <form onSubmit={(e) => { e.preventDefault(); handleProduct('add', { title, price, image }); }}>
    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
    <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
    <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
    <button type="submit">Add Product</button>
    </form>
    <ul>
    {products.map(({ id, title, price, image }) => (
      <li key={id}>
      {title} - ${price} <img src={image} alt={title} width={50} />
      <button onClick={() => handleProduct('delete', { id })}>Delete</button>
      </li>
    ))}
    </ul>
    </main>
    <Footer />
    </SessionProvider>
  );
}
