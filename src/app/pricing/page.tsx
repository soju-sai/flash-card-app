import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pricing</h1>
      <p className="text-gray-600 mb-8">
        Choose the plan that fits your learning needs. Upgrade anytime.
      </p>
      <PricingTable />
    </div>
  );
}


