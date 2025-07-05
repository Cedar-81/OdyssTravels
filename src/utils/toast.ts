import { toast } from "sonner";

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast.warning(message),
  info: (message: string) => toast.info(message),
};

// Common toast messages
export const toastMessages = {
  // Form validation
  selectTransportPartner: "Please select a transport partner first before choosing a vehicle type.",
  selectTransportAndVehicle: "Please select a transport partner and vehicle type.",
  noVehiclesAvailable: "No vehicles available for the selected transport company.",
  vehicleCleared: "Vehicle type cleared - not available for the selected company.",
  
  // Form 3 validation
  selectTransportForDeparture: "Please select a transport partner first before choosing departure city.",
  selectDepartureForDestination: "Please select a departure city first before choosing destination.",
  selectCitiesForTime: "Please select both departure and destination cities first before choosing trip time.",
  noRoutesAvailable: "No routes available for the selected transport company.",
  departureCityCleared: "Departure city cleared - not available for the selected company.",
  
  // Form 5 validation
  refundPolicyRequired: "Please acknowledge the refund policy and select a smart fill policy.",
  
  // Success messages
  transportDetailsSaved: "Transport details saved successfully!",
  tripRouteDetailsSaved: "Trip route details saved successfully!",
  tripDetailsSaved: "Trip details saved successfully!",
  
  // General
  somethingWentWrong: "Something went wrong. Please try again.",
  savedSuccessfully: "Saved successfully!",
  updatedSuccessfully: "Updated successfully!",
  deletedSuccessfully: "Deleted successfully!",
}; 