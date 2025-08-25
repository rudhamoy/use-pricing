"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function ImageGeneratorPage() {
  const { userId } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!userId) {
      return;
    }

    setError(null);

    const res = await fetch("/api/public/usage/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_MASTER_CLIENT_APP_API_KEY!,
      },
      body: JSON.stringify({
        userId,
        unitType: "Image Generation",
        amount: 1,
      }),
    });

    if (res.ok) {
      // Simulate image generation
      setImages([
        ...images,
        `https://picsum.photos/200/300?random=${Math.random()}`,
      ]);
    } else {
      const data = await res.json();
      setError(data.error || "An error occurred.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Image Generator</h1>
      <button
        onClick={generateImage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Generate Image
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {images.map((src, index) => (
          <img key={index} src={src} alt="Generated" className="rounded-md" />
        ))}
      </div>
    </div>
  );
}