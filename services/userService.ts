import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";

export class UserService {
    public static async findUser<T extends Prisma.UserFindFirstArgs>
    (
        args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>
    )
    : Promise<Prisma.UserGetPayload<T> | null> 
    {
        return prisma.user.findFirst(args);
    }
}