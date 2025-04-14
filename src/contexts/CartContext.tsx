
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ServerCartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { token, isAuthenticated } = useAuth();
  
  // Calculate derived values
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch cart from API if authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch("http://localhost:5000/api/cart", {
            headers: {
              "x-auth-token": token,
            },
          });

          if (response.ok) {
            const cartData: ServerCartItem[] = await response.json();
            
            // Convert server cart format to client format
            const cartItems: CartItem[] = cartData.map(item => ({
              product: {
                id: item.product_id,
                name: item.name,
                description: "",
                price: item.price,
                stock: 999, // We don't have this in the response
                image_url: item.image_url
              },
              quantity: item.quantity
            }));
            
            setItems(cartItems);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  // Add item to cart
  const addToCart = async (product: Product, quantity: number) => {
    // Update UI immediately for responsiveness
    const existingItemIndex = items.findIndex(
      (item) => item.product.id === product.id
    );

    const newItems = [...items];

    if (existingItemIndex >= 0) {
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      newItems.push({ product, quantity });
    }

    setItems(newItems);
    
    // If authenticated, sync with server
    if (isAuthenticated && token) {
      try {
        const response = await fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity,
          }),
        });

        if (!response.ok) {
          // Revert UI change on error
          setItems(items);
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add item to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        });
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: number) => {
    // Update UI immediately
    const newItems = items.filter((item) => item.product.id !== productId);
    setItems(newItems);
    
    // If authenticated, sync with server
    if (isAuthenticated && token) {
      // Find the cart item ID
      const itemToRemove = items.find(item => item.product.id === productId);
      
      if (itemToRemove) {
        try {
          // In a real implementation, we would store the cart item ID
          // Here we're making a simplified assumption
          const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
            method: "DELETE",
            headers: {
              "x-auth-token": token,
            },
          });

          if (!response.ok) {
            // Revert UI change on error
            setItems(items);
            throw new Error("Failed to remove item from cart");
          }
        } catch (error) {
          console.error("Error removing from cart:", error);
          toast({
            title: "Error",
            description: "Failed to remove item from cart",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Update UI immediately
    const newItems = items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    
    setItems(newItems);
    
    // If authenticated, sync with server
    if (isAuthenticated && token) {
      // Find the cart item ID
      const itemToUpdate = items.find(item => item.product.id === productId);
      
      if (itemToUpdate) {
        try {
          // In a real implementation, we would store the cart item ID
          // Here we're making a simplified assumption
          const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify({
              quantity,
            }),
          });

          if (!response.ok) {
            // Revert UI change on error
            setItems(items);
            throw new Error("Failed to update cart");
          }
        } catch (error) {
          console.error("Error updating cart:", error);
          toast({
            title: "Error",
            description: "Failed to update cart quantity",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    // Update UI immediately
    setItems([]);
    
    // If authenticated, sync with server
    if (isAuthenticated && token) {
      try {
        const response = await fetch("http://localhost:5000/api/cart", {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to clear cart");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast({
          title: "Error",
          description: "Failed to clear cart",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
