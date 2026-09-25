import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import HowItWorks from "./components/HowItWorks";
import Differentials from "./components/Differentials";
import About from "./components/About";
import OrderSection from "./components/OrderSection";
import Testimonials from "./components/Testimonials";
import Location from "./components/Location";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CartDrawer from "./components/CartDrawer";
import { useCart } from "./hooks/useCart";
import { useBusinessHours } from "./hooks/useBusinessHours";

export default function Site() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const { enforced, status } = useBusinessHours();

  return (
    <div className="min-h-screen bg-cream">
      <Header totalItems={cart.totalItems} onOpenCart={() => setCartOpen(true)} />

      <main>
        <Hero enforced={enforced} status={status} />
        <Menu onAdd={cart.addItem} />
        <HowItWorks />
        <Differentials />
        <About />
        <OrderSection
          items={cart.items}
          totalPrice={cart.totalPrice}
          onIncrement={cart.increment}
          onDecrement={cart.decrement}
        />
        <Testimonials />
        <Location />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />

      <WhatsAppFloat />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        onIncrement={cart.increment}
        onDecrement={cart.decrement}
        onRemove={cart.removeItem}
        onClear={cart.clearCart}
        totalPrice={cart.totalPrice}
      />
    </div>
  );
}
