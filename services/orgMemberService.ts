import { prisma } from "@/lib/prisma";
import { OrgRole } from "@/prisma/generated/prisma";

export class orgMemberService {
    // public static async find<T extends Prisma.OrgMembersFindFirstArgs>
    // (
    //     args: Prisma.SelectSubset<T, Prisma.OrgMembersFindFirstArgs>
    // )
    // : Promise<Prisma.OrgMembersGetPayload<T> | null> 
    // {
    //     return prisma.orgMembers.findFirst(args);
    // }

    public static async addMember(userId : string,orgId : string,role : OrgRole) : Promise<boolean> 
    {
        return !!(await prisma.orgMembers.create({data : {userId : userId, orgId : orgId,role : role}})).id;
    }    
    
    public static async removeMember(userId : string,orgId : string) {
        return !!(await prisma.orgMembers.deleteMany({where : {userId : userId, orgId : orgId}}));
    }

    public static async changeRoleOfMember(userId : string,orgId : string,role : OrgRole) {
        return !!(await prisma.orgMembers.updateMany({where : {userId : userId,orgId : orgId}, data : { role : role}}));
    }
}