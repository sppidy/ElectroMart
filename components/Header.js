import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  
  return (
    <header className="bg-purple-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        ElectroMart
      </Link>
      <nav className="flex space-x-4">
        {status === "loading" ? (
          <span>Loading...</span> // Neutral placeholder during SSR and hydration
        ) : session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hover:underline"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}