/*
Sharkie Active Next.js Project Structure
*/

// 1. package.json
{
  "name": "sharkie-active",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "framer-motion": "10.12.16",
    "tailwindcss": "3.3.4",
    "autoprefixer": "10.4.14",
    "postcss": "8.4.28"
  }
}


// 2. tailwind.config.js
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        charcoal: '#2c2c2c',
        offwhite: '#f5f5f5',
        red: '#ff1e1e',
      },
    },
  },
  plugins: [],
};


// 3. next.config.js
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;


// 4. /pages/_app.js
import '../styles/globals.css';
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}


// 5. /styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Helvetica Neue', sans-serif;
}


// 6. /components/Header.js
import Link from 'next/link';
export default function Header({ cartCount }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-offwhite text-lg font-semibold tracking-widest">SHARKIE ACTIVE</span>
        <div className="flex gap-8 text-sm text-offwhite">
          <Link href="#">Women</Link>
          <Link href="#">Men</Link>
          <Link href="#">About</Link>
          <Link href="#">Cart ({cartCount})</Link>
        </div>
      </nav>
    </header>
  );
}


// 7. /components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-black text-offwhite py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <p className="font-semibold tracking-widest">SHARKIE ACTIVE</p>
          <p className="text-sm text-charcoal mt-4">Performance essentials designed with refined confidence.</p>
        </div>

        <div>
          <p className="font-medium mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li>Women</li>
            <li>Men</li>
            <li>Gear</li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-4">Support</p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li>Shipping & Returns</li>
            <li>Size Guide</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-4">Follow</p>
          <ul className="space-y-2 text-sm text-charcoal">
            <li>Instagram</li>
            <li>TikTok</li>
          </ul>
        </div>
      </div>
      <div className="mt-16 text-center text-xs text-charcoal">© 2026 Sharkie Active. All rights reserved.</div>
    </footer>
  );
}


// 8. /components/ProductCard.js
import { motion } from 'framer-motion';
export default function ProductCard({ product, addToCart }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="group">
      <img src={product.images[0]?.edges[0]?.node.src} alt={product.images[0]?.edges[0]?.node.altText || product.title} className="rounded-2xl mb-4 h-[360px] w-full object-cover" />
      <h3 className="text-base font-medium">{product.title}</h3>
      <p className="text-charcoal text-sm">R{product.variants.edges[0].node.priceV2.amount}</p>
      <button onClick={() => addToCart(product.variants.edges[0].node.id)} className="mt-4 w-full py-2 bg-black text-offwhite rounded-full hover:bg-red-600 transition">Add to Cart</button>
    </motion.div>
  );
}


// 9. /pages/index.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  useEffect(() => {
    fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: `{ products(first: 20) { edges { node { id title handle description variants(first: 5) { edges { node { id title priceV2 { amount currencyCode } } } } images(first: 1) { edges { node { src altText } } } } } } }` }),
    })
      .then(res => res.json())
      .then(data => setProducts(data.data.products.edges.map(edge => edge.node)));
  }, []);

  const addToCart = (variantId) => {
    setCart([...cart, { variantId, quantity: 1 }]);
  };

  const checkout = async () => {
    const response = await fetch('/api/createCheckout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });
    const data = await response.json();
    window.location.href = data.checkoutUrl;
  };

  return (
    <>
      <Header cartCount={cart.length} />
      <motion.section className="relative h-screen flex items-center justify-center bg-black text-offwhite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90" />
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">SHARKIE ACTIVE</h1>
          <p className="mt-6 text-lg md:text-xl text-charcoal max-w-xl mx-auto">Engineered for movement. Designed for confidence.</p>
        </motion.div>
      </motion.section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">Shop</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map(product => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
        </div>
        {cart.length > 0 && <motion.div className="mt-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><button onClick={checkout} className="px-10 py-3 bg-red-600 text-offwhite rounded-full font-medium hover:bg-black transition">Proceed to Checkout ({cart.length} items)</button></motion.div>}
      </section>

      <motion.div className="fixed bottom-0 left-0 w-full bg-black text-offwhite py-4 px-6 flex justify-between items-center md:hidden" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300 }}>
        <span className="font-medium">R299</span>
        <button className="px-6 py-2 bg-red-600 rounded-full">Add to Cart</button>
      </motion.div>

      <Footer />
    </>
  );
}
