"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function ImageGeneratorPage() {
  const { userId } = useAuth();
  const [images, setImages] = useState<string[]>([]);

  const generateImage = async () => {
    if (!userId) {
      return;
    }

    // Record usage
    await fetch("/api/public/usage/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_MASTER_CLIENT_APP_API_KEY!,
      },
      body: JSON.stringify({
        userId,
        unitType: "image_generation",
        amount: 1,
      }),
    });

    // Simulate image generation
    setImages([...images, `https://picsum.photos/200/300?random=${Math.random()}`]);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {images.map((src, index) => (
          <img key={index} src={src} alt="Generated" className="rounded-md" />
        ))}
      </div>
    </div>
  );
}