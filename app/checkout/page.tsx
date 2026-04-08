import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-screen-xl px-6 py-12 md:px-8">
      <header className="mb-10">
        <h1 className="font-serif-display text-4xl text-ah-primary md:text-5xl">Complete your order</h1>
        <p className="mt-2 text-ah-on-surface-variant">
          Next-day delivery only · Distance-based fees · Ghaziabad / Noida Sector 62 focus area.
        </p>
      </header>
      <CheckoutForm />
    </main>
  );
}
