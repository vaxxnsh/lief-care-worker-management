import { LocationService } from "@/services/locationService";
import { OrgService } from "@/services/orgService";
import { UserService } from "@/services/userService";
import { extendType, nonNull, objectType, stringArg, intArg, floatArg } from "nexus";

export const Organization = objectType({
    name : "Organization",
    definition(t) {
        t.nonNull.string('id')
        t.nonNull.string('name')
        t.nonNull.string('createdBy')
        t.nonNull.int('memberCount')
        t.nonNull.int('locationCount')
        t.nonNull.string('createdAt')
    }
})

export const OrganizationQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.list.field('GetOrgs', {     
      type: 'Organization',
      resolve: async (_parent,_args,ctx) => {


        const orgs =  await UserService.GetUserOrgs(ctx.user?.id as string)

        if (!orgs) return []

        return orgs.map((o) => (
          {
            id : o.id,
            name : o.name,
            createdBy : o.createdBy,
            memberCount : o.members.length,
            locationCount : o.location.length,
            createdAt : o.createdAt.toISOString()
          }
        ))
      },     
    })
    t.list.field('GetUserMemberOrgs', {     
      type: 'Organization',
      resolve: async (_parent,_args,ctx) => {
        
        const orgs =  await UserService.GetMemberOrgs(ctx.user?.id as string)

        if (!orgs) return []

        return orgs.map((o) => (
          {
            id : o.id,
            name : o.name,
            createdBy : o.createdBy,
            memberCount : 0,
            locationCount : 0,
            createdAt : o.createdAt.toISOString()
          }
        ))
      },     
    })
  },
})


export const OrgLocationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("GetOrgLocations", {
      type: "Location",
      args: {
        orgId: nonNull(stringArg()),
      },
      resolve: async (_parent, { orgId }) => {
        return await LocationService.GetLocationsByOrgID(orgId);
      },
    })
  },
});

export const OrgMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createOrg", {
      type: "Organization",
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_parent, {name},ctx) => {
  
        const org = await OrgService.createOrg(name,ctx.user?.id as string);

        return {
            id : org.id,
            name : org.name,
            createdBy : org.createdBy,
            memberCount :  org.location.length,
            locationCount : org.members.length,
            createdAt : org.createdAt.toISOString()
          }
      },
    });
    t.nonNull.field("deleteOrg", {
      type: "Boolean",
      args: {
        orgId: nonNull(stringArg()),
      },
      resolve: async (_parent, {orgId},ctx) => {
        return await OrgService.deleteOrg(orgId,ctx.user?.id as string);
      },
    });

    t.nonNull.field("addMemberToOrg", {
      type : "Boolean",
      args: {
        orgId : nonNull(stringArg()),
        memberId : nonNull(stringArg()),
        role : nonNull(intArg())
      },

      resolve: async (_parent,{memberId,orgId,role},ctx) => {
          const roleName = !!role == true ? "MANAGER" : "CARE_WORKER"
          const success = await OrgService.addUserToOrg(
            memberId,ctx.user?.id as string,
            orgId,
            roleName
          )
          return success;
      }
    })

    t.nonNull.field("removeMemberFromOrg",{
      type : "Boolean",
      args: {
        orgId : nonNull(stringArg()),
        memberId : nonNull(stringArg()),
      },

      resolve: async (_parent,{memberId,orgId},ctx) => {
          const success = await OrgService.removeMember(
            memberId,
            ctx.user?.id as string,
            orgId
          );
          return success;
      }}
    )
    t.nonNull.field("changeMemberRole",{
      type : "Boolean",
      args: {
        orgId : nonNull(stringArg()),
        memberId : nonNull(stringArg()),
        role : nonNull(intArg())
      },

      resolve: async (_parent,{memberId,orgId,role},ctx) => {
          const roleName = !!role === true ? "MANAGER" : "CARE_WORKER"
          const success = await OrgService.changeMemberRole(
            memberId,
            ctx.user?.id as string,
            orgId,
            roleName
          );
          return success;
      }}
    )

    t.nonNull.field("addLocationToOrg", {
      type : "Location",
      args : {
        orgId : nonNull(stringArg()),
        name : nonNull(stringArg()),
        address : nonNull(stringArg()),
        lat : nonNull(floatArg()),
        long : nonNull(floatArg()),
        radius : nonNull(intArg()),
        shiftStart : nonNull(stringArg()),
        shiftEnd : nonNull(stringArg())
      },

      resolve : async (_parent,{orgId,name,address,lat,long,radius,shiftStart,shiftEnd},ctx) => {
        console.log('request reached here')
        const temp = `1970-01-01T${shiftStart}:00.000`;
        const temp2 = `1970-01-01T${shiftEnd}:00.000`;
        
        return await OrgService.addLocation(ctx.user?.id as string,orgId,{
          name : name,
          address : address,
          radius : radius,
          shiftStart : new Date(temp),
          shiftEnd : new Date(temp2),
          location : {
            lat : lat,
            long : long,
          },
        })
      }
    })

    t.nonNull.field("removeLocationFromOrg", {
      type : "Boolean",
      args : {
        orgId : nonNull(stringArg()),
        locationId : nonNull(stringArg()),
      },

      resolve : async (_parent,{orgId,locationId},ctx) => {
        return await OrgService.removeLocation(ctx.user?.id as string,orgId,locationId);
      }
    })

    t.nonNull.field("clockInToOrg",{
      type : "Boolean",
      args : {
        orgId : nonNull(stringArg()),
        lat : nonNull(floatArg()),
        long : nonNull(floatArg()),
      },
      resolve : async (_parent,{orgId,lat,long},ctx) => {
          return await UserService.clockInToOrg(ctx.user?.id as string,orgId,{
            lat : lat,
            long : long
          })
      }
    })
    t.nonNull.field("clockOutOfOrg",{
      type : "Boolean",
      args : {
        orgId : nonNull(stringArg()),
        lat : nonNull(floatArg()),
        long : nonNull(floatArg()),
      },
      resolve : async (_parent,{orgId,lat,long},ctx) => {
          return await UserService.clockOutOfOrg(ctx.user?.id as string,orgId,{
            lat : lat,
            long : long
          })
      }
    })
  },
});
