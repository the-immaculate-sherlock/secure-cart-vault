
import React from "react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0">
      <div className="w-full sm:w-24 h-24 flex-shrink-0 mr-4 mb-4 sm:mb-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow mr-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>
        <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center mt-2 sm:mt-0">
        <div className="flex items-center border rounded-md mr-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none rounded-l-md"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="px-3">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none rounded-r-md"
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
