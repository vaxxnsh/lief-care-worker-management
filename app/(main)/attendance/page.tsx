"use client"

import { useState } from "react"
import { Clock, MapPin, Building2, Users, CheckCircle, XCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data - replace with actual data from your GraphQL queries
const mockOrganizations = [
  { id: "1", name: "Healthcare Center North" },
  { id: "2", name: "Community Care South" },
  { id: "3", name: "Senior Living West" },
]

const mockCurrentStatus = {
  isClockedIn: false,
  currentOrg: null,
  clockInTime: null,
  location: "Outside perimeter",
}

export default function ClockInOutPage() {
  const [selectedOrg, setSelectedOrg] = useState("")
  const [clockInNote, setClockInNote] = useState("")
  const [clockOutNote, setClockOutNote] = useState("")
  const [isWithinPerimeter, setIsWithinPerimeter] = useState(false)
  const [currentStatus, ] = useState(mockCurrentStatus)

  const handleClockIn = () => {
    // Logic will be added later
    console.log("Clock in:", { selectedOrg, note: clockInNote })
    setClockInNote("")
  }

  const handleClockOut = () => {
    // Logic will be added later
    console.log("Clock out:", { note: clockOutNote })
    setClockOutNote("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Time Tracking</h1>
              <p className="text-base text-gray-600 mt-1">Manage your clock-ins and clock-outs</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={isWithinPerimeter ? "default" : "destructive"}
                className="text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                <MapPin className="w-4 h-4 mr-1" />
                {isWithinPerimeter ? "Within Perimeter" : "Outside Perimeter"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Clock In/Out Section */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-black">
                  {currentStatus.isClockedIn ? "Currently Clocked In" : "Ready to Clock In"}
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {currentStatus.isClockedIn
                    ? `Started at ${currentStatus.clockInTime || "9:00 AM"} • ${currentStatus.currentOrg || "Healthcare Center North"}`
                    : "Select an organization and clock in to start your shift"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Organization Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Select Organization</label>
                  <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                    <SelectTrigger className="w-full h-12 border-gray-200">
                      <SelectValue placeholder="Choose your organization..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOrganizations.map((org) => (
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

                {/* Clock In/Out Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!currentStatus.isClockedIn ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-black hover:bg-gray-800 text-white transition-colors"
                          disabled={!selectedOrg || !isWithinPerimeter}
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Clock In
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-black font-bold">Clock In</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            You&apos;re about to clock in to {mockOrganizations.find((org) => org.id === selectedOrg)?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-black">
                              Add a note for your shift (optional)
                            </label>
                            <Textarea
                              placeholder="Add a note for your shift (optional)..."
                              value={clockInNote}
                              onChange={(e) => setClockInNote(e.target.value)}
                              className="mt-2 border-gray-200"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleClockIn} className="w-full bg-black hover:bg-gray-800">
                            Confirm Clock In
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 h-12 sm:h-14 text-base sm:text-lg border-red-200 text-red-600 hover:bg-red-50 bg-white"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Clock Out
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-black font-bold">Clock Out</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            You&apos;re about to clock out from your current shift
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-black">
                              Add a note about your shift (optional)
                            </label>
                            <Textarea
                              placeholder="Add a note about your shift (optional)..."
                              value={clockOutNote}
                              onChange={(e) => setClockOutNote(e.target.value)}
                              className="mt-2 border-gray-200"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleClockOut} className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Confirm Clock Out
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Location Warning */}
                {!isWithinPerimeter && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">
                        You are outside the allowed perimeter. Please move closer to your workplace to clock in.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Organizations */}
          <div className="space-y-6">
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black flex items-center">
                  <Users className="w-5 h-5 mr-2 text-gray-600" />
                  Your Organizations
                </CardTitle>
                <CardDescription className="text-gray-600">Organizations you&apos;re a member of</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockOrganizations.map((org) => (
                  <div
                    key={org.id}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                      selectedOrg === org.id ? "border-gray-300 bg-gray-50" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedOrg(org.id)}
                  >
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-black">{org.name}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white border-gray-200 text-black hover:bg-gray-50"
                  onClick={() => setIsWithinPerimeter(!isWithinPerimeter)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Toggle Location Status
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white border-gray-200 text-black hover:bg-gray-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Time History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
