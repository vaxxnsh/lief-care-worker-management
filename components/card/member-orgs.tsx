import { Building2, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import React, { SetStateAction } from "react"


type MemberOrgsProps = {
  selectedOrg: string | null
  setSelectedOrg: React.Dispatch<SetStateAction<string>>
  orgs: { id: string; name: string }[]
}

const MemberOrgs = ({
  orgs,
  selectedOrg,
  setSelectedOrg
}: MemberOrgsProps) => {
  const hasOrgs = orgs.length > 0

  return (
    <Card className="border border-gray-200 bg-white shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-600" />
          Your Organizations
        </CardTitle>
        <CardDescription className="text-gray-600">
          Organizations you&apos;re a member of
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasOrgs ? (
          orgs.map((o) => (
            <div
              key={o.id}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                selectedOrg === o.id
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedOrg(o.id)}
            >
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-black">
                  {o.name}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500">
            <Users className="w-10 h-10 mb-3 text-gray-400" />
            <p className="text-sm font-medium">You&apos;re not part of any organization yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MemberOrgs
