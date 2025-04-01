import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useCart } from "@/lib/CartContext";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  const handleSignOut = () => {
    setIsMenuOpen(false);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-purple-800 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ElectroMart
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`hover:text-purple-200 ${router.pathname === "/" ? "font-semibold" : ""}`}>
            Home
          </Link>
          <Link href="/products" className={`hover:text-purple-200 ${router.pathname === "/products" ? "font-semibold" : ""}`}>
            All Products
          </Link>
          
          {/* Cart Link with Badge */}
          <Link href="/cart" className="relative hover:text-purple-200">
            <span className={router.pathname === "/cart" ? "font-semibold" : ""}>Cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {status === "loading" ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              <div className="flex items-center space-x-4">
                {session.user.role === "admin" && (
                  <Link href="/admin" className={`hover:text-purple-200 ${router.pathname === "/admin" ? "font-semibold" : ""}`}>
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className={`hover:text-purple-200 ${router.pathname === "/dashboard" ? "font-semibold" : ""}`}>
                  Dashboard
                </Link>
                <div className="flex items-center">
                  <span className="mr-2">{session.user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-purple-900 hover:bg-purple-700 px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="hover:text-purple-200 bg-transparent hover:bg-purple-700 px-3 py-1 rounded">
                Login
              </Link>
              <Link href="/register" className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button and Cart badge for mobile */}
        <div className="flex items-center md:hidden space-x-2">
          {/* Cart Link with Badge for Mobile */}
          <Link href="/cart" className="relative mr-4 hover:text-purple-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
        
          {/* Menu button */}
          <button 
            className="text-white focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-purple-900 px-4 py-2">
          <Link href="/" 
            className="block py-2 hover:text-purple-200"
            onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/products" 
            className="block py-2 hover:text-purple-200"
            onClick={() => setIsMenuOpen(false)}>
            All Products
          </Link>
          <Link href="/cart" 
            className="block py-2 hover:text-purple-200"
            onClick={() => setIsMenuOpen(false)}>
            Cart
            {cartItemsCount > 0 && ` (${cartItemsCount})`}
          </Link>
          
          {session ? (
            <>
              {session.user.role === "admin" && (
                <Link href="/admin" 
                  className="block py-2 hover:text-purple-200"
                  onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <Link href="/dashboard" 
                className="block py-2 hover:text-purple-200"
                onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <div className="border-t border-purple-700 my-2 py-2">
                <span className="block text-sm text-purple-300">{session.user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="mt-2 w-full text-center bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-purple-700 mt-2 pt-2 flex flex-col space-y-2">
              <Link href="/login" 
                className="block w-full text-center bg-transparent border border-white hover:bg-purple-700 px-3 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" 
                className="block w-full text-center bg-green-600 hover:bg-green-500 px-3 py-1 rounded"
                onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}