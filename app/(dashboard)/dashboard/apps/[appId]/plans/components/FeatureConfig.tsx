"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { updateFeatureConfig } from "../[planId]/actions";

export default function FeatureConfig({
  planFeature,
}: {
  planFeature: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Feature</DialogTitle>
          <DialogDescription>
            Configure the details of this feature for this plan.
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updateFeatureConfig(planFeature.id, formData);
            setIsOpen(false);
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="config" className="text-right">
                Config (JSON)
              </Label>
              <Textarea
                id="config"
                name="config"
                placeholder={'{\n  "limit": 10\n}'}
                defaultValue={
                  planFeature.config
                    ? JSON.stringify(planFeature.config, null, 2)
                    : '{\n  "limit": 10\n}'
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}