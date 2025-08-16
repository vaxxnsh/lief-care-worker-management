"use client";
import { Organization } from "@/app/(main)/page";
import { Building2, Calendar, MapPin, Trash2, UserMinus, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import AddMemberDailog from "../dialogs/add-member-dialog";
import RemoveMemberDialog from "../dialogs/remove-member-dialog";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_ORG, GET_ORGS } from "@/lib/graphql";
import Link from "next/link";

const OrgList = () => {
    
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false)
    const [selectedOrgId,setSelectedOrgId] = useState("")


    const { data, loading, error } = useQuery<{ GetOrgs: Organization[] }>(GET_ORGS);
    const [deleteOrg] = useMutation(DELETE_ORG);
    const orgs = data?.GetOrgs ?? [];


    const openAddMemberDialog = (orgId: string) => {
        setSelectedOrgId(orgId)
        setAddMemberDialogOpen(true)
    }

      if(loading) {
    return <>
      Loading...
    </>
  }

  if (error) {
    return <>
      {error}
    </>
  }

    const openRemoveMemberDialog = (orgId: string) => {
        setSelectedOrgId(orgId)
        setRemoveMemberDialogOpen(true)
    }

    const handleDeleteOrganization = async (orgId: string, orgName: string) => {
        try {
            await deleteOrg({
                variables: { orgId },
                refetchQueries: ["GetOrgs"], 
            });

            toast.success(`Organization "${orgName}" deleted successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete organization");
        }
    };


  return (
        <>
          {orgs.length === 0 ? (
            
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No organizations yet</h3>
                <p className="text-muted-foreground">Get started by creating your first organization</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orgs.map((o) => (
              <Card key={o.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle>
                              <Link 
                                href={`/orgs/${o.id}`}
                                className="text-lg truncate text-black" >
                                  {o.name}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1 text-black/70">
                                <Calendar className="h-3 w-3" />
                                Created {o.createdAt && new Date(o.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                        <AlertDialogPortal>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{o.name}&quot;? This action cannot be undone and will remove
                            all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrganization(o.id, o.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                      </AlertDialogPortal>
                    </AlertDialog>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm text-black/70">
                        <Users className="h-4 w-4" />
                        <span>{o.memberCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-black/70">
                        <MapPin className="h-4 w-4" />
                        <span>{o.locationCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openAddMemberDialog(o.id)}
                      className="flex-1 gap-2 text-xs text-white"
                    >
                      <UserPlus className="h-3 w-3" />
                      Add Member
                    </Button>
                    <Button
                    variant={'destructive'}
                      size="sm"
                      onClick={() => openRemoveMemberDialog(o.id)}
                      className="flex-1 gap-2 text-xs  hover:bg-destructive/60"
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

        <AddMemberDailog 
            selectedOrgId={selectedOrgId}
            addMemberDialogOpen={addMemberDialogOpen}
            setAddMemberDialogOpen={setAddMemberDialogOpen}
        />

        <RemoveMemberDialog 
            selectedOrgId={selectedOrgId}
            removeMemberDialogOpen={removeMemberDialogOpen}
            setRemoveMemberDialogOpen={setRemoveMemberDialogOpen}
        />
        </>
  )
}

export default OrgList;