import { OrgService } from "@/services/orgService";
import { UserService } from "@/services/userService";
import { extendType, nonNull, objectType, stringArg, intArg, floatArg, arg } from "nexus";

const TEST_ADMIN="cme7b98yo0001mzm9g91lpa7b";
const TEST_USER="cme7b905i0000mzm9n22or9yb";

export const Organization = objectType({
    name : "Organization",
    definition(t) {
        t.string('id')
        t.string('name')
    }
})

export const OrganizationQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.list.field('GetOrgs', {     
      type: 'Organization',
      resolve() {
        return [{ id : "org 1",name : "my org"}]
      },     
    })
  },
})

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
        return org
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
        shiftStart : nonNull(arg({type : 'DateTime'})),
        shiftEnd : nonNull(arg({type : 'DateTime'}))
      },

      resolve : async (_parent,{orgId,name,address,lat,long,radius,shiftStart,shiftEnd}) => {
        return await OrgService.addLocation(TEST_ADMIN,orgId,{
          name : name,
          address : address,
          radius : radius,
          shiftStart : new Date(shiftStart),
          shiftEnd : new Date(shiftEnd),
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
