
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const product = getProductById(parseInt(id || "0"));
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, the product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
            <div className="border-b pb-4 mb-4">
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-4">Quantity:</span>
              <select
                value={quantity}
                onChange={handleQuantityChange}
                className="border rounded-md px-3 py-1.5"
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
            
            <Button
              onClick={handleAddToCart}
              className="w-full"
              disabled={product.stock === 0 || isAdded}
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
          
          <Card className="p-4 bg-gray-50">
            <div className="text-sm space-y-2">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>AES-256 encrypted checkout</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Fast shipping (2-3 business days)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
