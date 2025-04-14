
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";

// Mock order data
interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered";
  total: number;
  items: number;
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data
        const mockOrders: Order[] = [
          {
            id: "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            date: new Date().toISOString(),
            status: "processing",
            total: 234.56,
            items: 2
          },
          {
            id: "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "shipped",
            total: 89.99,
            items: 1
          },
          {
            id: "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "delivered",
            total: 349.95,
            items: 3
          }
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">Once you place an order, it will appear here.</p>
          <Button onClick={() => navigate("/products")}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted pb-2">
                <div className="flex flex-col md:flex-row justify-between">
                  <CardTitle className="text-lg">Order {order.id}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Status:</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground mr-2">Items:</span>
                      <span>{order.items}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground mr-2">Total:</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
