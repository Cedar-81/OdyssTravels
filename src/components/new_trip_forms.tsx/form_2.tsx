import { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { usersService, type Company, type CompanyVehicle } from "@/services/users";
import { showToast, toastMessages } from "@/utils/toast";

interface Form2Props {
  onNext: () => void;
  onPrevious: () => void;
  formData: {
    vehicleType: string;
    seatCount: string;
    transportPartner: string;
  };
  onFormDataChange: (field: string, value: any) => void;
}

export default function Form2({ onNext, onPrevious, formData, onFormDataChange }: Form2Props) {
    const [localData, setLocalData] = useState({
        vehicleType: formData.vehicleType,
        seatCount: formData.seatCount,
        transportPartner: formData.transportPartner
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [allVehicles, setAllVehicles] = useState<CompanyVehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<CompanyVehicle[]>([]);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
      usersService.getAllCompanies().then(setCompanies).catch(() => setCompanies([]));
      usersService.getAllCompanyVehicles().then(setAllVehicles).catch(() => setAllVehicles([]));
    }, []);

    // Filter vehicles based on selected company
    useEffect(() => {
      if (localData.transportPartner) {
        const selectedCompany = companies.find(c => c.company_name === localData.transportPartner);
        
        if (selectedCompany) {
          const companyVehicles = allVehicles.filter(v => v.company_id === selectedCompany.id);
          setFilteredVehicles(companyVehicles);
          
          if (companyVehicles.length === 0) {
            showToast.warning(toastMessages.noVehiclesAvailable);
          }
          
          // Clear vehicle type if it's not available for the selected company
          const isVehicleAvailable = companyVehicles.find(v => v.type === localData.vehicleType);
          
          if (localData.vehicleType && !isVehicleAvailable) {
            setLocalData(prev => ({ ...prev, vehicleType: '', seatCount: '' }));
            onFormDataChange('vehicleType', '');
            onFormDataChange('seatCount', '');
            showToast.info(toastMessages.vehicleCleared);
          }
        } else {
          setFilteredVehicles([]);
        }
      } else {
        setFilteredVehicles([]);
        // Clear vehicle type when no company is selected
        if (localData.vehicleType) {
          setLocalData(prev => ({ ...prev, vehicleType: '', seatCount: '' }));
          onFormDataChange('vehicleType', '');
          onFormDataChange('seatCount', '');
        }
      }
    }, [localData.transportPartner, companies, allVehicles]);

    useEffect(() => {
      if (localData.vehicleType) {
        const selectedVehicle = filteredVehicles.find(v => v.type === localData.vehicleType);
        
        if (selectedVehicle) {
          setLocalData(prev => ({ ...prev, seatCount: selectedVehicle.capacity.toString() }));
          onFormDataChange('seatCount', selectedVehicle.capacity.toString());
        }
      }
    }, [localData.vehicleType, filteredVehicles]);

    const isValid = localData.vehicleType && localData.seatCount && localData.transportPartner;

    const handleNext = () => {
        if (!isValid) {
          showToast.error(toastMessages.selectTransportAndVehicle);
          return;
        }

        onFormDataChange('vehicleType', localData.vehicleType);
        onFormDataChange('seatCount', localData.seatCount);
        onFormDataChange('transportPartner', localData.transportPartner);
        showToast.success(toastMessages.transportDetailsSaved);
        onNext();
    };

    const handlePrevious = () => {
        onFormDataChange('vehicleType', localData.vehicleType);
        onFormDataChange('seatCount', localData.seatCount);
        onFormDataChange('transportPartner', localData.transportPartner);
        onPrevious();
    };

    return(
        <section className="space-y-6 w-[90%] px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem] pb-20">
            <div className="flex gap-2 w-full items-center">
                <button 
                    onClick={handlePrevious}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg width="32" height="33" className="h-5" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 7.5L11.5 16.5L20.5 25.5" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">What's the ride like?</h1>
            </div>

            <div className="space-y-4 w-full lg:w-full min-w-0">
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="transportPartner">Transport partner</label>
                    <Select 
                        value={localData.transportPartner} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, transportPartner: value }))}
                    >
                        <SelectTrigger className="select-fixed-width text-sm">
                            <SelectValue className="select-value-fixed text-sm" placeholder="Select which Odyss partner to travel with" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Odyss transport partners</SelectLabel>
                                {companies.map(company => (
                                  <SelectItem key={company.id} value={company.company_name}>{company.company_name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="vehicleType">
                        Vehicle type
                        {!localData.transportPartner && (
                          <span className="text-gray-500 ml-1">(Select transport partner first)</span>
                        )}
                    </label>
                    <Select 
                        value={localData.vehicleType} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, vehicleType: value }))}
                        disabled={!localData.transportPartner}
                    >
                        <SelectTrigger 
                            className={`select-fixed-width text-sm ${!localData.transportPartner ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                if (!localData.transportPartner) {
                                    showToast.warning(toastMessages.selectTransportPartner);
                                }
                            }}
                        >
                            <SelectValue className="select-value-fixed text-sm" placeholder={
                                !localData.transportPartner 
                                    ? "Select transport partner first" 
                                    : filteredVehicles.length === 0 
                                        ? "No vehicles available for this company" 
                                        : "Select a vehicle you'd like to travel with"
                            } />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Vehicle</SelectLabel>
                                {filteredVehicles.map(vehicle => (
                                    <SelectItem key={vehicle.id} value={vehicle.type}>
                                        {vehicle.type} ({vehicle.capacity} seats)
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full relative">
                    <label className="text-xs font-semibold" htmlFor="seatCount">Number of seats available</label>
                    <Input 
                        className="outline-none border-none text-sm focus:border-none bg-gray-100 cursor-not-allowed" 
                        type="number" 
                        placeholder="How many people can join this trip?"
                        value={localData.seatCount}
                        disabled
                        onClick={() => setShowTooltip(true)}
                        readOnly
                    />
                    {showTooltip && (
                      <div className="absolute top-12 left-0 bg-black text-white text-xs rounded px-3 py-2 z-10 shadow-lg" onMouseLeave={() => setShowTooltip(false)}>
                        This is automatically set based on the vehicle type.
                      </div>
                    )}
                </div>
            </div>
            <button 
                onClick={handleNext}
                className={`w-[90%] lg:w-full py-3 text-center rounded-full text-white transition-colors ${isValid ? 'bg-black hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!isValid}
            >
                Next
            </button>
        </section>
    )
}