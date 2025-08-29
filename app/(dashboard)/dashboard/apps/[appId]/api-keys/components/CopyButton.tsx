"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigator.clipboard.writeText(text)}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}