"use client";
import { MetricCard } from "@/components/card/metric-card";
import { OrgLocationsCard } from "@/components/card/org-locations";
import { ProfitChart } from "@/components/card/profit-chart";
import { PaymentsOverview } from "@/components/card/profit-overview";
import { TopChannels } from "@/components/card/top-channels";
import { Header } from "@/components/sections/header";
import { DollarSign, Eye, Package, Users } from "lucide-react";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (status === "authenticated") {
    return <Dashboard />;
  }

  return null;
}


function Dashboard() {
  const metrics = [
    {
      title: 'Total Views',
      value: '3.5K',
      change: '0.43%',
      isPositive: true,
      icon: <Eye className="h-6 w-6 text-white" />,
      iconBgColor: 'bg-green-500',
    },
    {
      title: 'Total Profit',
      value: '$4.2K',
      change: '4.35%',
      isPositive: true,
      icon: <DollarSign className="h-6 w-6 text-white" />,
      iconBgColor: 'bg-orange-500',
    },
    {
      title: 'Total Products',
      value: '3.5K',
      change: '2.69%',
      isPositive: true,
      icon: <Package className="h-6 w-6 text-white" />,
      iconBgColor: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: '3.5K',
      change: '-0.95%',
      isPositive: false,
      icon: <Users className="h-6 w-6 text-white" />,
      iconBgColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>
      <div className="w-full mx-auto space-y-8 p-4 md:p-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PaymentsOverview />
          <ProfitChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopChannels />
            <OrgLocationsCard orgId="35e45dd3-7f4a-422b-a3eb-3f240a10b88e" />
          </div>
      </div>
    </div>
  );
}