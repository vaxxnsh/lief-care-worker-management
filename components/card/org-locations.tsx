'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Navigation, Plus, Trash2 } from 'lucide-react';
import useLocationModal from '@/hooks/use-location-modal';
import CreateLocationDialog from '../dialogs/create-location-dialog';



export function OrgLocationsCard({ orgId }: { orgId: string }) {
  const {
    open,
    setOpen,
    form,
    setForm,
    loading,
    data,
    handleAddLocation,
    handleDeleteLocation,
  } = useLocationModal(orgId);

  return (
<Card className="w-full">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
   <div>
     <CardTitle className="text-lg font-semibold text-gray-900">
       Organization Locations
     </CardTitle>
     <p className="text-sm text-gray-500 mt-1">
       {data?.GetOrgLocations?.length || 0} location{data?.GetOrgLocations?.length !== 1 ? 's' : ''} configured
     </p>
   </div>
   <Button 
     size="sm" 
     className="bg-gray-900 hover:bg-gray-800 text-white" 
     onClick={() => setOpen(true)}
   >
     <Plus className="w-4 h-4 mr-2" />
     Add Location
   </Button>
 </CardHeader>

 <CardContent className="p-0">
   {loading ? (
     <div className="flex items-center justify-center py-12">
       <div className="flex items-center space-x-2 text-gray-500">
         <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
         <span>Loading locations...</span>
       </div>
     </div>
   ) : data?.GetOrgLocations?.length === 0 ? (
     <div className="text-center py-12 px-6">
       <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
       <h3 className="text-lg font-medium text-gray-900 mb-2">No locations yet</h3>
       <p className="text-gray-500 mb-4">Add your first location to get started with attendance tracking.</p>
       <Button 
         variant="outline" 
         onClick={() => setOpen(true)}
         className="mx-auto border-gray-200 hover:bg-gray-50"
       >
         <Plus className="w-4 h-4 mr-2" />
         Add First Location
       </Button>
     </div>
   ) : (
     <div className="divide-y divide-gray-100">
       {data?.GetOrgLocations?.map((loc) => (
         <div 
           key={loc.id} 
           className="p-6 hover:bg-gray-50 transition-colors"
         >
           <div className="flex items-start justify-between">
             <div className="flex-1 min-w-0">
               {/* Location Header */}
               <div className="flex items-center mb-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                 <h3 className="text-lg font-semibold text-gray-900 truncate">
                   {loc.name}
                 </h3>
               </div>

               {/* Address */}
               {loc.address && (
                 <div className="flex items-center text-gray-600 mb-3">
                   <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                   <span className="text-sm truncate">{loc.address}</span>
                 </div>
               )}

               {/* Details Grid - Responsive */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                 {/* Coordinates */}
                 <div className="flex items-center">
                   <Navigation className="w-4 h-4 text-gray-400 mr-2" />
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Coordinates</p>
                     <p className="text-sm text-gray-900 font-mono">
                       {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                     </p>
                   </div>
                 </div>

                 {/* Radius */}
                 <div className="flex items-center">
                   <div className="w-4 h-4 border-2 border-gray-400 rounded-full mr-2"></div>
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Radius</p>
                     <p className="text-sm text-gray-900">
                       {loc.radiusMeters}m
                     </p>
                   </div>
                 </div>

                 {/* Shift Time */}
                 <div className="flex items-center">
                   <Clock className="w-4 h-4 text-gray-400 mr-2" />
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Shift Hours</p>
                     <p className="text-sm text-gray-900">
                       {formatTime(loc.shiftStart)} - {formatTime(loc.shiftEnd)}
                     </p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="ml-4 flex-shrink-0">
               <Button
                 size="sm"
                 variant="ghost"
                 className="text-gray-400 hover:text-red-600 hover:bg-gray-100"
                 onClick={() => handleDeleteLocation(loc.id)}
               >
                 <Trash2 className="w-4 h-4" />
               </Button>
             </div>
           </div>
         </div>
       ))}
     </div>
   )}
 </CardContent>

 <CreateLocationDialog 
   open={open}
   setOpen={setOpen}
   form={form}
   setForm={setForm}
   orgId={orgId}
   handleAddLocation={handleAddLocation}
 />
</Card>
  );
}


  const formatTime = (dateTime: string) => {
    if (!dateTime) return '';
    const date = new Date(dateTime)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes > 0 ? minutes : '0'+minutes} ${ampm}`;
  };