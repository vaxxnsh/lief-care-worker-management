"use client";
import { OrgLocationsCard } from "@/components/card/org-locations";
import EmployeeAttendanceChart from "@/components/card/num-present";
import AvgHoursChart from "@/components/card/profit-overview";
import ClockedInEmployees  from "@/components/card/present-employees";
import { Header } from "@/components/sections/header";
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
  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>
      <div className="w-full mx-auto space-y-8 p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AvgHoursChart orgId="35e45dd3-7f4a-422b-a3eb-3f240a10b88e" />
          <EmployeeAttendanceChart orgId="35e45dd3-7f4a-422b-a3eb-3f240a10b88e" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ClockedInEmployees/>
            <OrgLocationsCard orgId="35e45dd3-7f4a-422b-a3eb-3f240a10b88e" />
          </div>
      </div>
    </div>
  );
}