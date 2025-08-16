"use client";
import { OrgLocationsCard } from "@/components/card/org-locations";
import EmployeeAttendanceChart from "@/components/card/num-present";
import AvgHoursChart from "@/components/card/avg-hours-chart";
import ClockedInEmployees  from "@/components/card/clocked-in-emp";
import { Header } from "@/components/sections/header";
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams<{ orgId : string }>()
  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>
      <div className="w-full mx-auto space-y-8 p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AvgHoursChart orgId={params.orgId[0]}/>
          <EmployeeAttendanceChart orgId={params.orgId[0]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ClockedInEmployees orgId={params.orgId[0]}/>
            <OrgLocationsCard orgId={params.orgId[0]} />
          </div>
      </div>
    </div>
  );
}