import { Dialog, DialogContent, DialogTitle, DialogPortal, DialogOverlay } from '@radix-ui/react-dialog';
import React, { SetStateAction } from 'react';
import { DialogFooter, DialogHeader } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

type CreateLocationForm = {
  name: string;
  address: string;
  lat: string;
  long: string;
  radius: string;
  shiftStart: string;
  shiftEnd: string;
};

const CreateLocationDialog = ({
  orgId,
  open,
  setOpen,
  form,
  setForm,
  handleAddLocation,
}: {
  open: boolean;
  orgId: string;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  form: CreateLocationForm;
  setForm: React.Dispatch<SetStateAction<CreateLocationForm>>;
  handleAddLocation: (orgId: string) => Promise<void>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <DialogContent className="sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg border p-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Add New Location</DialogTitle>
          </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Basic Information */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Location Name
            </Label>
            <Input
              id="name"
              placeholder="Enter location name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="address"
              placeholder="Enter full address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Location Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="latitude" className="text-sm font-medium">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="0.000000"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude" className="text-sm font-medium">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="0.000000"
                value={form.long}
                onChange={(e) => setForm({ ...form, long: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="radius" className="text-sm font-medium">
              Radius (meters)
            </Label>
            <Input
              id="radius"
              type="number"
              placeholder="100"
              value={form.radius}
              onChange={(e) => setForm({ ...form, radius: e.target.value })}
            />
          </div>

          {/* Shift Times */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3 text-gray-700">Shift Schedule</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="shift-start" className="text-sm font-medium">
                  Shift Start
                </Label>
                <Input
                  id="shift-start"
                  type="time"
                  value={form.shiftStart}
                  onChange={(e) => setForm({ ...form, shiftStart: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shift-end" className="text-sm font-medium">
                  Shift End
                </Label>
                <Input
                  id="shift-end"
                  type="time"
                  value={form.shiftEnd}
                  onChange={(e) => setForm({ ...form, shiftEnd: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleAddLocation(orgId)}
            className="flex-1 sm:flex-none"
          >
            Add Location
          </Button>
        </DialogFooter>
      </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateLocationDialog;