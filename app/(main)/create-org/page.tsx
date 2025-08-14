"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Trash2, Users, Calendar, MapPin, UserMinus, UserPlus } from "lucide-react"
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"

interface Organization {
  id: string
  name: string
  createdAt?: string
  memberCount?: number
  locationCount?: number
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "Acme Corporation",
      createdAt: "2024-01-15",
      memberCount: 24,
      locationCount: 3,
    },
    {
      id: "2",
      name: "Tech Innovators Inc",
      createdAt: "2024-02-20",
      memberCount: 12,
      locationCount: 1,
    },
    {
      id: "3",
      name: "Global Solutions Ltd",
      createdAt: "2024-03-10",
      memberCount: 45,
      locationCount: 7,
    },
  ])

  const [newOrgName, setNewOrgName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState("")
  const [memberId, setMemberId] = useState("")
  const [memberRole, setMemberRole] = useState("1")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isRemovingMember, setIsRemovingMember] = useState(false)

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      toast.error("Organization name is required")
      return
    }

    setIsCreating(true)

    try {
      // Simulate API call - replace with actual GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newOrg: Organization = {
        id: Date.now().toString(),
        name: newOrgName.trim(),
        createdAt: new Date().toISOString().split("T")[0],
        memberCount: 1,
        locationCount: 0,
      }

      setOrganizations((prev) => [...prev, newOrg])
      setNewOrgName("")
      setIsCreateDialogOpen(false)
      toast.success(`Organization "${newOrg.name}" created successfully`)
    } catch (error) {
        console.log(error)
        toast.error("Failed to create organization")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteOrganization = async (orgId: string, orgName: string) => {
    try {
      // Simulate API call - replace with actual GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOrganizations((prev) => prev.filter((org) => org.id !== orgId))

      toast.success(`Organization "${orgName}" deleted successfully`)
    } 
    catch (error) {
        console.log(error)
        toast.error("Failed to delete organization")
    }
  }

  const handleAddMember = async () => {
    if (!memberId.trim()) {
      toast.error("Member ID is required")
      return
    }

    setIsAddingMember(true)

    try {
      // Simulate API call - replace with actual GraphQL mutation: addMemberToOrg
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update member count
      setOrganizations((prev) =>
        prev.map((org) => (org.id === selectedOrgId ? { ...org, memberCount: (org.memberCount || 0) + 1 } : org)),
      )

      setMemberId("")
      setMemberRole("1")
      setAddMemberDialogOpen(false)

      const orgName = organizations.find((org) => org.id === selectedOrgId)?.name
      toast.success(`Member added to "${orgName}" successfully`)
    } catch (error) {
      console.log(error)
      toast.error("Failed to add member")
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!memberId.trim()) {
      toast.error("Member ID is required")
      return
    }

    setIsRemovingMember(true)

    try {
      // Simulate API call - replace with actual GraphQL mutation: removeMemberFromOrg
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update member count
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === selectedOrgId ? { ...org, memberCount: Math.max((org.memberCount || 0) - 1, 0) } : org,
        ),
      )

      setMemberId("")
      setRemoveMemberDialogOpen(false)

      const orgName = organizations.find((org) => org.id === selectedOrgId)?.name
      toast.success(`Member removed from "${orgName}" successfully`)
    } catch (error) {
      console.log(error)
      toast.error("Failed to remove member")
    } finally {
      setIsRemovingMember(false)
    }
  }

  const openAddMemberDialog = (orgId: string) => {
    setSelectedOrgId(orgId)
    setAddMemberDialogOpen(true)
  }

  const openRemoveMemberDialog = (orgId: string) => {
    setSelectedOrgId(orgId)
    setRemoveMemberDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
              <p className="text-muted-foreground">Manage your organizations and teams</p>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Create New Organization
                </DialogTitle>
                <DialogDescription>
                  Enter a name for your new organization. You can always change this later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    placeholder="Enter organization name..."
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateOrganization()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateOrganization}
                  disabled={isCreating || !newOrgName.trim()}
                  className="gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


           <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Member
              </DialogTitle>
              <DialogDescription>Add a new member to the organization by entering their unique ID.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-id">Member ID</Label>
                <Input
                  id="member-id"
                  placeholder="Enter member's unique ID..."
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-role">Role</Label>
                <Select value={memberRole} onValueChange={setMemberRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Member</SelectItem>
                    <SelectItem value="2">Admin</SelectItem>
                    <SelectItem value="3">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)} disabled={isAddingMember}>
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={isAddingMember || !memberId.trim()}
                className="gap-2 bg-black text-white hover:bg-black/90"
              >
                {isAddingMember ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Dialog open={removeMemberDialogOpen} onOpenChange={setRemoveMemberDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserMinus className="h-5 w-5" />
                Remove Member
              </DialogTitle>
              <DialogDescription>Remove a member from the organization by entering their unique ID.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="remove-member-id">Member ID</Label>
                <Input
                  id="remove-member-id"
                  placeholder="Enter member's unique ID..."
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRemoveMemberDialogOpen(false)} disabled={isRemovingMember}>
                Cancel
              </Button>
              <Button
                onClick={handleRemoveMember}
                disabled={isRemovingMember || !memberId.trim()}
                variant="destructive"
                className="gap-2"
              >
                {isRemovingMember ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Removing...
                  </>
                ) : (
                  <>
                    <UserMinus className="h-4 w-4" />
                    Remove Member
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>

        {/* Organizations Grid */}
        {organizations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No organizations yet</h3>
                <p className="text-muted-foreground">Get started by creating your first organization</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Organization
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card key={org.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black rounded-lg">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate text-black">{org.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-black/70">
                          <Calendar className="h-3 w-3" />
                          Created {org.createdAt && new Date(org.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{org.name}&quot;? This action cannot be undone and will remove
                            all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrganization(org.id, org.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm text-black/70">
                        <Users className="h-4 w-4" />
                        <span>{org.memberCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-black/70">
                        <MapPin className="h-4 w-4" />
                        <span>{org.locationCount || 0}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddMemberDialog(org.id)}
                      className="flex-1 gap-2 text-xs border-black text-black hover:bg-black hover:text-white"
                    >
                      <UserPlus className="h-3 w-3" />
                      Add Member
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRemoveMemberDialog(org.id)}
                      className="flex-1 gap-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <UserMinus className="h-3 w-3" />
                      Remove Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
