import { objectType } from "nexus";

export const OrgMembers = objectType({
  name: "OrgMembers",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("orgId");
    t.nonNull.string("userId");
    t.nonNull.string("role");
  },
});