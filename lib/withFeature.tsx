import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function withFeature(
  WrappedComponent: React.ComponentType,
  featureName: string
) {
  return function FeatureComponent(props: any) {
    const { userId } = useAuth();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      async function checkAccess() {
        if (!userId) {
          return;
        }

        const res = await fetch("/api/public/features/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_MASTER_CLIENT_APP_API_KEY!,
          },
          body: JSON.stringify({ userId, featureName }),
        });

        if (res.ok) {
          const data = await res.json();
          setHasAccess(data.data.hasAccess);
        }
      }

      checkAccess();
    }, [userId]);

    if (hasAccess) {
      return <WrappedComponent {...props} />;
    }

    return <div>You do not have access to this feature.</div>;
  };
}