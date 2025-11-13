import {
  PlatformSettings,
  UpdatePlatformSettingsInput,
  PricingRule,
  CreatePricingRuleInput,
  UpdatePricingRuleInput
} from "../types/pricing";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const response = await fetch("/api/admin/pricing/settings", {
    credentials: "include"
  });
  return handleResponse<PlatformSettings>(response);
}

export async function updatePlatformSettings(
  input: UpdatePlatformSettingsInput
): Promise<PlatformSettings> {
  const response = await fetch("/api/admin/pricing/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(input)
  });
  return handleResponse<PlatformSettings>(response);
}

export async function fetchPricingRules(): Promise<PricingRule[]> {
  const response = await fetch("/api/admin/pricing/rules", {
    credentials: "include"
  });
  return handleResponse<PricingRule[]>(response);
}

export async function createPricingRule(
  input: CreatePricingRuleInput
): Promise<PricingRule> {
  const response = await fetch("/api/admin/pricing/rules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(input)
  });
  return handleResponse<PricingRule>(response);
}

export async function updatePricingRule(
  ruleId: string,
  input: UpdatePricingRuleInput
): Promise<PricingRule> {
  const response = await fetch(`/api/admin/pricing/rules/${ruleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(input)
  });
  return handleResponse<PricingRule>(response);
}

export async function deletePricingRule(ruleId: string): Promise<void> {
  const response = await fetch(`/api/admin/pricing/rules/${ruleId}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to delete pricing rule");
  }
}
