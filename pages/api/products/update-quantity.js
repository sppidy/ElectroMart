// pages/api/products/update-quantity.js
import { createClient } from "@supabase/supabase-js";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getSession({ req });
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const { id, quantity } = req.body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { error } = await supabase
      .from("products")
      .update({ quantity: parseInt(quantity) })
      .eq("id", id);
    if (error) throw error;
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (err) {
    console.error("Update quantity error:", err.message);
    res.status(500).json({ error: "Failed to update quantity: " + err.message });
  }
}