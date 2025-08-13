"use client";
import { ADD_LOCATION, GET_ORG_LOCATIONS, REMOVE_LOCATION } from "@/lib/graphql";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";


export interface Location {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  shiftStart: string;
  shiftEnd: string;
}

interface QueryData {
  GetOrgLocations: Location[];
}

interface QueryVars {
  orgId: string;
}

const formState = {
    name: '',
    address: '',
    lat: '',
    long: '',
    radius: '',
    shiftStart: '',
    shiftEnd: ''
}

const useLocationModal = (orgId : string) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({...formState});

  const { data, loading, refetch } = useQuery<QueryData, QueryVars>(GET_ORG_LOCATIONS, {
    variables: { orgId: orgId}
  });

  const [addLocation] = useMutation(ADD_LOCATION);
  const [removeLocation] = useMutation(REMOVE_LOCATION);

  const handleAddLocation = async (orgId : string) => {

    console.log({...form, orgId : orgId})
    try {
      await addLocation({
        variables: {
          orgId: orgId,
          name: form.name,
          address: form.address,
          lat: parseFloat(form.lat),
          long: parseFloat(form.long),
          radius: parseInt(form.radius),
          shiftStart: form.shiftStart,
          shiftEnd: form.shiftEnd,
        }
      });
      toast.success('Location added!');
      setForm({...formState})
      refetch();
      setOpen(false);
    } catch (err ) {
      if (err instanceof ApolloError) {
        console.log(err.message)
      }
      else {
        console.log(err)
      }
      toast.error('Failed to add location');
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    try {
      await removeLocation({
        variables: {
          orgId: orgId,
          locationId
        }
      });
      toast.success('Location removed!');
      refetch();
    } catch (err) {
      console.log(err);
      toast.error('Failed to remove location');
    }
  };

  return {
    form : form,
    setForm : setForm,
    open : open,
    setOpen : setOpen,
    data : data,
    loading : loading,
    refetch : refetch,
    handleAddLocation,
    handleDeleteLocation
  }

}

export default useLocationModal;