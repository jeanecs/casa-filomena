"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Calendar, DollarSign, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type PricingRule = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  price: number;
  isActive: boolean;
};

type DatePrice = {
  date: string;
  price: number;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function PricingManager({ villaId, onPricingChange }: { villaId: number; onPricingChange?: () => void }) {
  const [basePrice, setBasePrice] = useState<number>(150);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [customDates, setCustomDates] = useState<DatePrice[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states for new pricing rule
  const [newRule, setNewRule] = useState({
    name: "",
    startDate: "",
    endDate: "",
    price: 0,
  });

  // Form states for custom date pricing
  const [customDate, setCustomDate] = useState("");
  const [customPrice, setCustomPrice] = useState<number>(0);

  // Restore rules and base price from localStorage on mount and when villa changes
  useEffect(() => {
    try {
      const rulesKey = `pricing_rules_villa_${villaId}`;
      const basePriceKey = `base_price_villa_${villaId}`;
      
      const savedRules = localStorage.getItem(rulesKey);
      if (savedRules) {
        const parsed = JSON.parse(savedRules);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPricingRules(parsed);
        }
      }
      
      const savedBasePrice = localStorage.getItem(basePriceKey);
      if (savedBasePrice) {
        const price = Number(savedBasePrice);
        if (price > 0) setBasePrice(price);
        else setBasePrice(150);
      } else {
        // Reset to default before fetching so we don't leak prior villa's base price
        setBasePrice(150);
      }
    } catch {}
    fetchPricingData();
  }, [villaId]);

  // Persist rules to localStorage whenever they change
  useEffect(() => {
    if (pricingRules.length > 0) {
      try {
        const key = `pricing_rules_villa_${villaId}`;
        localStorage.setItem(key, JSON.stringify(pricingRules));
      } catch {}
    }
  }, [pricingRules, villaId]);

  // Persist base price to localStorage whenever it changes
  useEffect(() => {
    if (basePrice > 0) {
      try {
        const key = `base_price_villa_${villaId}`;
        localStorage.setItem(key, String(basePrice));
      } catch {}
    }
  }, [basePrice, villaId]);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/availability/${villaId}`);
      if (!res.ok) throw new Error("Failed to fetch pricing data");
      
      const data = await res.json();
      // Process the data to extract base price and custom pricing
      const savedBasePriceStr = localStorage.getItem(`base_price_villa_${villaId}`);
      const savedBasePriceNum = savedBasePriceStr ? Number(savedBasePriceStr) : null;
      if (Number.isFinite(savedBasePriceNum) && savedBasePriceNum! > 0) {
        setBasePrice(savedBasePriceNum!);
      }

      if (data.pricingData && data.pricingData.length > 0) {
        // If no saved base price, use the first pricingData price as a stable default
        if (!savedBasePriceStr) {
          const firstPrice = data.pricingData[0]?.price;
          if (typeof firstPrice === "number" && firstPrice > 0) {
            setBasePrice(firstPrice);
          }
        }
        
        // Extract custom date pricing
        const customPricing = data.pricingData
          .map((d: any) => ({ date: d.date, price: d.price }));
        
        setCustomDates(customPricing);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading pricing data");
    } finally {
      setLoading(false);
    }
  };

  const updateBasePrice = async () => {
    try {
      const res = await fetch(`/api/availability/${villaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basePrice }),
      });

      if (!res.ok) throw new Error("Failed to update base price");
      toast.success("Base price updated successfully");
      // Persist immediately to localStorage so reloads keep the value
      try {
        localStorage.setItem(`base_price_villa_${villaId}`, String(basePrice));
      } catch {}
      fetchPricingData();
      onPricingChange?.();
    } catch (error) {
      console.error(error);
      toast.error("Error updating base price");
    }
  };

  const addPricingRule = () => {
    if (!newRule.name || !newRule.startDate || !newRule.endDate || newRule.price <= 0) {
      toast.error("Please fill in all fields");
      return;
    }

    const rule: PricingRule = {
      id: Date.now().toString(),
      name: newRule.name,
      startDate: newRule.startDate,
      endDate: newRule.endDate,
      price: newRule.price,
      isActive: true,
    };

    setPricingRules([...pricingRules, rule]);
    setNewRule({ name: "", startDate: "", endDate: "", price: 0 });
    applySingleRule(rule);
    toast.success("Pricing rule added");
  };

  const removePricingRule = (id: string) => {
    setPricingRules(pricingRules.filter((r) => r.id !== id));
    toast.success("Pricing rule removed");
  };

  const toggleRuleStatus = (id: string) => {
    setPricingRules((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r));
      const changed = updated.find((r) => r.id === id);
      if (changed && changed.isActive) {
        // When enabling a rule, apply it immediately
        applySingleRule(changed);
      }
      return updated;
    });
  };

  const addCustomDatePrice = async () => {
    if (!customDate || customPrice <= 0) {
      toast.error("Please enter a valid date and price");
      return;
    }

    const existing = customDates.find((d) => d.date === customDate);
    if (existing) {
      setCustomDates(
        customDates.map((d) => (d.date === customDate ? { ...d, price: customPrice } : d))
      );
      toast.success("Date price updated");
    } else {
      setCustomDates([...customDates, { date: customDate, price: customPrice }]);
      toast.success("Custom date price added");
    }

    try {
      // Persist immediately
      const res = await fetch(`/api/availability/${villaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: [{ date: customDate, price: customPrice }] }),
      });
      if (!res.ok) throw new Error("Failed to save custom date price");
      onPricingChange?.();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save custom date to server");
    } finally {
      setCustomDate("");
      setCustomPrice(0);
    }
  };

  const removeCustomDate = (date: string) => {
    setCustomDates(customDates.filter((d) => d.date !== date));
    toast.success("Custom date removed");
  };

  const applyBulkPricing = async () => {
    try {
      setLoading(true);
      
      // Apply pricing rules to date ranges
      const updates = [];
      for (const rule of pricingRules.filter((r) => r.isActive)) {
        const start = new Date(rule.startDate);
        const end = new Date(rule.endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split("T")[0];
          updates.push({ date: dateStr, price: rule.price });
        }
      }

      // Add custom dates
      updates.push(...customDates);

      const res = await fetch(`/api/availability/${villaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates, basePrice }),
      });

      if (!res.ok) throw new Error("Failed to apply pricing");
      
      toast.success("Pricing applied successfully");
      fetchPricingData();
      onPricingChange?.();
    } catch (error) {
      console.error(error);
      toast.error("Error applying pricing");
    } finally {
      setLoading(false);
    }
  };

  // Helper: apply one rule to the server immediately
  async function applySingleRule(rule: PricingRule) {
    try {
      const updates: Array<{ date: string; price: number }> = [];
      const start = new Date(rule.startDate);
      const end = new Date(rule.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        updates.push({ date: dateStr, price: rule.price });
      }

      const res = await fetch(`/api/availability/${villaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error("Failed to apply rule");
      fetchPricingData();
      onPricingChange?.();
    } catch (e) {
      console.error(e);
      toast.error("Failed to apply pricing rule to server");
    }
  }

  return (
    <div className="space-y-6">
      {/* Base Price */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Base Nightly Rate</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                placeholder="Base price"
                min="0"
                step="10"
              />
              <p className="text-sm text-gray-500 mt-1">
                Default price applied to all dates without custom pricing
              </p>
            </div>
            <Button onClick={updateBasePrice} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Update Base Price
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Seasonal Pricing Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Rule */}
          <div className="grid md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="Rule name (e.g., Summer)"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            />
            <Input
              type="date"
              value={newRule.startDate}
              onChange={(e) => setNewRule({ ...newRule, startDate: e.target.value })}
            />
            <Input
              type="date"
              value={newRule.endDate}
              onChange={(e) => setNewRule({ ...newRule, endDate: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newRule.price || ""}
              onChange={(e) => setNewRule({ ...newRule, price: Number(e.target.value) })}
              min="0"
            />
            <Button onClick={addPricingRule} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {/* Existing Rules */}
          <div className="space-y-2">
            {pricingRules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  rule.isActive ? "bg-white" : "bg-gray-100"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(rule.startDate).toLocaleDateString()} -{" "}
                    {new Date(rule.endDate).toLocaleDateString()} • {formatPrice(rule.price)}/night
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRuleStatus(rule.id)}
                  >
                    {rule.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePricingRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {pricingRules.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No pricing rules yet. Add rules to apply seasonal or special pricing.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Date Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Custom Date Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Custom Date */}
          <div className="grid md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
            <Input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price for this date"
              value={customPrice || ""}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              min="0"
            />
            <Button onClick={addCustomDatePrice} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Date
            </Button>
          </div>

          {/* Custom Dates List */}
          <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
            {customDates
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((item) => (
                <div
                  key={item.date}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)}/night</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeCustomDate(item.date)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

            {customDates.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No custom dates set. Add specific dates with custom pricing.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply All */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={applyBulkPricing}
          disabled={loading}
          className="min-w-48"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? "Applying..." : "Apply All Pricing Changes"}
        </Button>
      </div>
    </div>
  );
}
