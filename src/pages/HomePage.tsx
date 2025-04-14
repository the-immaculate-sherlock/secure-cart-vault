
import React from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Shield, Lock, CreditCard } from "lucide-react";

const HomePage: React.FC = () => {
  // Show only featured products on homepage
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">
            Secure Shopping <span className="text-secondary-foreground">for The Digital Age</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            All your data is protected with industry-leading AES-256 encryption.
            Shop with confidence knowing your information is secure.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Shop with Confidence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              Every transaction is protected with military-grade AES-256 encryption.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <Lock className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Protected Data</h3>
            <p className="text-gray-600">
              Your personal information is never stored in plain text. SQL injection prevention built-in.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <CreditCard className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Encrypted Payments</h3>
            <p className="text-gray-600">
              Card details are encrypted before they're transmitted, ensuring they remain private.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline">
            View all products →
          </Link>
        </div>
        
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to shop securely?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of customers who trust our secure shopping platform.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
