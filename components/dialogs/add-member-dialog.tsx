import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"; // adjust to your path

import { UserPlus } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { ADD_MEMBER_TO_ORG } from "@/lib/graphql";

type AddMemberProps = {
    selectedOrgId : string
    addMemberDialogOpen : boolean
    setAddMemberDialogOpen : React.Dispatch<SetStateAction<boolean>>
}


const AddMemberDailog = (
{   
    selectedOrgId,
    addMemberDialogOpen,
    setAddMemberDialogOpen,
} : AddMemberProps) => {

  const [memberId, setMemberId] = useState("")
  const [memberRole, setMemberRole] = useState<string>("Care_Worker")
  const [addMember, { loading: isAddingMember }] = useMutation(ADD_MEMBER_TO_ORG);
 
  const handleAddMember = async () => {
        if (!memberId.trim()) {
          toast.error("Member ID is required")
          return
        }

        try {
        await addMember({ 
          variables: { 
            memberId: memberId, 
            orgId: selectedOrgId, 
            role: memberRole === "Care_Worker" ? 0 : 1,
          }, 
          refetchQueries : ["GetOrgs"]
        });


        setMemberId("")
        setMemberRole("Care_Worker")
        setAddMemberDialogOpen(false)
        
        toast.success(`Member added  successfully`)
        } catch (error) {
            console.log(error)
            toast.error("Failed to add member")
        }
  }

  return (
    <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
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
                <SelectItem value="Care_Worker">Care Worker</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
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
        </AlertDialogFooter>
      </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default AddMemberDailog