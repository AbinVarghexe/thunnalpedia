import React from "react";
import { notFound } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify/client";
import { getProductByHandleQuery } from "@/lib/shopify/queries";
import { HourBanner } from "@/components/storefront/HourBanner";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import ProductDetailsClient from "./ProductDetailsClient";

// Server page component for Route params binding
export default async function ProductPage(props) {
  const params = await props.params;
  const handle = params.handle;

  // Fetch product from Shopify storefront
  const response = await shopifyFetch({
    query: getProductByHandleQuery,
    variables: { handle }
  });

  const product = response?.data?.product;

  if (!product) {
    notFound();
  }

  // Fetch all products for the Related products section
  const allProductsResponse = await shopifyFetch({
    query: `
      query GetRelatedProducts {
        products(first: 8) {
          edges {
            node {
              id
              title
              handle
              description
              rating
              originalPrice
              colors {
                name
                hex
              }
              images(first: 2) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 4) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  });

  const allProducts = (allProductsResponse?.data?.products?.edges || [])
    .map(edge => edge.node);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner */}
      <HourBanner />

      {/* Pill Navigation */}
      <Header />

      {/* Main product display */}
      <main className="flex-grow">
        <ProductDetailsClient product={product} allProducts={allProducts} />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Cart Slider */}
      <CartDrawer />
    </div>
  );
}
