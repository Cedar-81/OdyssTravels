import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "./ui/date_picker"

function RidesSearch() {
  return (
    <section className="hidden lg:flex w-[40rem] min-w-max bg-white border shadow-xl border-black/20 gap-4 py-3 px-4 mx-auto rounded-xl overflow-clip">
        <div className="flex flex-col space-y-2">
            <label className="text-xs px-3" htmlFor="origin">Origin</label>
            <Select>
                <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue className="text-sm" placeholder="e.g Enugu" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                    <SelectLabel>Origin</SelectLabel>
                    <SelectItem value="morning">Enugu</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-xs px-3" htmlFor="destination">Destination</label>
            <Select>
                <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue className="text-sm" placeholder="e.g Abuja" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                    <SelectLabel>Destination</SelectLabel>
                    <SelectItem value="morning">Abuja</SelectItem>
                    <SelectItem value="afternoon">Porthacourt</SelectItem>
                    <SelectItem value="evening">Lagos</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-xs px-3" htmlFor="destination">Date</label>
            <DatePicker/>
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-xs px-3" htmlFor="destination">Time</label>
            <Select>
                <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue className="text-sm" placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                    <SelectLabel>Time</SelectLabel>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </section>
  )
}

export default RidesSearch