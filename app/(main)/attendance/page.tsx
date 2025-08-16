"use client"

import { useState } from "react"
import { Clock, Building2, CheckCircle, LibraryBig, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useMutation, useQuery } from "@apollo/client"
import { CLOCK_IN_TO_ORG, CLOCK_OUT_OF_ORG, GET_MEMBER_ORGS } from "@/lib/graphql"
import MemberOrgs from "@/components/card/member-orgs"
import AttendanceList from "@/components/card/attendance-list"
import { toast } from "sonner"
import useLocation from "@/hooks/useLocation"
import { useSidebar } from "@/components/ui/sidebar"


interface ClockInToOrgResponse {
  clockInToOrg: boolean; 
}


interface ClockInToOrgVars {
  orgId: string;
  lat: number;
  long: number;
}


interface ClockOutOfOrgResponse {
  clockOutOfOrg: boolean; // Change type if your schema returns something else
}

// Variables for mutation
interface ClockOutOfOrgVars {
  orgId: string;
  lat: number;
  long: number;
}


export default function ClockInOutPage() {
  const [selectedOrg, setSelectedOrg] = useState("")
  const [clockInNote, setClockInNote] = useState("")
  const [clockOutNote, setClockOutNote] = useState("")
  const { data, error } = useQuery<{ GetUserMemberOrgs: {id : string; name : string}[] }>(GET_MEMBER_ORGS);
  const memberOrgs = data?.GetUserMemberOrgs || []
  const {toggleSidebar} = useSidebar();

  const [clockInToOrg] = useMutation<ClockInToOrgResponse, ClockInToOrgVars>(CLOCK_IN_TO_ORG, {
    onCompleted: (response) => {
      console.log("Clock-in successful:", response);
      toast.success("Clocked In Successfully")
    },
    onError: (err) => {
      toast.error(`Error while clocking In : ${err.message}`)
      console.error("Clock-in failed:", err.message);
    },

    refetchQueries : ["GetUserAttendance"]
  });


  const [clockOutOfOrg] = useMutation<
    ClockOutOfOrgResponse,
    ClockOutOfOrgVars
  >(CLOCK_OUT_OF_ORG, {
    onCompleted: (response) => {
      console.log("Clock-in successful:", response);
      toast.success("Clocked Out Successfully")
    },
    onError: (err) => {
      toast.error(`Error while clocking In : ${err.message}`)
      console.error("Clock-Out failed:", err.message);
    },

    refetchQueries : ["GetUserAttendance"]
  });


  const location = useLocation()


  const handleClockIn = async () => {
    // Logic will be added later
    
    try{
      if(location.loading) return;

      if(location.error) {
        toast.error(location.error);
        return
      }
      console.log("Clock in:", { selectedOrg, note: clockInNote })
      await clockInToOrg({
        variables : {
          orgId : selectedOrg,
          lat : location.location?.lat as number,
          long : location.location?.long as number
        }
      })
      setClockInNote("")
    }
    catch(err) {
      console.log(err)
    }
  }


  const handleClockOut = async () => {   
    try{
      if(location.loading) return;

      if(location.error) {
        toast.error(location.error);
        return
      }
      console.log("Clock in:", { selectedOrg, note: clockInNote })
      await clockOutOfOrg({
        variables : {
          orgId : selectedOrg,
          lat : location.location?.lat as number,
          long : location.location?.long as number
        }
      })
      setClockOutNote("")
    }
    catch(err) {
      console.log(err)
    }
  }

  if (error) {
    return <div>
      {error?.message}
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
  <div className="flex items-center gap-3">
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-9 w-9 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
    >
      <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
    
    <div className="p-2 bg-primary/10 rounded-lg">
      <LibraryBig className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Attendances</h1>
      <p className="text-sm sm:text-base text-muted-foreground">Manage your Attendance here for different Orgs</p>
    </div>
  </div>
</header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Main Clock In/Out Section */}
          <div className="lg:col-span-1">
             <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <Tabs defaultValue="clockIn" className="w-full">
          <TabsList className="grid grid-cols-2 w-full space-x-2 rounded-lg border border-gray-200 bg-gray-50 p-1 mb-3">
            <TabsTrigger
              value="clockIn"
              className="rounded-md data-[state=active]:bg-black data-[state=active]:text-white 
                        data-[state=active]:shadow-sm hover:bg-gray-200 text-sm sm:text-base font-medium
                        py-2
                        "
              >
              Clock In
            </TabsTrigger>
            <TabsTrigger
              value="clockOut"
              className="rounded-md data-[state=active]:bg-black data-[state=active]:text-white 
                        data-[state=active]:shadow-sm hover:bg-red-50 text-sm sm:text-base font-medium"
            >
              Clock Out
            </TabsTrigger>
          </TabsList>

          {/* Clock In Tab */}
          <TabsContent value="clockIn">
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-black">
                Ready to Clock In
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Select an organization and clock in to start your shift
              </CardDescription>
            </div>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Select Organization</label>
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger className="w-full h-12 border-gray-200">
                    <SelectValue placeholder="Choose your organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOrgs.length > 0 ? memberOrgs.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {org.name}
                        </div>
                      </SelectItem>
                    )) : 
                        <SelectItem value={"No Org found"}>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {"No Orgs found"}
                        </div>
                      </SelectItem>
                    }
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-200" />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-12 text-lg bg-black hover:bg-gray-800 text-white"
                    disabled={!selectedOrg}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Clock In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-black font-bold">Clock In</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      You&apos;re about to clock in to {memberOrgs.find((org) => org.id === selectedOrg)?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Add a note for your shift (optional)..."
                    value={clockInNote}
                    onChange={(e) => setClockInNote(e.target.value)}
                    className="border-gray-200 mt-2"
                  />
                  <DialogFooter>
                    <Button onClick={handleClockIn} className="w-full bg-black hover:bg-gray-800">
                      Confirm Clock In
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </TabsContent>

          {/* Clock Out Tab */}
          <TabsContent value="clockOut">
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-black">
                Ready to Clock Out
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Select an organization and clock in to start your shift
              </CardDescription>
            </div>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Select Organization</label>
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger className="w-full h-12 border-gray-200">
                    <SelectValue placeholder="Choose your organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOrgs.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {org.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-200" />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-12 text-lg bg-black hover:bg-gray-800 text-white"
                    disabled={!selectedOrg}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Clock Out
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-black font-bold">Clock Out</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      You&apos;re about to clock out of {memberOrgs.find((org) => org.id === selectedOrg)?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Add a note for your shift (optional)..."
                    value={clockOutNote}
                    onChange={(e) => setClockOutNote(e.target.value)}
                    className="border-gray-200 mt-2"
                  />
                  <DialogFooter>
                    <Button onClick={handleClockOut} className="w-full bg-black hover:bg-gray-800">
                      Confirm Clock Out
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
          </div>

          {/* Sidebar - Organizations */}
          <div className="space-y-6">

                    <MemberOrgs 
                      orgs={memberOrgs}
                      selectedOrg={selectedOrg}
                      setSelectedOrg={setSelectedOrg}
                    />
          </div>
        </div>
      </main>
      <AttendanceList/>
    </div>
  )
}