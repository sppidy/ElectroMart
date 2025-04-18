import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/CartContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}
export default MyApp;
