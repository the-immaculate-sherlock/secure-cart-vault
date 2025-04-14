
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, CreditCard } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Shield className="h-10 w-10 text-primary mb-2" />
            <h3 className="text-lg font-bold mb-2">Secure Shopping</h3>
            <p className="text-gray-600">All transactions are protected with AES-256 encryption and secure payment processing.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Lock className="h-10 w-10 text-primary mb-2" />
            <h3 className="text-lg font-bold mb-2">Your Data is Protected</h3>
            <p className="text-gray-600">We use advanced encryption for all your personal and payment information.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <CreditCard className="h-10 w-10 text-primary mb-2" />
            <h3 className="text-lg font-bold mb-2">Secure Payments</h3>
            <p className="text-gray-600">All card details are encrypted and we never store sensitive CVV data.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} SecureShop. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-600 hover:text-primary text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary text-sm">Terms of Service</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
