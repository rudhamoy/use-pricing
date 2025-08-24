"use client";

import { useState } from "react";

export default function AdvancedPricingForm() {
  const [pricingModel, setPricingModel] = useState("subscription");

  return (
    <div className="flex flex-col gap-4">
      <select
        name="pricingModel"
        value={pricingModel}
        onChange={(e) => setPricingModel(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="subscription">Subscription</option>
        <option value="pay-as-you-go">Pay-as-you-go</option>
        <option value="tiered">Tiered</option>
      </select>

      {pricingModel === "subscription" && (
        <>
          <input
            type="number"
            name="baseFee"
            placeholder="Base Fee"
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="billingCycle"
            placeholder="Billing Cycle (e.g., monthly, yearly)"
            className="p-2 border rounded-md"
            required
          />
        </>
      )}

      {pricingModel === "pay-as-you-go" && (
        <input
          type="number"
          name="ratePerUnit"
          placeholder="Rate Per Unit"
          className="p-2 border rounded-md"
          required
        />
      )}

      {pricingModel === "tiered" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tiers</h3>
          {/* TODO: Implement UI for adding/removing tiers */}
          <div className="flex gap-2">
            <input
              type="number"
              name="tierUpTo"
              placeholder="Up to"
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              name="tierPrice"
              placeholder="Price"
              className="p-2 border rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}