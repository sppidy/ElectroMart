import { useSession, signOut } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Admin() {
  const { data: session } = useSession();
  
  if (!session) {
    return <p className="text-center text-red-500">Access Denied</p>;
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
        <p className="text-center">Welcome, {session.user.email}</p>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => signOut()}>Logout</button>
      </main>
      <Footer />
    </>
  );
}