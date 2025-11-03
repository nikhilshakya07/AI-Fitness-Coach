"use client";

import { UserInputForm } from "@/components/forms/UserInputForm";
import { PlanHistory } from "@/components/features/PlanHistory";
import { useRouter } from "next/navigation";
import type { FitnessPlan } from "@/lib/types";

export default function GeneratePage() {
  const router = useRouter();

  const handleLoadPlan = (plan: FitnessPlan) => {
    // Store loaded plan in sessionStorage
    sessionStorage.setItem("fitnessPlan", JSON.stringify(plan));
    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex justify-end">
        <PlanHistory onLoadPlan={handleLoadPlan} />
      </div>
      <UserInputForm />
    </div>
  );
}

