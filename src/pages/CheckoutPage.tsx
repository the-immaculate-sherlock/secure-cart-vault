
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CreditCardForm, { CardData } from "@/components/CreditCardForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  
  const [errors, setErrors] = useState<Partial<ShippingData>>({});
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }
  
  const TAX_RATE = 0.07;
  const SHIPPING_FEE = 15.00;
  
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_FEE;

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof ShippingData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateShippingForm = (): boolean => {
    const newErrors: Partial<ShippingData> = {};
    
    if (!shippingData.fullName) newErrors.fullName = "Full name is required";
    if (!shippingData.address) newErrors.address = "Address is required";
    if (!shippingData.city) newErrors.city = "City is required";
    if (!shippingData.state) newErrors.state = "State is required";
    if (!shippingData.zipCode) newErrors.zipCode = "ZIP code is required";
    if (!shippingData.country) newErrors.country = "Country is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateShippingForm()) {
      setStep(2);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSubmit = async (cardData: CardData) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would be an API call to process payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully",
      });
      
      // Clear cart and redirect to confirmation
      clearCart();
      navigate("/order-confirmation", { 
        state: { 
          orderNumber: Math.floor(Math.random() * 1000000).toString().padStart(6, '0') 
        } 
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step === 1 ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"}`}
          >
            1
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div 
              className={`h-full ${step > 1 ? "bg-secondary" : "bg-gray-200"}`} 
              style={{ width: `${step > 1 ? "100%" : "0%"}` }}
            ></div>
          </div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step === 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
          >
            2
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {step === 1 ? (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <form onSubmit={handleShippingSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleShippingInputChange}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingInputChange}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingInputChange}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingInputChange}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingInputChange}
                        className={errors.zipCode ? "border-destructive" : ""}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive">{errors.zipCode}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingInputChange}
                        className={errors.country ? "border-destructive" : ""}
                      />
                      {errors.country && (
                        <p className="text-sm text-destructive">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <CreditCardForm 
              onSubmit={handlePaymentSubmit} 
              isProcessing={isProcessing} 
            />
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-500 block text-sm">Qty: {item.quantity}</span>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
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
              </div>
            </CardContent>
          </Card>
          
          {step === 2 && isProcessing && (
            <div className="mt-4 text-center p-4 bg-secondary/20 rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Processing payment securely...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
