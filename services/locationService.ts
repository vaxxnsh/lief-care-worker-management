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
}

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
    
    public static async addLocationByOrgId(orgId : string,locationInput : CreateLocationInput) {
        const {name, address,location,radius} = locationInput
        return await prisma.location.create({
            data : {
                name : name,
                address : address,
                organizationId : orgId,
                latitude : location.lat,
                longitude : location.long,
                radiusMeters : radius
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