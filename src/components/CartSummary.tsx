
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";

const CartSummary: React.FC = () => {
  const { subtotal, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const TAX_RATE = 0.07;
  const SHIPPING_FEE = totalItems > 0 ? 15.00 : 0;
  
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_FEE;

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (7%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>${SHIPPING_FEE.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span className="text-lg">${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheckout}
          className="w-full"
          disabled={totalItems === 0}
        >
          <LockKeyhole className="mr-2 h-4 w-4" />
          {user ? "Secure Checkout" : "Login & Checkout"}
        </Button>
      </CardFooter>
      <div className="px-6 pb-4 text-xs text-center text-muted-foreground">
        <p className="flex items-center justify-center">
          <LockKeyhole className="h-3 w-3 mr-1" />
          Secure checkout with AES-256 encryption
        </p>
      </div>
    </Card>
  );
};

export default CartSummary;
