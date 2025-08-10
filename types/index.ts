export type User = {
  id: string
  name: string
  email: string         
  image?: string
  createdOrgs: Organization[]
  memberOrgs: Organization[]
}

export type Organization =  {
  id: number
  title: string
  createdBy: string
  admin: User
  members: User[]
  location: Location[]
}

export type Location =  {
    id: string
    lat: number
    long: number
    radiusMeters: number
    address: string
}