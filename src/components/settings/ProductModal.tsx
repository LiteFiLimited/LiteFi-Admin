"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ProductData {
  id?: string;
  name: string;
  duration: number;
  minAmount: number;
  interestRate: number;
  isActive: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductData) => void;
  product?: ProductData | null;
  mode: 'add' | 'edit' | 'view';
}

const defaultProduct: ProductData = {
  name: '',
  duration: 12,
  minAmount: 5000,
  interestRate: 8.5,
  isActive: true
};

export function ProductModal({ isOpen, onClose, onSave, product = null, mode = 'add' }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductData>(defaultProduct);
  const [isEditing, setIsEditing] = useState(mode === 'add' || mode === 'edit');

  useEffect(() => {
    // Initialize form with product data or default values
    if (product) {
      setFormData(product);
    } else {
      setFormData(defaultProduct);
    }
    
    // Set editing mode
    setIsEditing(mode === 'add' || mode === 'edit');
  }, [product, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    
    setFormData({
      ...formData,
      [id.replace('product-', '')]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const title = mode === 'add' ? 'Add New Loan Product' : 
               mode === 'edit' ? 'Edit Loan Product' : 
               'Loan Product Details';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Fill in the details for this loan product. Click save when you're done."
                : "Review the loan product details. Click edit to make changes."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="product-isActive" 
                checked={formData.isActive}
                onCheckedChange={handleCheckboxChange}
                disabled={!isEditing}
              />
              <Label htmlFor="product-isActive">Active</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input 
                  id="product-name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-duration">Duration (Months)</Label>
                <Input 
                  id="product-duration" 
                  type="number" 
                  value={formData.duration} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min={1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-minAmount">Minimum Amount</Label>
                <Input 
                  id="product-minAmount" 
                  type="number" 
                  value={formData.minAmount} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min={1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-interestRate">Interest Rate (%)</Label>
                <Input 
                  id="product-interestRate" 
                  type="number" 
                  value={formData.interestRate} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  step="0.1"
                  min={0}
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            {!isEditing ? (
              <Button type="button" onClick={handleEditClick}>
                Edit Product
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
                  Save Product
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductModal; 