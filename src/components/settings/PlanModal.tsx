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

export interface PlanData {
  id?: string;
  name: string;
  duration: number;
  minAmount: number;
  interestRate: number;
  isActive: boolean;
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PlanData) => void;
  plan?: PlanData | null;
  mode: 'add' | 'edit' | 'view';
}

const defaultPlan: PlanData = {
  name: '',
  duration: 12,
  minAmount: 5000,
  interestRate: 5.0,
  isActive: true
};

export function PlanModal({ isOpen, onClose, onSave, plan = null, mode = 'add' }: PlanModalProps) {
  const [formData, setFormData] = useState<PlanData>(defaultPlan);
  const [isEditing, setIsEditing] = useState(mode === 'add' || mode === 'edit');

  useEffect(() => {
    // Initialize form with plan data or default values
    if (plan) {
      setFormData(plan);
    } else {
      setFormData(defaultPlan);
    }
    
    // Set editing mode
    setIsEditing(mode === 'add' || mode === 'edit');
  }, [plan, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    
    setFormData({
      ...formData,
      [id.replace('plan-', '')]: type === 'number' ? parseFloat(value) : value
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

  const title = mode === 'add' ? 'Add New Investment Plan' : 
               mode === 'edit' ? 'Edit Investment Plan' : 
               'Investment Plan Details';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Fill in the details for this investment plan. Click save when you're done."
                : "Review the investment plan details. Click edit to make changes."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="plan-isActive" 
                checked={formData.isActive}
                onCheckedChange={handleCheckboxChange}
                disabled={!isEditing}
              />
              <Label htmlFor="plan-isActive">Active</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input 
                  id="plan-name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-duration">Duration (Months)</Label>
                <Input 
                  id="plan-duration" 
                  type="number" 
                  value={formData.duration} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min={1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-minAmount">Minimum Amount</Label>
                <Input 
                  id="plan-minAmount" 
                  type="number" 
                  value={formData.minAmount} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min={1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-interestRate">Interest Rate (%)</Label>
                <Input 
                  id="plan-interestRate" 
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
                Edit Plan
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
                  Save Plan
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PlanModal; 