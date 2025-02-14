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
      if (!error) setQuantity(data.quantity);
    }
    fetchQuantity();
  }, [id]);

  return (
    <div className="border rounded-lg p-4 shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-lg text-gray-700">{price}</p>
        <p className="text-sm text-gray-500">Stock: {quantity}</p>
        <button className="mt-2 px-4 py-2 bg-purple-900 text-white rounded-md">
          Buy Now
        </button>
      </div>
      <img className="w-32 h-32" src={image} alt="Product Image" />
    </div>
  );
}
