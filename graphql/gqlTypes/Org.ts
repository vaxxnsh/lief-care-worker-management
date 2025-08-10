import { OrgService } from "@/services/orgService";
import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";

const TEST_ADMIN="cme67yokh0001mzh8yh9ao7mp";

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
  },
});
