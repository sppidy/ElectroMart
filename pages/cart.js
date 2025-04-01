// filepath: /home/spidy/wp-project/pages/cart.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/CartContext";

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle quantity changes
  const handleQuantityChange = (id, newQuantity, maxQuantity) => {
    if (newQuantity > maxQuantity) {
      alert(`Sorry, only ${maxQuantity} units available in stock.`);
      updateQuantity(id, maxQuantity);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <>
      <Head>
        <title>Your Cart | ElectroMart</title>
        <meta name="description" content="Review the items in your shopping cart" />
      </Head>
      <Header />
      <main className="container mx-auto p-4 min-h-screen">
        <h1 className="text-3xl font-bold text-center my-8">Your Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products yet.</p>
            <Link href="/products" className="bg-purple-800 text-white py-2 px-6 rounded-md hover:bg-purple-900">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart items table */}
            <div className="lg:w-3/4">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Product</th>
                      <th scope="col" className="py-3 px-4 text-center text-sm font-medium text-gray-700 uppercase">Quantity</th>
                      <th scope="col" className="py-3 px-4 text-right text-sm font-medium text-gray-700 uppercase">Price</th>
                      <th scope="col" className="py-3 px-4 text-right text-sm font-medium text-gray-700 uppercase">Total</th>
                      <th scope="col" className="py-3 px-4 text-right text-sm font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-contain mr-4" />
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center">
                            <button 
                              onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1), item.maxQuantity)} 
                              className="border rounded-l px-3 py-1 bg-gray-100 hover:bg-gray-200"
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              min="1" 
                              max={item.maxQuantity} 
                              value={item.quantity} 
                              onChange={(e) => handleQuantityChange(
                                item.id, 
                                parseInt(e.target.value) || 1,
                                item.maxQuantity
                              )} 
                              className="border-t border-b w-12 text-center py-1 px-2"
                            />
                            <button 
                              onClick={() => handleQuantityChange(
                                item.id, 
                                Math.min(item.quantity + 1, item.maxQuantity),
                                item.maxQuantity
                              )} 
                              className="border rounded-r px-3 py-1 bg-gray-100 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 flex justify-between border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                  <Link href="/products" className="text-purple-600 hover:text-purple-800">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(cartTotal + (cartTotal * 0.08)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}