import { HourBanner } from "@/components/storefront/HourBanner";
import { Header } from "@/components/storefront/Header";
import { Hero } from "@/components/storefront/Hero";
import { ProductScroll } from "@/components/storefront/ProductScroll";
import { BrandBoard } from "@/components/storefront/BrandBoard";
import { Testimonials } from "@/components/storefront/Testimonials";
import { FAQ } from "@/components/storefront/FAQ";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Urgency countdown drop banner */}
      <HourBanner />
      
      {/* Navigation Header */}
      <Header />
      
      <main className="flex-1 flex flex-col">
        {/* Editorial Hero storytelling section */}
        <Hero />
        
        {/* Horizontal snapping product collection gallery */}
        <ProductScroll />
        
        {/* Asymmetric brand board / collage */}
        <BrandBoard />
        
        {/* Sliding customer feedback review proofs */}
        <Testimonials />

        {/* FAQ accordions section */}
        <FAQ />
      </main>
      
      {/* Form validation & details footer */}
      <Footer />
      
      {/* Slide-over cart overlay */}
      <CartDrawer />
    </div>
  );
}
