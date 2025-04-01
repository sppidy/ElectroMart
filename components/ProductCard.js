// components/ProductCard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({ id, title, price, image }) {
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

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

  // Add to cart functionality
  const handleAddToCart = () => {
    if (quantity <= 0) {
      alert("Sorry, this item is out of stock!");
      return;
    }

    addToCart({
      id,
      title,
      price,
      image,
      maxQuantity: quantity // Store available stock
    });
  };

  // Buy now functionality (kept for direct purchases)
  async function handleBuy() {
    if (quantity <= 0) {
      alert("Out of stock!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the API endpoint instead of direct Supabase update
      const response = await fetch("/api/products/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to process purchase");
      }
      
      // Update local state with the returned new quantity
      setQuantity(result.newQuantity);
    } catch (err) {
      console.error("Buy error:", err.message);
      alert("Failed to process purchase. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-lg text-gray-700">${price}</p>
          <p className="text-sm text-gray-500">Stock: {quantity}</p>
        </div>
        <img className="w-32 h-32 object-contain" src={image} alt={title} />
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={quantity <= 0}
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuy}
          className="flex-1 px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-950 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={quantity <= 0 || isLoading}
        >
          {isLoading ? "Processing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}