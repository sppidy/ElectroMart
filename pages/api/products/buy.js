// filepath: /home/spidy/wp-project/pages/api/products/buy.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // First, check current quantity
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    
    if (!product || product.quantity <= 0) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    // Then update the quantity
    const { error: updateError } = await supabase
      .from("products")
      .update({ quantity: product.quantity - 1 })
      .eq("id", id);

    if (updateError) throw updateError;
    
    res.status(200).json({ message: "Purchase successful", newQuantity: product.quantity - 1 });
  } catch (err) {
    console.error("Purchase error:", err.message);
    res.status(500).json({ error: "Failed to process purchase: " + err.message });
  }
}