// filepath: /home/spidy/wp-project/pages/checkout.js
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";

export default function Checkout() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });
  const [errors, setErrors] = useState({});

  // Redirect to cart if empty
  if (cart.length === 0 && !orderComplete && typeof window !== 'undefined') {
    router.push("/cart");
    return null;
  }

  // If not authenticated, redirect to login
  if (status === "unauthenticated" && typeof window !== 'undefined') {
    router.push("/login?redirect=checkout");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!formData.cardExpiry) newErrors.cardExpiry = "Expiry date is required";
    if (!formData.cardCvc) newErrors.cardCvc = "CVC is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Process order by updating product quantities for each item in cart
      for (const item of cart) {
        // Get current quantity
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("quantity")
          .eq("id", item.id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Check if we have enough stock
        if (product.quantity < item.quantity) {
          alert(`Sorry, only ${product.quantity} units of "${item.title}" are available.`);
          setIsSubmitting(false);
          return;
        }
        
        // Update the quantity in database
        const { error: updateError } = await supabase
          .from("products")
          .update({ quantity: product.quantity - item.quantity })
          .eq("id", item.id);
          
        if (updateError) throw updateError;
      }
      
      // Generate a random order number
      const generatedOrderNumber = `EM-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNumber);
      
      // In a real app, we would save the order details to a database here
      
      // Clear the cart
      clearCart();
      
      // Show order confirmation
      setOrderComplete(true);
    } catch (error) {
      console.error("Checkout error:", error.message);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | ElectroMart</title>
        <meta name="description" content="Complete your purchase" />
      </Head>
      <Header />
      <main className="container mx-auto p-4 min-h-screen">
        {orderComplete ? (
          <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
              <p className="text-xl mb-2">Your order has been confirmed.</p>
              <p className="text-gray-600 mb-6">Order #{orderNumber}</p>
              <p className="mb-8">We've sent a confirmation email to {formData.email}.</p>
              <button
                onClick={() => router.push("/products")}
                className="bg-purple-800 text-white px-6 py-2 rounded-md hover:bg-purple-900"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center my-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-4 mt-8">Payment Information</h2>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className={`w-full px-3 py-2 border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVC</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="123"
                          className={`w-full px-3 py-2 border ${errors.cardCvc ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc}</p>}
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : `Place Order • $${(cartTotal + (cartTotal * 0.08)).toFixed(2)}`}
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="relative">
                            <img src={item.image} alt={item.title} className="w-12 h-12 object-contain" />
                            <span className="absolute -top-2 -right-2 bg-gray-200 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <span className="ml-3 text-sm truncate max-w-[150px]">{item.title}</span>
                        </div>
                        <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%)</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(cartTotal + (cartTotal * 0.08)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}