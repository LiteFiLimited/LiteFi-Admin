"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Save, Edit } from 'lucide-react';
import settingsApi from '@/lib/settingsApi';
import { SystemSettings, UpdateSystemSettingsRequest } from '@/lib/types';
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton';
import { useToast } from '@/components/ui/toast-provider';

export default function SettingsPage() {
  const { toast } = useToast();
  
  // Settings state
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for editing
  const [formData, setFormData] = useState<UpdateSystemSettingsRequest>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch system settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await settingsApi.getSystemSettings();

      if (response.success && response.data) {
        setSettings(response.data);
        // Initialize form data with current settings
        setFormData({
          defaultInvestmentInterestRate: response.data.defaultInvestmentInterestRate,
          defaultLoanInterestRate: response.data.defaultLoanInterestRate,
          minimumInvestmentAmount: response.data.minimumInvestmentAmount,
          defaultProcessingFee: response.data.defaultProcessingFee,
          maxWithdrawalPerDay: response.data.maxWithdrawalPerDay,
          enableForeignInvestments: response.data.enableForeignInvestments,
          autoApproveNairaInvestments: response.data.autoApproveNairaInvestments,
          enableUpfrontInterestPayment: response.data.enableUpfrontInterestPayment,
        });
        setHasChanges(false);
      } else {
        setError(response.error || 'Failed to fetch system settings');
        setSettings(null);
      }
    } catch (err) {
      setError('Network error occurred while fetching settings');
      console.error('Error fetching settings:', err);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle form field changes
  const handleInputChange = (field: keyof UpdateSystemSettingsRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Handle number input changes with validation
  const handleNumberInputChange = (field: keyof UpdateSystemSettingsRequest, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      handleInputChange(field, numValue);
    }
  };

  // Reset form to original values (removed unused function)
  // const handleReset = () => { ... } - removed as it's not used in the UI

  // Save settings
  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      setSaving(true);
      setError(null);

      const response = await settingsApi.updateSystemSettings(formData);

      if (response.success && response.data) {
        setSettings(response.data);
        setHasChanges(false);
        toast({
          title: "Settings Updated",
          message: "System settings have been updated successfully.",
          type: "success",
        });
      } else {
        setError(response.error || 'Failed to update system settings');
        toast({
          title: "Update Failed",
          message: response.error || 'Failed to update system settings',
          type: "error",
        });
      }
    } catch (err) {
      setError('Network error occurred while updating settings');
      console.error('Error updating settings:', err);
      toast({
        title: "Network Error",
        message: "Unable to update settings. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // Handle cancel (exit edit mode)
  const handleCancel = () => {
    setIsEditMode(false);
    setHasChanges(false);
    // Reset form data to original settings
    if (settings) {
      setFormData({
        defaultInvestmentInterestRate: settings.defaultInvestmentInterestRate,
        defaultLoanInterestRate: settings.defaultLoanInterestRate,
        minimumInvestmentAmount: settings.minimumInvestmentAmount,
        defaultProcessingFee: settings.defaultProcessingFee,
        maxWithdrawalPerDay: settings.maxWithdrawalPerDay,
        enableForeignInvestments: settings.enableForeignInvestments,
        autoApproveNairaInvestments: settings.autoApproveNairaInvestments,
        enableUpfrontInterestPayment: settings.enableUpfrontInterestPayment,
      });
    }
  };

  // Update save function to exit edit mode after successful save
  const handleSaveAndExit = async () => {
    await handleSave();
    if (!error) {
      setIsEditMode(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure platform defaults, thresholds, and feature flags
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Manage default rates, limits, and platform features
              </CardDescription>
              {settings && (
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {formatDate(settings.updatedAt)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  {hasChanges && (
                    <Button
                      size="sm"
                      onClick={handleSaveAndExit}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Financial Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultInvestmentInterestRate">
                  Default Investment Interest Rate (%)
                </Label>
                <Input
                  id="defaultInvestmentInterestRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.defaultInvestmentInterestRate || ''}
                  onChange={(e) => handleNumberInputChange('defaultInvestmentInterestRate', e.target.value)}
                  placeholder="5.5"
                  disabled={!isEditMode}
                />
                <p className="text-sm text-muted-foreground">
                  Default interest rate for investments when not explicitly specified
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultLoanInterestRate">
                  Default Loan Interest Rate (%)
                </Label>
                <Input
                  id="defaultLoanInterestRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.defaultLoanInterestRate || ''}
                  onChange={(e) => handleNumberInputChange('defaultLoanInterestRate', e.target.value)}
                  placeholder="15"
                  disabled={!isEditMode}
                />
                <p className="text-sm text-muted-foreground">
                  Default interest rate for loans when not explicitly specified
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumInvestmentAmount">
                  Minimum Investment Amount (₦)
                </Label>
                <Input
                  id="minimumInvestmentAmount"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.minimumInvestmentAmount || ''}
                  onChange={(e) => handleNumberInputChange('minimumInvestmentAmount', e.target.value)}
                  placeholder="10000"
                  disabled={!isEditMode}
                />
                <p className="text-sm text-muted-foreground">
                  Minimum amount required to create an investment
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultProcessingFee">
                  Default Processing Fee (%)
                </Label>
                <Input
                  id="defaultProcessingFee"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.defaultProcessingFee || ''}
                  onChange={(e) => handleNumberInputChange('defaultProcessingFee', e.target.value)}
                  placeholder="1"
                  disabled={!isEditMode}
                />
                <p className="text-sm text-muted-foreground">
                  Default processing fee percentage for loans
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="maxWithdrawalPerDay">
                  Maximum Daily Withdrawal (₦)
                </Label>
                <Input
                  id="maxWithdrawalPerDay"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.maxWithdrawalPerDay || ''}
                  onChange={(e) => handleNumberInputChange('maxWithdrawalPerDay', e.target.value)}
                  placeholder="1000000"
                  disabled={!isEditMode}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum amount that can be withdrawn per day per user
                </p>
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Feature Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Foreign Investments</div>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable foreign currency investments on the platform
                  </div>
                </div>
                <Switch
                  checked={formData.enableForeignInvestments || false}
                  onCheckedChange={(checked) => handleInputChange('enableForeignInvestments', checked)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Auto-Approve Naira Investments</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically approve Naira investments without admin review
                  </div>
                </div>
                <Switch
                  checked={formData.autoApproveNairaInvestments || false}
                  onCheckedChange={(checked) => handleInputChange('autoApproveNairaInvestments', checked)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Upfront Interest Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Enable upfront interest payment option for investments
                  </div>
                </div>
                <Switch
                  checked={formData.enableUpfrontInterestPayment || false}
                  onCheckedChange={(checked) => handleInputChange('enableUpfrontInterestPayment', checked)}
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Current Values Summary */}
          {settings && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium text-muted-foreground">Investment Rate</div>
                    <div className="text-2xl font-bold">{settings.defaultInvestmentInterestRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium text-muted-foreground">Loan Rate</div>
                    <div className="text-2xl font-bold">{settings.defaultLoanInterestRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium text-muted-foreground">Min Investment</div>
                    <div className="text-2xl font-bold">{formatCurrency(settings.minimumInvestmentAmount)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium text-muted-foreground">Processing Fee</div>
                    <div className="text-2xl font-bold">{settings.defaultProcessingFee}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium text-muted-foreground">Daily Withdrawal</div>
                    <div className="text-2xl font-bold">{formatCurrency(settings.maxWithdrawalPerDay)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium text-muted-foreground">Active Features</div>
                    <div className="text-2xl font-bold">
                      {[
                        settings.enableForeignInvestments && 'Foreign',
                        settings.autoApproveNairaInvestments && 'Auto-Approve',
                        settings.enableUpfrontInterestPayment && 'Upfront'
                      ].filter(Boolean).length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}