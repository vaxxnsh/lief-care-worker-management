import { AttendanceService } from '@/services/attendanceService'
import { objectType, extendType, nonNull, stringArg, enumType } from 'nexus'
import { TEST_USER } from './Org'

export const Attendance = objectType({
  name: 'Attendance',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.field('date', { type: 'DateTime' })
    t.nonNull.field('clockInAt', { type: 'DateTime' })
    t.nonNull.float('clockInLat')
    t.nonNull.float('clockInLng')
    t.field('clockOutAt', { type: 'DateTime' })
    t.float('clockOutLat')
    t.float('clockOutLng')
    t.nonNull.field('status', { type: 'AttendanceStatus' })
    t.nonNull.field('user', {
      type: 'User',
      resolve: async (parent, _, ctx) => {
        const user = await ctx.prisma.attendance
        .findUnique({
            where: { id: parent.id },
        })
        .user({
            select : {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                image: true,
                emailVerified: true,
            }
        })

        if (!user?.id) {
            throw new Error("No User with that id")
        }

        return {
            id: user.id, 
            name: user.name, 
            email: user.email, 
            image: user.image, 
            emailVerified: user.emailVerified ? true : false, 
        };
      },
    })
  },
})

export const AttendanceQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('getClockInEmployees', {
      type: 'Attendance',
      args: {
        orgId: nonNull(stringArg()),
      },

      resolve : async (_,{orgId}) => {

        const attendances =  await AttendanceService.getClockIdInEmployees(orgId); 

        return attendances.map((att) => {
            return {
                id : att.id,
                date : att.date,
                clockInAt : att.clockInAt,
                clockInLat : att.clockInLat,
                clockInLng  : att.clockInLng,
                status : att.status,
                clockOutAt : att.clockOutAt,
                clockOutLat : att.clockOutLat,
                clockOutLng : att.clockOutLng,
            }
        })
      }
    })
    t.nonNull.list.nonNull.field('GetUserAttendance', {
      type: 'Attendance',
   
      resolve : async () => {

        const attendances =  await AttendanceService.GetAttendanceForUser(TEST_USER); 

        return attendances.map((att) => {
            return {
                id : att.id,
                date : att.date,
                clockInAt : att.clockInAt,
                clockInLat : att.clockInLat,
                clockInLng  : att.clockInLng,
                status : att.status,
                clockOutAt : att.clockOutAt,
                clockOutLat : att.clockOutLat,
                clockOutLng : att.clockOutLng,
            }
        })
      }
    })
  },
})


export const AttendanceStatus = enumType({
  name: 'AttendanceStatus',
  members: ['PRESENT', 'ABSENT', 'CHECKED_OUT']
})