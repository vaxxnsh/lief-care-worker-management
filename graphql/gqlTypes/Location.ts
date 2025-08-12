import { objectType } from "nexus";

export const Location = objectType({
  name: "Location",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("organizationId");
    t.nonNull.string("name");
    t.string("address");
    t.nonNull.float("latitude");
    t.nonNull.float("longitude");
    t.nonNull.int("radiusMeters");
    t.nonNull.field("shiftStart", { type: "DateTime" });
    t.nonNull.field("shiftEnd", { type: "DateTime" });
  },
});
