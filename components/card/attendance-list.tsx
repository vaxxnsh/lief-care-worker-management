'use client';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GET_USER_ATTENDANCE } from '@/lib/graphql';
import { useQuery } from '@apollo/client';


interface GetUserAttendanceData {
  GetUserAttendance: {
    id: string;
    date: string; 
    clockInAt: string ;
    clockInLat: number ;
    clockInLng: number ;
    clockOutAt: string | null;
    clockOutLat: number | null;
    clockOutLng: number | null;
    status: string;
  }[];
}

const AttendanceList = () => {

  const { data, loading, error } = useQuery<GetUserAttendanceData>(GET_USER_ATTENDANCE);

  const attendanceData = data?.GetUserAttendance || [];

  if(error) {
    return <div>{error.message}</div>
  }

  if(loading) {
    return <div>Loading...</div>
  }

  return (
        <div className="w-full max-w-6xl mb-5 mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-black">Attendance Records</h1>
            <p className="text-gray-600">Track your daily attendance and working hours</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {attendanceData.length} records
        </div>
      </div>

      <div className="space-y-4">
        {attendanceData.map((record) => (
          <Card key={record.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-0 p-0">
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-black">{formatDate(record.date)}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                  {getStatusIcon(record.status)}
                  {getStatusText(record.status)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-sm text-gray-600">
                    In: <span className="font-semibold text-black">{formatTime(record.clockInAt)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Out: <span className="font-semibold text-black">{formatTime(record.clockOutAt!)}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-black">
                  {calculateWorkingHours(record.clockInAt, record.clockOutAt!)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {attendanceData.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
          <p className="text-gray-500">Your attendance history will appear here once you start clocking in.</p>
        </div>
      )}
    </div>
  );
};


const formatDate = (dateString : string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString : string) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const calculateWorkingHours = (clockIn: string, clockOut: string) => {
  if (!clockIn || !clockOut) return '--';

  const start = new Date(clockIn).getTime();
  const end = new Date(clockOut).getTime();
  if (isNaN(start) || isNaN(end)) return '--';

  // Handle overnight shifts by adding 24h if end is before start
  let diffMs = end - start;
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
};

const getStatusIcon = (status : string) => {
  switch (status) {
    case 'CHECKED_OUT':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'PRESENT':
      return <AlertCircle className="h-4 w-4 text-blue-600" />;
    default:
      return <XCircle className="h-4 w-4 text-red-600" />;
  }
};

const getStatusText = (status : string) => {
  switch (status) {
    case 'CHECKED_OUT':
      return 'Completed';
    case 'PRESENT':
      return 'Active';
    default:
      return 'Incomplete';
  }
};

const getStatusColor = (status : string) => {
  switch (status) {
    case 'CHECKED_OUT':
      return 'text-green-600 bg-green-50';
    case 'PRESENT':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-red-600 bg-red-50';
  }
};

export default AttendanceList;