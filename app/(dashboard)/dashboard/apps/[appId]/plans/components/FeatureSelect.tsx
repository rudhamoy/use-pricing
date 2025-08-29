"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import FeatureConfig from "./FeatureConfig";
import { Badge } from "@/components/ui/badge";

export default function FeatureSelect({
  appId,
  plan,
}: {
  appId: string;
  plan: any;
}) {
  const [features, setFeatures] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    plan.features.map((f: any) => f.featureId)
  );

  useEffect(() => {
    async function fetchFeatures() {
      const res = await fetch(`/api/apps/${appId}/features`);
      const data = await res.json();
      console.log("Features from API:", data);
      setFeatures(data.data);
    }
    fetchFeatures();
  }, [appId]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Features</h3>
      <input
        type="hidden"
        name="featureIds"
        value={selectedFeatures.join(",")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={cn(
              "p-4 border rounded-md cursor-pointer transition-all",
              selectedFeatures.includes(feature.id)
                ? "border-primary ring-2 ring-primary"
                : "hover:border-primary/50"
            )}
          >
            <div
              onClick={() => toggleFeature(feature.id)}
              className="flex items-center justify-between"
            >
              <h4
                className={cn(
                  "font-semibold",
                  selectedFeatures.includes(feature.id) && "text-primary"
                )}
              >
                {feature.name}
              </h4>
              {selectedFeatures.includes(feature.id) && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
            {plan.features.find((f: any) => f.featureId === feature.id)
              ?.config && (
              <div className="mt-4">
                <h4 className="font-semibold">Configuration</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(
                    plan.features.find((f: any) => f.featureId === feature.id)
                      .config
                  ).map(([key, value]) => (
                    <Badge key={key} variant="secondary">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {selectedFeatures.includes(feature.id) && (
              <div className="mt-4">
                <FeatureConfig
                  planFeature={
                    plan.features.find(
                      (f: any) => f.featureId === feature.id
                    ) || {
                      planId: plan.id,
                      featureId: feature.id,
                      config: {},
                    }
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}