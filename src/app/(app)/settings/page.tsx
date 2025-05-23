import React from 'react';
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

export default function SettingsPage() {
  // These would normally be fetched from the API
  const systemSettings = [
    { id: 'min_investment', key: 'Minimum Investment Amount', value: '1000', description: 'Minimum amount that can be invested' },
    { id: 'max_investment', key: 'Maximum Investment Amount', value: '100000', description: 'Maximum amount that can be invested' },
    { id: 'min_loan', key: 'Minimum Loan Amount', value: '5000', description: 'Minimum amount that can be borrowed' },
    { id: 'max_loan', key: 'Maximum Loan Amount', value: '50000', description: 'Maximum amount that can be borrowed' },
    { id: 'investment_fee', key: 'Investment Fee Percentage', value: '2.5', description: 'Fee charged for investment processing' },
    { id: 'loan_processing_fee', key: 'Loan Processing Fee', value: '1.5', description: 'Fee charged for loan processing' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="investmentPlans">Investment Plans</TabsTrigger>
          <TabsTrigger value="loanProducts">Loan Products</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure global system parameters
              </CardDescription>
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
                    />
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Investment Plans Tab */}
        <TabsContent value="investmentPlans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Plans</CardTitle>
              <CardDescription>
                Manage investment plan offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="active-growth" defaultChecked />
                      <Label htmlFor="active-growth">Active</Label>
                    </div>
                    <Button variant="outline" size="sm">Edit Plan</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-growth">Plan Name</Label>
                      <Input id="name-growth" defaultValue="Growth Fund" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration-growth">Duration (Months)</Label>
                      <Input id="duration-growth" type="number" defaultValue="12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minAmount-growth">Minimum Amount</Label>
                      <Input id="minAmount-growth" defaultValue="5000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest-growth">Interest Rate (%)</Label>
                      <Input id="interest-growth" defaultValue="5.2" />
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="active-income" defaultChecked />
                      <Label htmlFor="active-income">Active</Label>
                    </div>
                    <Button variant="outline" size="sm">Edit Plan</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-income">Plan Name</Label>
                      <Input id="name-income" defaultValue="Income Fund" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration-income">Duration (Months)</Label>
                      <Input id="duration-income" type="number" defaultValue="6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minAmount-income">Minimum Amount</Label>
                      <Input id="minAmount-income" defaultValue="3000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest-income">Interest Rate (%)</Label>
                      <Input id="interest-income" defaultValue="4.8" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Add New Plan</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Loan Products Tab */}
        <TabsContent value="loanProducts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Products</CardTitle>
              <CardDescription>
                Manage loan product offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="active-personal" defaultChecked />
                      <Label htmlFor="active-personal">Active</Label>
                    </div>
                    <Button variant="outline" size="sm">Edit Product</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-personal">Product Name</Label>
                      <Input id="name-personal" defaultValue="Personal Loan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration-personal">Duration (Months)</Label>
                      <Input id="duration-personal" type="number" defaultValue="12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minAmount-personal">Minimum Amount</Label>
                      <Input id="minAmount-personal" defaultValue="5000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest-personal">Interest Rate (%)</Label>
                      <Input id="interest-personal" defaultValue="8.5" />
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="active-business" defaultChecked />
                      <Label htmlFor="active-business">Active</Label>
                    </div>
                    <Button variant="outline" size="sm">Edit Product</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-business">Product Name</Label>
                      <Input id="name-business" defaultValue="Business Loan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration-business">Duration (Months)</Label>
                      <Input id="duration-business" type="number" defaultValue="24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minAmount-business">Minimum Amount</Label>
                      <Input id="minAmount-business" defaultValue="10000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest-business">Interest Rate (%)</Label>
                      <Input id="interest-business" defaultValue="9.2" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Add New Product</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-new-user" defaultChecked />
                    <Label htmlFor="notify-new-user">New user registration</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Notify when a new user registers</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-investment" defaultChecked />
                    <Label htmlFor="notify-investment">New investment application</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Notify when a new investment is created</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-loan" defaultChecked />
                    <Label htmlFor="notify-loan">New loan application</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Notify when a new loan is created</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-deposit" />
                    <Label htmlFor="notify-deposit">New deposit</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Notify when a deposit is made</p>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Notification Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 