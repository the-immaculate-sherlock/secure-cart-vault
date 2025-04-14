
import React from "react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const { items, clearCart, totalItems } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add items to your cart to see them here.</p>
          <Button asChild>
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h2 className="text-xl font-semibold">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </h2>
                <Button variant="ghost" onClick={clearCart} className="text-destructive">
                  Clear Cart
                </Button>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
