
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast({
            title: "Cannot Add Item",
            description: `Sorry, only ${product.stock} in stock`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        
        toast({
          title: "Cart Updated",
          description: `${product.name} quantity updated to ${newQuantity}`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        if (quantity > product.stock) {
          toast({
            title: "Cannot Add Item",
            description: `Sorry, only ${product.stock} in stock`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        toast({
          title: "Item Added",
          description: `${product.name} added to your cart`,
        });
        
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.product.id !== productId);
      
      if (updatedItems.length < prevItems.length) {
        toast({
          title: "Item Removed",
          description: "Item has been removed from your cart",
        });
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            toast({
              title: "Cannot Update Item",
              description: `Sorry, only ${item.product.stock} in stock`,
              variant: "destructive",
            });
            return item;
          }
          
          return { ...item, quantity };
        }
        return item;
      });
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  // Calculate total number of items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
