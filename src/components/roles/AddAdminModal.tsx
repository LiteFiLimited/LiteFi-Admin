"use client";

import React, { useState } from 'react';
import { AdminRole } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Define the form values type
export interface AddAdminFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
}

// Component props
interface AddAdminModalProps {
  onAddAdmin?: (data: AddAdminFormValues) => Promise<void>;
}

export function AddAdminModal({ onAddAdmin }: AddAdminModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<AddAdminFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: AdminRole.ADMIN,
    isActive: true
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Partial<Record<keyof AddAdminFormValues, string>>>({});
  
  // Handle input changes
  const handleChange = (field: keyof AddAdminFormValues, value: string | boolean | AdminRole) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddAdminFormValues, string>> = {};
    
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (onAddAdmin) {
        await onAddAdmin(formData);
      }
      
      // Reset form and close modal on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: AdminRole.ADMIN,
        isActive: true
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding admin:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new admin user with appropriate role and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="johndoe@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value as AdminRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={AdminRole.SUPER_ADMIN}>Super Admin</SelectItem>
                  <SelectItem value={AdminRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={AdminRole.SALES}>Sales</SelectItem>
                  <SelectItem value={AdminRole.RISK}>Risk</SelectItem>
                  <SelectItem value={AdminRole.FINANCE}>Finance</SelectItem>
                  <SelectItem value={AdminRole.COMPLIANCE}>Compliance</SelectItem>
                  <SelectItem value={AdminRole.COLLECTIONS}>Collections</SelectItem>
                  <SelectItem value={AdminRole.PORT_MGT}>Portfolio Management</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>
          
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', !!checked)}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isActive">
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">
                This account will be active and operational immediately.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 