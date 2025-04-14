
import { Product } from '@/contexts/CartContext';

export const products: Product[] = [
  {
    id: 1,
    name: "Encrypted SSD Drive - 512GB",
    description: "Hardware encrypted SSD drive with AES-256 encryption for secure data storage. Perfect for sensitive business and personal data.",
    price: 149.99,
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    name: "Secure Laptop Lock",
    description: "Advanced laptop security lock with steel cable and combination lock. Protect your device from theft in public spaces.",
    price: 34.99,
    stock: 28,
    image_url: "https://images.unsplash.com/photo-1526570207772-784d36084510?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Biometric USB Key",
    description: "USB key with fingerprint authentication. Store and transport your sensitive files with peace of mind.",
    price: 89.99,
    stock: 10,
    image_url: "https://images.unsplash.com/photo-1618577809816-6e23c1d1a3c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    name: "Privacy Screen Protector",
    description: "Anti-spy screen protector that limits viewing angles. Perfect for working in public spaces or during travel.",
    price: 29.99,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    name: "Encrypted Cloud Backup - 1TB",
    description: "One year subscription to our end-to-end encrypted cloud storage solution with 1TB capacity.",
    price: 120.00,
    stock: 100,
    image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    name: "Hardware Security Key",
    description: "FIDO2 compatible security key for two-factor authentication. Works with Google, Microsoft, and other major platforms.",
    price: 49.99,
    stock: 18,
    image_url: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 7,
    name: "Secure File Shredder",
    description: "Cross-cut paper shredder with CD/DVD and credit card destruction capabilities. Protect your physical documents.",
    price: 79.99,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 8,
    name: "VPN Router",
    description: "Pre-configured router with built-in VPN capabilities. Encrypt all traffic from your home or office network.",
    price: 199.99,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};
