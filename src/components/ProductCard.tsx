
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 line-clamp-2 mt-2 text-sm h-10">{product.description}</p>
          <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart} 
            variant="secondary" 
            className="w-full"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
