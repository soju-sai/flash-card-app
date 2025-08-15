import { PricingTable } from "@clerk/nextjs";
import { Trans } from "@/components/Trans";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6"><Trans k="pricing.title" /></h1>
      <p className="text-gray-600 mb-8"><Trans k="pricing.subtitle" /></p>
      <PricingTable />
    </div>
  );
}


