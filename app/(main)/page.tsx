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
import { Building2, Menu, Plus } from "lucide-react"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { useMutation } from "@apollo/client"
import { CREATE_ORG } from "@/lib/graphql"
import { useSidebar } from "@/components/ui/sidebar"

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
  const { toggleSidebar } = useSidebar();


  

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
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your organizations and teams</p>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-sm w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">Create Organization</span>
            <span className="xs:hidden">Create</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
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
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)} 
              disabled={isCreating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrganization}
              disabled={isCreating || !newOrgName.trim()}
              className="gap-2 w-full sm:w-auto"
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
