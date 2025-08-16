"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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


import { toast } from "sonner";
import OrgList from "@/components/sections/org-list"
import { Building2, Plus } from "lucide-react"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { useMutation } from "@apollo/client"
import { CREATE_ORG } from "@/lib/graphql"

export interface Organization {
  id: string
  name: string
  createdAt?: string
  memberCount?: number
  locationCount?: number
}

export default function OrganizationsPage() {
  const [newOrgName, setNewOrgName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [createOrg, { loading: isCreating }] = useMutation(CREATE_ORG);


  

  const handleCreateOrganization = async () => {
      if (!newOrgName.trim()) {
        toast.error("Organization name is required");
        return;
      }

      try {
        await createOrg({ 
          variables: { name: newOrgName },
          refetchQueries : ["GetOrgs"]
        });
        setNewOrgName("");
        setIsCreateDialogOpen(false);
        toast.success(`Organization "${newOrgName}" created successfully`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to create organization");
      } 
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
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

        </div>

        <OrgList/>

      </div>
    </div>
  )
}
