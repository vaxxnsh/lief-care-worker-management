import { prisma } from "@/lib/prisma";
import { OrgRole } from "@/prisma/generated/prisma";
export class UserService {
    public static async findUserById(userId : string) {
        return prisma.user.findFirst({where : {id : userId}});
    }

    public static async isMember(userId : string,orgId : string) : Promise<[false,null] | [true,OrgRole]> {
        const user = await prisma.user.findFirst({where : {id : userId}, include : {orgMemberships : true}})

        const member = user?.orgMemberships.findLast((o) => o.orgId == orgId)

        if (!member?.id) {
            return [false,null]
        }
        return [true,member.role]
    }
}