import { prisma } from "@/lib/prisma";

export type Location  ={
    lat: number
    long: number
}

export type CreateLocationInput = {
    name : string
    address : string
    radius : number
    location : Location
    shiftStart ?: Date
    shiftEnd ?: Date
}

export type LocationPrisma =  {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    address: string | null;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    shiftStart : Date;
    shiftEnd : Date;
}

export type clockInReturn = [true,LocationPrisma] | [false,null]

export class LocationService {

    public static async GetLocation(orgId : string,location : Location) {
        return await prisma.location.findFirst({
            where : {
                organizationId : orgId,
                latitude : location.lat,
                longitude : location.long
            }
        })
    }

    public static async GetLocationByID(orgId : string,locationId : string) {
        return await prisma.location.findUnique({
            where : {
                id : locationId
            }
        })
    }
    public static async GetLocationsByOrgID(orgId : string) {
        return await prisma.location.findMany({
            where : {
                organizationId : orgId
            }
        })
    }
    
    public static async addLocationByOrgId(orgId : string,locationInput : CreateLocationInput) {
        const {name, address,location,radius,shiftStart,shiftEnd} = locationInput


        if (!LocationService.isValidLatLng(location)) {
            throw new Error("Invalid inputs")
        }
        console.log(`shiftStart : ${shiftStart} shiftEnd : ${shiftEnd}`)
        return await prisma.location.create({
            data : {
                name : name,
                address : address,
                organizationId : orgId,
                latitude : location.lat,
                longitude : location.long,
                radiusMeters : radius,
                shiftStart : shiftStart,
                shiftEnd : shiftEnd
            }
        })
    }
    
    public static async deleteLocation(locationId : string) : Promise<boolean> {
        return !!(await prisma.location.delete({
            where : {
                id : locationId
            }
        })).id
    }

    public static isInsideRadius(curLocation : Location,destLocation : Location,radius : number) {
        const R = 6371;
    
        const {lat : lat1,long : lon1} = curLocation;
        const {lat : lat2,long : lon2} = destLocation;
    
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
    
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distanceInMeter = R * c * 1000;
        return distanceInMeter <= radius;
    }

    public static canClockIn(userLocation : Location,orgLocations : LocationPrisma[]) : clockInReturn  {

        if (!this.isValidLatLng(userLocation)) {
            throw new Error("Not a valid location input")
        } 

        for (const lc of orgLocations){
            if(
                this.checkConstraints(
                    userLocation,
                    {lat : lc.latitude,long : lc.longitude},
                    lc.shiftStart,
                    lc.shiftEnd,
                    lc.radiusMeters
                )
            ) return [true,lc]
        }

        return [false, null]
    }

    private static checkConstraints(curLc : Location,destLc : Location,shiftStart : Date,shiftEnd : Date,radius : number) : boolean  {
        if(!this.isInsideRadius(curLc,destLc,radius)) {
            console.log("Not Inside Radius")
            return false
        }
        if(shiftEnd.getTime() - Date.now() >= 0) {
            console.log("Shift has Ended")

            return false
        }
        if(Date.now() - shiftStart.getTime() <= 0) {
            return false
        }
        return true
    }
    
    public static isValidLatLng(location : Location) {
        const {lat, long} = location
        return (
            typeof lat === "number" &&
            typeof long === "number" &&
            Number.isFinite(lat) &&
            Number.isFinite(long) &&
            lat >= -90 && lat <= 90 &&
            long >= -180 && long <= 180
        );
    }
}