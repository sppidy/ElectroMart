import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center">Welcome to ElectroMart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <ProductCard title="Laptop" price="$999" image="laptop.svg" />
          <ProductCard title="Smartphone" price="$699" image="phone.svg" />
          <ProductCard title="Headphones" price="$199" image="headphones.svg" />
          <ProductCard title="Smartwatch" price="$299" image="smartwatch.svg" />
          <ProductCard title="Tablet" price="$499" image="tablet.svg" />
          <ProductCard title="Camera" price="$799" image="camera.svg" />
        </div>
      </main>
      <Footer />
    </>
  );
}