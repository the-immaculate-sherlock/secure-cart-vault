
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface CreditCardFormProps {
  onSubmit: (cardData: CardData) => void;
  isProcessing: boolean;
}

export interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSubmit, isProcessing }) => {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<CardData>>({});

  const formatCardNumber = (value: string): string => {
    const sanitized = value.replace(/\D/g, '').substring(0, 16);
    const groups = [];
    
    for (let i = 0; i < sanitized.length; i += 4) {
      groups.push(sanitized.substring(i, i + 4));
    }
    
    return groups.join(' ');
  };

  const formatExpiryDate = (value: string): string => {
    const sanitized = value.replace(/\D/g, '').substring(0, 4);
    
    if (sanitized.length > 2) {
      return `${sanitized.substring(0, 2)}/${sanitized.substring(2)}`;
    }
    
    return sanitized;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user types
    if (errors[name as keyof CardData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CardData> = {};
    
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    
    if (!cardData.cardHolder) {
      newErrors.cardHolder = 'Enter the cardholder name';
    }
    
    if (!cardData.expiryDate || !cardData.expiryDate.includes('/')) {
      newErrors.expiryDate = 'Enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cardData.cvv || cardData.cvv.length !== 3) {
      newErrors.cvv = 'Enter a valid 3-digit CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(cardData);
    } else {
      toast({
        title: "Invalid Card Details",
        description: "Please check your card information",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className={errors.cardNumber ? "border-destructive" : ""}
            />
            {errors.cardNumber && (
              <p className="text-sm text-destructive">{errors.cardNumber}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardHolder">Cardholder Name</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              value={cardData.cardHolder}
              onChange={handleInputChange}
              placeholder="John Smith"
              className={errors.cardHolder ? "border-destructive" : ""}
            />
            {errors.cardHolder && (
              <p className="text-sm text-destructive">{errors.cardHolder}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={errors.expiryDate ? "border-destructive" : ""}
              />
              {errors.expiryDate && (
                <p className="text-sm text-destructive">{errors.expiryDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className={errors.cvv ? "border-destructive" : ""}
              />
              {errors.cvv && (
                <p className="text-sm text-destructive">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center mt-2">
            <Lock className="h-3 w-3 mr-1" />
            Your card details are secured with AES-256 encryption
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Complete Payment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreditCardForm;
