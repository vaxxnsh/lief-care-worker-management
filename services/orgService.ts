import { prisma } from "@/lib/prisma";
import { UserService } from "./userService";
import { Organization, OrgRole } from "@/prisma/generated/prisma";
import { orgMemberService } from "./orgMemberService";







export class OrgService {

    public static async FindOrgById(orgId : string) {
        return prisma.organization.findFirst({where : {id : orgId}});
    }

    public static async createOrg(name : string,creatorId : string) {
        const user = await UserService.findUserById(creatorId);

        if(!user) {
            throw new Error("User not found")
        }

        const org = await prisma.organization.create({
            data : {
                name : name,
                createdBy : creatorId,
            }
        });

        console.log(org);
        return {
            id : org.id,
            name : org.name,
            createdBy : org.createdBy
        }
    }


    public static async addUserToOrg(userId : string,adminId : string,orgId : string,role : OrgRole) : Promise<boolean> {
        const user = await UserService.findUserById(userId);

        if(!user) {
            throw new Error("User not found")
        }

        const org = await this.FindOrgById(orgId);


        if (!org) {
            throw new Error("Organization not Found")
        }

        if (!this.isAdmin(adminId,org)) {
            throw new Error("UnAuthorized")
        }


        if ((await UserService.isMember(user.id,org.id))[0]) {
            throw new Error("Already a member")
        }

        return await orgMemberService.addMember(userId,orgId,role);
    }

    public static async removeMember(userId : string,adminId : string,orgId : string) {
         const user = await UserService.findUserById(userId);

         if (!user) {
            throw new Error("User not found")
        }

        const org = await this.FindOrgById(orgId);

        if(!org) {
            throw new Error("Organization not found")
        }

        if (!this.isAdmin(adminId,org)) {
            throw new Error("UnAuthorized")
        }

        const isMember = (await UserService.isMember(userId,orgId))[0];

        if (!isMember) {
            throw new Error("OrgMember not Found")
        }

        return orgMemberService.removeMember(userId,orgId);
    }

    public static async changeMemberRole(userId : string,adminId : string,orgId : string,role : OrgRole) {
        const user = await UserService.findUserById(userId);

        if(!user) {
            throw new Error("User not found")
        }

        const org = await this.FindOrgById(orgId);


        if (!org) {
            throw new Error("Organization not Found")
        }

        const isMember = await UserService.isMember(userId,orgId);

        if (!isMember[0]) {
            throw new Error("User is not a member")
        }

        if (isMember[1] === role) {
            throw new Error(`User already a ${role === "MANAGER" ? "Manager" : "Care Worker"}`)
        }


        const success = await orgMemberService.changeRoleOfMember(userId,orgId,role);

        return success
    }

    private static isAdmin(adminId : string, org : Organization) : boolean {
        return adminId == org.createdBy;
    }
}