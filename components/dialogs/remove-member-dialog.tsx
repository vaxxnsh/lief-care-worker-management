import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "../ui/dialog";
import { UserMinus } from "lucide-react";
import { Label } from "recharts";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { REMOVE_MEMBER_FROM_ORG } from "@/lib/graphql";

type RemoveMemberProps = {
    removeMemberDialogOpen : boolean
    selectedOrgId : string
    setRemoveMemberDialogOpen : React.Dispatch<SetStateAction<boolean>>
}


const RemoveMemberDialog = (
{
    removeMemberDialogOpen, 
    selectedOrgId,
    setRemoveMemberDialogOpen
} : RemoveMemberProps) => {

    const [memberId, setMemberId] = useState("")
    const [removeMember, { loading: isRemovingMember }] = useMutation(REMOVE_MEMBER_FROM_ORG);

    
      const handleRemoveMember = async () => {
    if (!memberId.trim()) {
      toast.error("Member ID is required")
      return
    }
    

    try {
      await removeMember({ 
        variables: { 
          memberId: memberId, 
          orgId: selectedOrgId
        },
        refetchQueries : ["GetOrgs"]
      });

      setMemberId("")
      setRemoveMemberDialogOpen(false)

      toast.success(`Member removed from successfully`)
    } catch (error) {
      console.log(error)
      toast.error("Failed to remove member")
    }
  }

  return (
    <Dialog open={removeMemberDialogOpen} onOpenChange={setRemoveMemberDialogOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
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
              <Label>Member ID</Label>
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
      </DialogPortal>
    </Dialog>
  )
}

export default RemoveMemberDialog;