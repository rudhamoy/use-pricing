"use client";

import { withFeature } from "@/lib/withFeature";

function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Advanced Analytics</h1>
      <p>
        Welcome to the advanced analytics page. You can only see this if you
        have access to the "Advanced Analytics" feature.
      </p>
    </div>
  );
}

export default withFeature(AnalyticsPage, "Advanced Analytics");