// components/ProductCard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductCard({ id, title, price, image }) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    async function fetchQuantity() {
      const { data, error } = await supabase
        .from("products")
        .select("quantity")
        .eq("id", id)
        .single();
      if (!error && data) setQuantity(data.quantity);
    }
    fetchQuantity();

    // Optional: Real-time subscription
    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `id=eq.${id}` }, (payload) => {
        if (payload.new?.quantity !== undefined) {
          setQuantity(payload.new.quantity);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);

  async function handleBuy() {
    if (quantity <= 0) {
      alert("Out of stock!");
      return;
    }
    try {
      const { error } = await supabase
        .from("products")
        .update({ quantity: quantity - 1 })
        .eq("id", id);
      if (error) throw error;
      setQuantity(quantity - 1); // Immediate UI update
    } catch (err) {
      console.error("Buy error:", err.message);
      alert("Failed to update stock.");
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-lg text-gray-700">${price}</p>
        <p className="text-sm text-gray-500">Stock: {quantity}</p>
        <button
          onClick={handleBuy}
          className="mt-2 px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-950"
          disabled={quantity <= 0}
        >
          Buy Now
        </button>
      </div>
      <img className="w-32 h-32" src={image} alt={title} />
    </div>
  );
}