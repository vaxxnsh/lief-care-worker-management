import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";

export class orgMemberService {
    public static async find<T extends Prisma.OrgMembersFindFirstArgs>
    (
        args: Prisma.SelectSubset<T, Prisma.OrgMembersFindFirstArgs>
    )
    : Promise<Prisma.OrgMembersGetPayload<T> | null> 
    {
        return prisma.orgMembers.findFirst(args);
    }

    public static async create<T extends Prisma.OrgMembersCreateArgs>
    (
        args: Prisma.SelectSubset<T, Prisma.OrgMembersCreateArgs>
    )
    : Promise<boolean> 
    {
        return !!(await prisma.orgMembers.create(args)).id;
    }    
    
    public static async delete<T extends Prisma.OrgMembersDeleteArgs>
    (
        args: Prisma.SelectSubset<T, Prisma.OrgMembersDeleteArgs>
    )
    : Promise<boolean | null> 
    {
        return !!(await prisma.orgMembers.delete(args)).id;
    }
}