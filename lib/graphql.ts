import gql from "graphql-tag";

export const GET_ORG_LOCATIONS = gql`
  query GetOrgLocations($orgId: String!) {
    GetOrgLocations(orgId: $orgId) {
      id
      name
      address
      latitude
      longitude
      radiusMeters
      shiftStart
      shiftEnd
    }
  }
`;

export const ADD_LOCATION = gql`
  mutation AddLocationToOrg(
    $orgId: String!,
    $name: String!,
    $address: String!,
    $lat: Float!,
    $long: Float!,
    $radius: Int!,
    $shiftStart: String!,
    $shiftEnd: String!
  ) {
    addLocationToOrg(
      orgId: $orgId,
      name: $name,
      address: $address,
      lat: $lat,
      long: $long,
      radius: $radius,
      shiftStart: $shiftStart,
      shiftEnd: $shiftEnd
    ) {
      id
      name
      address
      latitude
      longitude
      radiusMeters
      shiftStart
      shiftEnd
    }
  }
`;

export const REMOVE_LOCATION = gql`
  mutation RemoveLocationFromOrg($orgId: String!, $locationId: String!) {
    removeLocationFromOrg(orgId: $orgId, locationId: $locationId)
  }
`;

export const GET_CLOCKED_IN_EMPLOYEES = gql`
query GetClockInEmployees($orgId: String!) {
  getClockInEmployees(orgId: $orgId) {
    id
    date
    clockInAt
    clockInLat
    clockInLng
    clockOutAt
    clockOutLat
    clockOutLng
    status
    user {
      id
      name
      email
      emailVerified
      image
    }
  }
}
`