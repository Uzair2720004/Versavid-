'use client';
import { Topbar } from '@/components/dashboard/Topbar';
import AmbientField from '@/components/dashboard/AmbientField';
import UsageHeader from '@/components/credits/UsageHeader';
import PlanCards from '@/components/credits/PlanCards';
import CreditPacks from '@/components/credits/CreditPacks';
import ComparisonTable from '@/components/credits/ComparisonTable';
import PricingFAQ from '@/components/credits/PricingFAQ';
import PricingCTA from '@/components/credits/PricingCTA';

export default function CreditsPage() {
  return (
    <div className="relative bg-black min-h-screen flex">
      <div className="fixed inset-0 z-0 pointer-events-none"><AmbientField variant="mixed" /></div>
      <div className="relative z-10 flex w-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <UsageHeader />
            <div className="pb-12">
              <PlanCards />
              <CreditPacks />
              <ComparisonTable />
              <PricingFAQ />
              <PricingCTA />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
