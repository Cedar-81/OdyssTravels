"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date | null;
  onDateChange?: (date: Date | null) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [localDate, setLocalDate] = React.useState<Date | undefined>(date || undefined)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setLocalDate(selectedDate)
    setOpen(false)
    if (onDateChange) {
      onDateChange(selectedDate || null)
    }
  }

  return (
    <div className="flex gap-4 border border-black/20 w-full rounded-lg">
      <div className="flex flex-col gap-3 w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between text-sm font-normal border-none shadow-none"
            >
              {localDate ? localDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="overflow-hidden w-full text-sm p-0" align="start">
            <Calendar
              mode="single"
              selected={localDate}
              captionLayout="dropdown"
              className="!w-full"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
