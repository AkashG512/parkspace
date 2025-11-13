import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
import {
  fetchPlatformSettings,
  updatePlatformSettings,
  fetchPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule
} from "../services/pricingService";
import type { CreatePricingRuleInput, PricingRule } from "../types/pricing";

export default function PricingControl() {
  const queryClient = useQueryClient();
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [commission, setCommission] = useState("");
  const [bookingFee, setBookingFee] = useState("");

  const [ruleForm, setRuleForm] = useState<CreatePricingRuleInput>({
    name: "",
    scope: "global",
    baseRate: 0,
    priority: 100,
    isActive: true,
    conditions: {},
    adjustments: []
  });
  const [cityList, setCityList] = useState("");
  const [postalCodeList, setPostalCodeList] = useState("");
  const [listingTypeList, setListingTypeList] = useState("");
  const [featureList, setFeatureList] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: fetchPlatformSettings
  });

  const { data: rules = [] } = useQuery({
    queryKey: ["pricingRules"],
    queryFn: fetchPricingRules
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updatePlatformSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setIsSettingsDialogOpen(false);
    }
  });

  const createRuleMutation = useMutation({
    mutationFn: createPricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricingRules"] });
      setIsRuleDialogOpen(false);
      resetRuleForm();
    }
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ ruleId, input }: { ruleId: string; input: any }) =>
      updatePricingRule(ruleId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricingRules"] });
      setIsRuleDialogOpen(false);
      resetRuleForm();
      setEditingRule(null);
    }
  });

  const deleteRuleMutation = useMutation({
    mutationFn: deletePricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricingRules"] });
    }
  });

  const openSettingsDialog = () => {
    const commissionValue = settings?.providerCommissionPercentage ?? 15;
    const bookingFeeValue = settings?.platformBookingFee ?? 99;

    setCommission(commissionValue.toString());
    setBookingFee((bookingFeeValue / 100).toFixed(2));
    setIsSettingsDialogOpen(true);
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      providerCommissionPercentage: parseFloat(commission),
      platformBookingFee: Math.round(parseFloat(bookingFee) * 100)
    });
  };

  const resetRuleForm = () => {
    setRuleForm({
      name: "",
      scope: "global",
      baseRate: 0,
      priority: 100,
      isActive: true,
      conditions: {},
      adjustments: []
    });
    setCityList("");
    setPostalCodeList("");
    setListingTypeList("");
    setFeatureList("");
  };

  const openCreateRuleDialog = () => {
    resetRuleForm();
    setEditingRule(null);
    setIsRuleDialogOpen(true);
  };

  const openEditRuleDialog = (rule: PricingRule) => {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      scope: rule.scope,
      description: rule.description,
      baseRate: rule.baseRate,
      priority: rule.priority,
      isActive: rule.isActive,
      conditions: rule.conditions,
      adjustments: rule.adjustments
    });
    setCityList((rule.conditions.cities ?? []).join(", "));
    setPostalCodeList((rule.conditions.postalCodePrefixes ?? []).join(", "));
    setListingTypeList((rule.conditions.listingTypes ?? []).join(", "));
    setFeatureList((rule.conditions.features ?? []).join(", "));
    setIsRuleDialogOpen(true);
  };

  const handleSaveRule = () => {
    const conditions = {
      ...(cityList.trim() && { cities: cityList.split(",").map((c) => c.trim()).filter(Boolean) }),
      ...(postalCodeList.trim() && { postalCodePrefixes: postalCodeList.split(",").map((c) => c.trim()).filter(Boolean) }),
      ...(listingTypeList.trim() && { listingTypes: listingTypeList.split(",").map((c) => c.trim()).filter(Boolean) }),
      ...(featureList.trim() && { features: featureList.split(",").map((c) => c.trim()).filter(Boolean) })
    };

    const payload = {
      ...ruleForm,
      conditions
    };

    if (editingRule) {
      updateRuleMutation.mutate({
        ruleId: editingRule._id,
        input: payload
      });
    } else {
      createRuleMutation.mutate(payload);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-wide">Pricing Control</h1>
          <p className="text-muted-foreground mt-2">
            Manage platform fees and pricing rules
          </p>
        </div>
        <Button onClick={openCreateRuleDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Pricing Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Global commission and booking fees</CardDescription>
            </div>
            <Button variant="outline" onClick={openSettingsDialog}>
              Edit Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Provider Commission</p>
              <p className="text-3xl font-semibold">
                {settings?.providerCommissionPercentage}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Booking Fee</p>
              <p className="text-3xl font-semibold">
                ${(settings?.platformBookingFee ?? 0) / 100}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules</CardTitle>
          <CardDescription>
            Configure base rates and adjustments by location and listing type
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No pricing rules configured. Add your first rule to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule._id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{rule.scope}</Badge>
                    </div>
                    {rule.description && (
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    )}
                    <p className="text-sm">
                      <span className="text-muted-foreground">Base Rate:</span>{" "}
                      <span className="font-medium">${rule.baseRate}/hr</span>
                      {" · "}
                      <span className="text-muted-foreground">Priority:</span>{" "}
                      <span className="font-medium">{rule.priority}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {rule.conditions.cities?.map((city) => (
                        <Badge key={city} variant="outline">City: {city}</Badge>
                      ))}
                      {rule.conditions.postalCodePrefixes?.map((prefix) => (
                        <Badge key={prefix} variant="outline">ZIP: {prefix}</Badge>
                      ))}
                      {rule.conditions.listingTypes?.map((type) => (
                        <Badge key={type} variant="outline">Type: {type}</Badge>
                      ))}
                      {rule.conditions.features?.map((feature) => (
                        <Badge key={feature} variant="outline">Feature: {feature}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditRuleDialog(rule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRuleMutation.mutate(rule._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Platform Settings</DialogTitle>
            <DialogDescription>
              Update global commission and booking fees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commission">Provider Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                placeholder="15"
              />
            </div>
            <div>
              <Label htmlFor="bookingFee">Platform Booking Fee ($)</Label>
              <Input
                id="bookingFee"
                type="number"
                min="0"
                step="0.01"
                value={bookingFee}
                onChange={(e) => setBookingFee(e.target.value)}
                placeholder="0.99"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Pricing Rule" : "Create Pricing Rule"}
            </DialogTitle>
            <DialogDescription>
              Configure base rates and conditions for pricing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={ruleForm.name}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, name: e.target.value })
                }
                placeholder="Downtown NYC"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={ruleForm.description || ""}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, description: e.target.value })
                }
                placeholder="Pricing rule for downtown Manhattan"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="scope">Scope</Label>
              <Select
                value={ruleForm.scope}
                onValueChange={(value) =>
                  setRuleForm({ ...ruleForm, scope: value as typeof ruleForm.scope })
                }
              >
                <SelectTrigger id="scope">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="postalCodePrefix">Postal Code Prefix</SelectItem>
                  <SelectItem value="listingType">Listing Type</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="baseRate">Base Rate ($/hour)</Label>
              <Input
                id="baseRate"
                type="number"
                min="0"
                step="0.01"
                value={ruleForm.baseRate}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, baseRate: parseFloat(e.target.value) || 0 })
                }
                placeholder="5.00"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={ruleForm.priority}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, priority: parseInt(e.target.value) || 100 })
                }
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers have higher priority
              </p>
            </div>
            <div>
              <Label htmlFor="cities">Cities (comma separated)</Label>
              <Textarea
                id="cities"
                value={cityList}
                onChange={(e) => setCityList(e.target.value)}
                placeholder="New York, Brooklyn"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="postalCodes">Postal Code Prefixes</Label>
              <Textarea
                id="postalCodes"
                value={postalCodeList}
                onChange={(e) => setPostalCodeList(e.target.value)}
                placeholder="902, 100"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="listingTypes">Listing Types</Label>
              <Textarea
                id="listingTypes"
                value={listingTypeList}
                onChange={(e) => setListingTypeList(e.target.value)}
                placeholder="garage, driveway, lot"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="features">Features</Label>
              <Textarea
                id="features"
                value={featureList}
                onChange={(e) => setFeatureList(e.target.value)}
                placeholder="EV Charging, Covered"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={ruleForm.isActive}
                onCheckedChange={(checked) =>
                  setRuleForm({ ...ruleForm, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRuleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? "Update" : "Create"} Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
