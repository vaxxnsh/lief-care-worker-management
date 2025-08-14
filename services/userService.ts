import { prisma } from "@/lib/prisma";
import { OrgRole } from "@/prisma/generated/prisma";
import { Location, LocationService } from "./locationService";
import { OrgService } from "./orgService";
import { AttendanceService } from "./attendanceService";
export class UserService {
    public static async findUserById(userId : string) {
        return prisma.user.findFirst({where : {id : userId}});
    }

    public static async GetUserOrgs(userId : string) {
        return prisma.organization.findMany({
            where : {
                createdBy : userId
            },

            include : {
                members : true,
                location : true,
            }
        })
    }

    public static async isMember(userId : string,orgId : string) : Promise<[false,null] | [true,OrgRole]> {
        const user = await prisma.user.findFirst({where : {id : userId}, include : {orgMemberships : true}})

        const member = user?.orgMemberships.findLast((o) => o.orgId == orgId)

        if (!member?.id) {
            return [false,null]
        }
        return [true,member.role]
    }

    public static async clockInToOrg(userId : string,orgId : string,location : Location) : Promise<boolean> {
        const user = await this.findUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const org = await OrgService.findLocationsWithOrg(orgId);

        if (!org) {
            throw Error("Org not found");
        }
        
        if (org.location.length === 0) {
            throw Error("Org has no Locations")
        }

        const isMember = await this.isMember(userId,orgId)

        if(!isMember[0]) {
            throw Error("Not a Member")
        }

        const [canClockIn,matchedLocation] = LocationService.canClockIn(location,org.location);

        if (!canClockIn) {
            throw Error("Not Inside any valid Location")
        }

        return AttendanceService.clockInUser(userId,orgId,{
            locationId : matchedLocation.id,
            location : location,
        })


    }

    public static async clockOutOfOrg(userId : string,orgId : string,location : Location) : Promise<boolean> {
        const user = await this.findUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const org = await OrgService.findLocationsWithOrg(orgId);

        if (!org) {
            throw Error("Org not found");
        }
        
        if (org.location.length === 0) {
            throw Error("Org has no Locations")
        }

        const isMember = await this.isMember(userId,orgId)

        if(!isMember[0]) {
            throw Error("Not a Member")
        }

        if(!LocationService.isValidLatLng(location)) {
            throw Error("Not a valid Location")
        }


        return !!(await AttendanceService.clockOutUser(userId,orgId,location))
    }
}