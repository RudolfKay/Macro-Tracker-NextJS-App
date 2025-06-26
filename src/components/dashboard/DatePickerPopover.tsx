"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

// Props for the date picker popover
interface DatePickerPopoverProps {
  currentDate: string
  setCurrentDate: (date: string) => void
}

// Tailwind class names for calendar styling
const calendarClassNames = {
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  nav: "space-x-1 flex items-center",
  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex w-full",
  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
  row: "flex w-full mt-2",
  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
  day_range_end: "day-range-end",
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside:
    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
}

export const DatePickerPopover = ({ currentDate, setCurrentDate }: DatePickerPopoverProps) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Selected Date</span>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="font-semibold">
          {format(new Date(currentDate), "dd-MM-yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(currentDate)}
          onSelect={(date: Date | undefined) => {
            if (date) setCurrentDate(format(date, "yyyy-MM-dd"))
          }}
          initialFocus
          weekStartsOn={1}
          className="rounded-md border"
          classNames={calendarClassNames}
        />
      </PopoverContent>
    </Popover>
  </div>
) 