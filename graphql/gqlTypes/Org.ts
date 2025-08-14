import { LocationService } from "@/services/locationService";
import { OrgService } from "@/services/orgService";
import { UserService } from "@/services/userService";
import { extendType, nonNull, objectType, stringArg, intArg, floatArg } from "nexus";

const TEST_ADMIN="cme7b98yo0001mzm9g91lpa7b";
const TEST_USER="cme7b905i0000mzm9n22or9yb";

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
      resolve: async () => {
        
        const orgs =  await UserService.GetUserOrgs(TEST_ADMIN)

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
      resolve: async (_parent, {name}) => {
        //TODO: remove test admin
        const org = await OrgService.createOrg(name,TEST_ADMIN);

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
      resolve: async (_parent, {orgId}) => {
        return await OrgService.deleteOrg(orgId,TEST_ADMIN);
      },
    });

    t.nonNull.field("addMemberToOrg", {
      type : "Boolean",
      args: {
        orgId : nonNull(stringArg()),
        memberId : nonNull(stringArg()),
        role : nonNull(intArg())
      },

      resolve: async (_parent,{memberId,orgId,role}) => {
          //TODO: Add id from context here
          const roleName = !!role == true ? "MANAGER" : "CARE_WORKER"
          const success = await OrgService.addUserToOrg(memberId,TEST_ADMIN,orgId,roleName)
          return success;
      }
    })

    t.nonNull.field("removeMemberFromOrg",{
      type : "Boolean",
      args: {
        orgId : nonNull(stringArg()),
        memberId : nonNull(stringArg()),
      },

      resolve: async (_parent,{memberId,orgId}) => {
          //TODO: Add id from context here
          const success = await OrgService.removeMember(memberId,TEST_ADMIN,orgId);
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

      resolve: async (_parent,{memberId,orgId,role}) => {
          //TODO: Add id from context here
          const roleName = !!role === true ? "MANAGER" : "CARE_WORKER"
          const success = await OrgService.changeMemberRole(memberId,TEST_ADMIN,orgId,roleName);
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

      resolve : async (_parent,{orgId,name,address,lat,long,radius,shiftStart,shiftEnd}) => {
        console.log('request reached here')
        const temp = `1970-01-01T${shiftStart}:00.000`;
        const temp2 = `1970-01-01T${shiftEnd}:00.000`;
        
        return await OrgService.addLocation(TEST_ADMIN,orgId,{
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

      resolve : async (_parent,{orgId,locationId}) => {
        return await OrgService.removeLocation(TEST_ADMIN,orgId,locationId);
      }
    })

    t.nonNull.field("clockInToOrg",{
      type : "Boolean",
      args : {
        orgId : nonNull(stringArg()),
        lat : nonNull(floatArg()),
        long : nonNull(floatArg()),
      },
      resolve : async (_parent,{orgId,lat,long}) => {
          return await UserService.clockInToOrg(TEST_USER,orgId,{
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
      resolve : async (_parent,{orgId,lat,long}) => {
          return await UserService.clockOutOfOrg(TEST_USER,orgId,{
            lat : lat,
            long : long
          })
      }
    })
  },
});
