import { prisma } from "@/lib/prisma";
import { UserService } from "./userService";
import { Organization, OrgRole } from "@/prisma/generated/prisma";
import { orgMemberService } from "./orgMemberService";
import { CreateLocationInput, LocationService,Location } from "./locationService";







export class OrgService {

    public static async findOrgById(orgId : string) {
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

        const org = await this.findOrgById(orgId);


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

        const org = await this.findOrgById(orgId);

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

        const org = await this.findOrgById(orgId);


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

    public static async addLocation(adminId : string,orgId : string,locationInput : CreateLocationInput) {
        const {location} = locationInput
        const admin = await UserService.findUserById(adminId);

        if (!admin) {
            throw new Error("Admin not found");
        }

        const org = await this.findOrgById(orgId);

        if (!org?.id) {
            throw new Error("Org not found")
        }

        if (!LocationService.isValidLatLng(location)) {
            throw new Error("Invalid inputs")
        }
        
        return await LocationService.addLocationByOrgId(orgId,locationInput);
    }

    public static async removeLocation(adminId : string,orgId : string,location : Location) {
        const admin = await UserService.findUserById(adminId);

        if (!admin) {
            throw new Error("Admin not found");
        }

        const org = await this.findOrgById(orgId);

        if (!org?.id) {
            throw new Error("Org not found")
        }

        const lct = await LocationService.GetLocation(orgId,location);

        if(!lct) {
            throw new Error("Location not found");
        }

        return await LocationService.deleteLocation(lct.id)
    }

    private static isAdmin(adminId : string, org : Organization) : boolean {
        return adminId == org.createdBy;
    }
}