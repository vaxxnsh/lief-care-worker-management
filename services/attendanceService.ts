import { prisma } from "@/lib/prisma"
import { Location } from "./locationService"

export type CreateAttendanceInput = {
    locationId : string
    location : Location
}


export class AttendanceService {
    public static async clockInUser(userId : string,orgId : string,attendanceInput : CreateAttendanceInput,) : Promise<boolean> {

        const dateTimeMidnight = this.currentDate();

        const attendance = await prisma.attendance.findUnique({
            where : {
                userId_organizationId_date : {
                    userId : userId,
                    organizationId : orgId,
                    date : dateTimeMidnight,
                }
            }
        });

        if(!!attendance) {
            throw new Error("User already clocked In")
        }

        return !!(await prisma.attendance.create({
            data : {
                organizationId : orgId,
                userId : userId,
                locationId : attendanceInput.locationId,
                date : dateTimeMidnight,
                clockInAt : new Date(),
                status : 'PRESENT',
                clockInLat : attendanceInput.location.lat,
                clockInLng : attendanceInput.location.long, 
            }
        }))
    }

    public static async clockOutUser(userId : string,orgId : string,location : Location) : Promise<boolean> {
        const dateTimeMidnight = this.currentDate();

        const attendance = await prisma.attendance.findUnique({
            where : {
                userId_organizationId_date : {
                    userId : userId,
                    organizationId : orgId,
                    date : dateTimeMidnight,
                }
            }
        });

        if(!attendance) {
            throw new Error("User not clocked In")
        }

        return !!(await prisma.attendance.update({
            where : {
                id : attendance.id
            },

            data : {
                clockOutAt : new Date(),
                status : 'CHECKED_OUT',
                clockOutLat : location.lat,
                clockOutLng : location.long,
            }
        }))
    }
    
    public  static async getAttendanceByOrgId(orgId : string) {
        return await prisma.attendance.findMany({
            where : {
                organizationId : orgId,
            }
        })
    }

    public static async getClockIdInEmployees(orgId : string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 

        return await prisma.attendance.findMany({
            where : {
                organizationId : orgId,
                date : {
                    gte : today,
                    lt : tomorrow
                }
            },

            include : {
                user : true,
            }
        })
    }

    public static async GetAttendanceForUser(userId : string) {
        return await prisma.attendance.findMany({
            where : {
                userId : userId,
            },

            include : {
                user : true,
            }
        })
    }

    private static currentDate() {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0); 
        return todayMidnight;
    }

} 



