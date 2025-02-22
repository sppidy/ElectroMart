import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from 'next/head';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>ElectroMart : Dashboard</title>
      </Head>
      <div className="antialiased">
        <Header />
        <h1>Welcome to Dashboard</h1>
        <Footer />
      </div>
    </>
  );
}
