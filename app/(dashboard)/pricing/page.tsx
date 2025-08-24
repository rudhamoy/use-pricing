async function getPlans() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/public/plans/${process.env.MASTER_CLIENT_APP_ID}`,
    {
      headers: {
        "x-api-key": process.env.MASTER_CLIENT_APP_API_KEY!,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch plans");
  }

  const data = await res.json();
  return data.data;
}

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Our Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan: any) => (
          <div key={plan.id} className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-gray-500">{plan.description}</p>
            <p className="text-2xl font-bold mt-4">${plan.baseFee}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature: any) => (
                <li key={feature.id} className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature.feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}