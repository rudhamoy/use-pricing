"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [appName, setAppName] = useState("");
  const [clientName, setClientName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Create the client
    const clientRes = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: clientName }),
    });

    if (!clientRes.ok) {
      console.error("Failed to create client");
      return;
    }

    // Step 2: Create the client app
    const appRes = await fetch("/api/client-apps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: appName }),
    });

    if (appRes.ok) {
      router.push("/dashboard");
    } else {
      // Handle error
      console.error("Failed to create client app");
    }
  };

  return (
    <div>
      <h1>Welcome! Let's get you set up.</h1>
      <p>First, let's get some details about you and your first application.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="clientName">Your Name or Company Name</label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
        <label htmlFor="appName">Application Name</label>
        <input
          id="appName"
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          required
        />
        <button type="submit">Create Application</button>
      </form>
    </div>
  );
}