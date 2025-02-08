export default function Footer() {
    return (
      <footer className="bg-purple-900 text-white text-center p-4 mt-8">
        &copy; {new Date().getFullYear()} ElectroMart. All rights reserved.
      </footer>
    );
}