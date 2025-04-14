
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber || "000000";
  
  // Redirect if accessed directly without an order
  if (!location.state?.orderNumber) {
    setTimeout(() => {
      navigate("/");
    }, 5000);
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-xl text-gray-600">Thank you for your purchase</p>
      </div>
      
      <Card className="max-w-md w-full mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order Number:</span>
            <span className="font-mono font-medium">{orderNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-green-600 font-medium">Confirmed</span>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground">
              A confirmation email has been sent to your email address.
              <br />
              All sensitive information has been securely encrypted.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button asChild variant="outline">
          <Link to="/orders">
            View My Orders
          </Link>
        </Button>
        <Button asChild>
          <Link to="/products">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
