"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PlanModal, type PlanData as ModalPlanData } from '@/components/settings/PlanModal';
import { ProductModal, type ProductData as ModalProductData } from '@/components/settings/ProductModal';
import { toast } from "@/components/ui/use-toast";
import { EyeIcon, PencilIcon } from "lucide-react";

// Types for our data
interface PlanData {
  id: string;
  name: string;
  duration: number;
  minAmount: number;
  interestRate: number;
  isActive: boolean;
}

interface ProductData {
  id: string;
  name: string;
  duration: number;
  minAmount: number;
  interestRate: number;
  isActive: boolean;
}

export default function SettingsPage() {
  // Sample plan and product data
  const [plans, setPlans] = useState<PlanData[]>([
    { id: '1', name: 'Growth Fund', duration: 12, minAmount: 5000, interestRate: 5.2, isActive: true },
    { id: '2', name: 'Income Fund', duration: 6, minAmount: 3000, interestRate: 4.8, isActive: true },
  ]);
  
  const [products, setProducts] = useState<ProductData[]>([
    { id: '1', name: 'Personal Loan', duration: 12, minAmount: 5000, interestRate: 8.5, isActive: true },
    { id: '2', name: 'Business Loan', duration: 24, minAmount: 10000, interestRate: 9.2, isActive: true },
  ]);
  
  // Edit mode states
  const [generalEditMode, setGeneralEditMode] = useState(false);
  const [notificationsEditMode, setNotificationsEditMode] = useState(false);
  
  // Modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  // System settings
  const systemSettings = [
    { id: 'min_investment', key: 'Minimum Investment Amount', value: '1000', description: 'Minimum amount that can be invested' },
    { id: 'max_investment', key: 'Maximum Investment Amount', value: '100000', description: 'Maximum amount that can be invested' },
    { id: 'min_loan', key: 'Minimum Loan Amount', value: '5000', description: 'Minimum amount that can be borrowed' },
    { id: 'max_loan', key: 'Maximum Loan Amount', value: '50000', description: 'Maximum amount that can be borrowed' },
    { id: 'investment_fee', key: 'Investment Fee Percentage', value: '2.5', description: 'Fee charged for investment processing' },
    { id: 'loan_processing_fee', key: 'Loan Processing Fee', value: '1.5', description: 'Fee charged for loan processing' },
  ];

  // Notification settings
  const notificationSettings = [
    { id: 'notify-new-user', label: 'New user registration', description: 'Notify when a new user registers', defaultChecked: true },
    { id: 'notify-investment', label: 'New investment application', description: 'Notify when a new investment is created', defaultChecked: true },
    { id: 'notify-loan', label: 'New loan application', description: 'Notify when a new loan is created', defaultChecked: true },
    { id: 'notify-payment', label: 'Payment received', description: 'Notify when a payment is received', defaultChecked: true },
  ];

  // Handlers for plans
  const handleAddPlan = () => {
    setSelectedPlan(null);
    setModalMode('add');
    setPlanModalOpen(true);
  };

  const handleEditPlan = (plan: PlanData) => {
    setSelectedPlan(plan);
    setModalMode('edit');
    setPlanModalOpen(true);
  };

  const handleViewPlan = (plan: PlanData) => {
    setSelectedPlan(plan);
    setModalMode('view');
    setPlanModalOpen(true);
  };

  const handleSavePlan = (planData: ModalPlanData) => {
    if (modalMode === 'add') {
      // Create new plan with a unique ID
      const newPlan = { ...planData, id: Date.now().toString() };
      setPlans([...plans, newPlan]);
      toast({
        title: "Plan Created",
        description: "New investment plan has been created successfully.",
        variant: "default",
      });
    } else {
      // Update existing plan
      setPlans(plans.map(p => p.id === selectedPlan?.id ? { ...planData, id: p.id } : p));
      toast({
        title: "Plan Updated",
        description: "Investment plan has been updated successfully.",
        variant: "default",
      });
    }
    setPlanModalOpen(false);
  };

  // Handlers for products
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setProductModalOpen(true);
  };
  
  const handleViewProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setModalMode('view');
    setProductModalOpen(true);
  };

  const handleSaveProduct = (productData: ModalProductData) => {
    if (modalMode === 'add') {
      // Create new product with a unique ID
      const newProduct = { ...productData, id: Date.now().toString() };
      setProducts([...products, newProduct]);
      toast({
        title: "Product Created", 
        description: "New loan product has been created successfully.",
        variant: "default",
      });
    } else {
      // Update existing product
      setProducts(products.map(p => p.id === selectedProduct?.id ? { ...productData, id: p.id } : p));
      toast({
        title: "Product Updated",
        description: "Loan product has been updated successfully.",
        variant: "default",
      });
    }
    setProductModalOpen(false);
  };

  // Update general settings save handler
  const handleSaveGeneralSettings = () => {
    setGeneralEditMode(false);
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
      variant: "default",
    });
  };

  // Update notification settings save handler
  const handleSaveNotificationSettings = () => {
    setNotificationsEditMode(false);
    toast({
      title: "Notifications Updated",
      description: "Notification preferences have been saved.",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-max">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="investmentPlans">Investment Plans</TabsTrigger>
            <TabsTrigger value="loanProducts">Loan Products</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure global system parameters
                </CardDescription>
              </div>
              {!generalEditMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setGeneralEditMode(true)}
                >
                  Edit <PencilIcon className="h-4 w-4 ml-1" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemSettings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.id}>{setting.key}</Label>
                    <Input 
                      id={setting.id} 
                      defaultValue={setting.value} 
                      className="w-full"
                      disabled={!generalEditMode}
                    />
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                ))}
              </div>
              {generalEditMode && (
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2" 
                    onClick={() => setGeneralEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveGeneralSettings}>Save Settings</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Investment Plans Tab */}
        <TabsContent value="investmentPlans" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Investment Plans</CardTitle>
                <CardDescription>
                  Manage investment plan offerings
                </CardDescription>
              </div>
              <Button onClick={handleAddPlan}>Add New Plan</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`active-${plan.id}`} 
                          defaultChecked={plan.isActive} 
                          disabled
                        />
                        <Label htmlFor={`active-${plan.id}`}>Active</Label>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewPlan(plan)}>
                          View <EyeIcon className="h-4 w-4 ml-1" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          Edit <PencilIcon className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${plan.id}`}>Plan Name</Label>
                        <Input 
                          id={`name-${plan.id}`} 
                          value={plan.name} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${plan.id}`}>Duration (Months)</Label>
                        <Input 
                          id={`duration-${plan.id}`} 
                          type="number" 
                          value={plan.duration} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`minAmount-${plan.id}`}>Minimum Amount</Label>
                        <Input 
                          id={`minAmount-${plan.id}`} 
                          value={plan.minAmount} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`interest-${plan.id}`}>Interest Rate (%)</Label>
                        <Input 
                          id={`interest-${plan.id}`} 
                          value={plan.interestRate} 
                          disabled 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Plan Modal */}
          <PlanModal 
            isOpen={planModalOpen}
            onClose={() => setPlanModalOpen(false)}
            onSave={handleSavePlan}
            plan={selectedPlan}
            mode={modalMode}
          />
        </TabsContent>
        
        {/* Loan Products Tab */}
        <TabsContent value="loanProducts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Loan Products</CardTitle>
                <CardDescription>
                  Manage loan product offerings
                </CardDescription>
              </div>
              <Button onClick={handleAddProduct}>Add New Product</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`active-${product.id}`} 
                          defaultChecked={product.isActive} 
                          disabled
                        />
                        <Label htmlFor={`active-${product.id}`}>Active</Label>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewProduct(product)}>
                          View <EyeIcon className="h-4 w-4 ml-1" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          Edit <PencilIcon className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${product.id}`}>Product Name</Label>
                        <Input 
                          id={`name-${product.id}`} 
                          value={product.name} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${product.id}`}>Duration (Months)</Label>
                        <Input 
                          id={`duration-${product.id}`} 
                          type="number" 
                          value={product.duration} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`minAmount-${product.id}`}>Minimum Amount</Label>
                        <Input 
                          id={`minAmount-${product.id}`} 
                          value={product.minAmount} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`interest-${product.id}`}>Interest Rate (%)</Label>
                        <Input 
                          id={`interest-${product.id}`} 
                          value={product.interestRate} 
                          disabled 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Product Modal */}
          <ProductModal 
            isOpen={productModalOpen}
            onClose={() => setProductModalOpen(false)}
            onSave={handleSaveProduct}
            product={selectedProduct}
            mode={modalMode}
          />
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email and system notifications
                </CardDescription>
              </div>
              {!notificationsEditMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setNotificationsEditMode(true)}
                >
                  Edit <PencilIcon className="h-4 w-4 ml-1" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={setting.id} 
                        defaultChecked={setting.defaultChecked} 
                        disabled={!notificationsEditMode}
                      />
                      <Label htmlFor={setting.id}>{setting.label}</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                ))}
                
                {notificationsEditMode && (
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      className="mr-2" 
                      onClick={() => setNotificationsEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 