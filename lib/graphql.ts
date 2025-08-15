import gql from "graphql-tag";


export const GET_ORGS = gql`
  query GetOrgs {
    GetOrgs {
      id
      name
      createdBy
      createdAt
      memberCount
      locationCount
    }
  }
`;

export const GET_MEMBER_ORGS = gql`
  query GetUserMemberOrgs {
    GetUserMemberOrgs {
      id
      name
    }
  }
`;

export const CREATE_ORG = gql`
  mutation CreateOrg($name: String!) {
    createOrg(name: $name) {
      id
      name
      createdAt
      createdBy
      memberCount
      locationCount
    }
  }
`;

export const DELETE_ORG = gql`
  mutation DeleteOrg($orgId: String!) {
    deleteOrg(orgId: $orgId)
  }
`;

export const ADD_MEMBER_TO_ORG = gql`
  mutation AddMemberToOrg($memberId: String!, $orgId: String!, $role: Int!) {
    addMemberToOrg(memberId: $memberId, orgId: $orgId, role: $role)
  }
`;

export const REMOVE_MEMBER_FROM_ORG = gql`
  mutation RemoveMemberFromOrg($memberId: String!, $orgId: String!) {
    removeMemberFromOrg(memberId: $memberId, orgId: $orgId)
  }
`;


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

export const CLOCK_IN_TO_ORG=gql`
mutation ClockInToOrg($orgId: String!, $lat: Float!, $long: Float!) {
  clockInToOrg(orgId: $orgId, lat: $lat, long: $long)
}
`

export const CLOCK_OUT_OF_ORG = gql`
  mutation ClockOutOfOrg($orgId: String!, $lat: Float!, $long: Float!) {
    clockOutOfOrg(orgId: $orgId, lat: $lat, long: $long)
  }
`;

export const GET_USER_ATTENDANCE = gql`
query GetUserAttendance {
   GetUserAttendance {
    id
    date
    clockInAt
    clockInLat
    clockInLng
    clockOutAt
    clockOutLat
    clockOutLng
    status
  }
}
`