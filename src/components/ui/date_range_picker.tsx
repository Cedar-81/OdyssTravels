"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [localDateRange, setLocalDateRange] = React.useState<DateRange | undefined>(dateRange)

  const handleDateRangeSelect = (selectedRange: DateRange | undefined) => {
    setLocalDateRange(selectedRange)
    setOpen(false)
    if (onDateRangeChange) {
      onDateRangeChange(selectedRange)
    }
  }

  const formatDateRange = () => {
    if (!localDateRange?.from) return "Select date range"
    if (!localDateRange?.to) return format(localDateRange.from, "PPP")
    return `${format(localDateRange.from, "PPP")} - ${format(localDateRange.to, "PPP")}`
  }

  return (
    <div className="flex gap-4 border border-black/20 w-full rounded-lg">
      <div className="flex flex-col gap-3 w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-range-picker"
              className="w-full justify-between text-sm font-normal border-none shadow-none"
            >
              {formatDateRange()}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="overflow-hidden w-auto text-sm p-0" align="start">
            <Calendar
              mode="range"
              selected={localDateRange}
              captionLayout="dropdown"
              className="!w-auto"
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
              defaultMonth={localDateRange?.from}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
} 