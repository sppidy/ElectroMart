export default function Header() {
  return (
    <header className="bg-purple-900 text-white font-bold">
    <div className="flex justify-between items-center p-4">
      <a href="/" className="text-2xl">ElectroMart</a>
      <div className="flex space-x-4">
        <a href="/login" className="text-s">Login</a>
        <a href="/register" className="text-s">Register</a>
      </div>
    </div>
    </header>
  );
}