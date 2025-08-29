"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { removeFeatureFromPlan } from "../[planId]/actions";

export default function AssociatedFeatures({ plan }: { plan: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Associated Features</CardTitle>
        <CardDescription>
          The features that are included in this plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.features.map((planFeature: any) => (
            <Card key={planFeature.id}>
              <CardHeader>
                <CardTitle>{planFeature.feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {planFeature.feature.description}
                </p>
                {planFeature.config && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Configuration</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(planFeature.config).map(([key, value]) => (
                        <Badge key={key} variant="secondary">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <form
                  action={removeFeatureFromPlan.bind(
                    null,
                    plan.id,
                    planFeature.feature.id
                  )}
                  className="mt-4"
                >
                  <Button type="submit" variant="destructive" size="sm">
                    Remove
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}