import { prisma } from "@/lib/prisma";
import {User,Organization,Prisma, OrgRole} from "@/prisma/generated/prisma"
import { UserService } from "./userService";
import { orgMemberService } from "./orgMemberService";


export type UserWithMemberships = Prisma.UserGetPayload<{
  include: { orgMemberships: true };
}>;



export class OrgService {

    public static async FindOrg<T extends Prisma.OrganizationFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganizationFindFirstArgs>
    ): Promise<Prisma.OrganizationGetPayload<T> | null> {
        return prisma.organization.findFirst(args);
    }

    public static async createOrg<T extends Prisma.OrganizationCreateArgs>(
        args: Prisma.SelectSubset<T, Prisma.OrganizationCreateArgs>
    ): Promise<Prisma.OrganizationGetPayload<T>> {
        return prisma.organization.create(args);
    }


    public static async addUserToOrg(userId : string,orgId : string,role : OrgRole) : Promise<boolean> {
        const user = await UserService.findUser({
            where : { id : userId},

            include : {
                createdOrgs : true,
                orgMemberships : true,
            }
        })

        if(!user) {
            throw new Error("User not found")
        }

        const org = await this.FindOrg({where : {id : orgId}})


        if (!org) {
            throw new Error("Organization not Found")
        }

        if (!this.isAdmin(user,org)) {
            throw new Error("UnAuthorized")
        }


        if (this.isMember(user,org)) {
            throw new Error("Already a member")
        }

        return await orgMemberService.create({
            data : {
                orgId : org.id,
                userId : user.id,
                role : role
            }
        })

    }

    public static async removeMember(userId : string,orgId : string) {
        const user = await UserService.findUser({where : {id : userId}})

        if (!user) {
            throw new Error("user not found")
        }

        const org = await this.FindOrg({
            where : {id : orgId},
            include : { members : true}
        })

        if(!org) {
            throw new Error("Organization not found")
        }

        if (!this.isAdmin(user,org)) {
            throw new Error("UnAuthorized")
        }

        const member = await orgMemberService.find({where : {userId : userId}})

        if (!member) {
            throw new Error("OrgMember not Found")
        }

        return orgMemberService.delete({where : {id : member.id}})
    }

    private static isMember(user : UserWithMemberships,org : Organization) : boolean {
        return !!user.orgMemberships.findLast((o) => o.orgId === org.id)
    }

    private static isAdmin(user : User, org : Organization) : boolean {
        return user.id == org.createdBy;
    }
}