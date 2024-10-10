"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

// Define the CalendarDateRangePicker component
export function CalendarDateRangePicker({
  onChange,
  initialDateRange,
  className,
}: {
  onChange: (dateRange: DateRange | undefined) => void;
  initialDateRange: DateRange;
  className?: string;
}) {
  // State to manage the selected date range
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateRange
  );

  // JSX for rendering the component
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        {/* Trigger button */}
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {/* Display selected date range or "Pick a date" */}
            {date?.from ? (
              date?.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              "Select date"
            )}
          </Button>
        </PopoverTrigger>
        {/* Calendar component within the popover */}
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              onChange(newDate);
            }}
            numberOfMonths={2}
            // Ensure that the default month is set based on the new selected range
            defaultMonth={date?.from || new Date()}
            // Add onDayClick to clear the selection if the clicked day is outside the current range
            onDayClick={(day) => {
              if (
                date &&
                (day < date?.from! || day > date?.to! || day < new Date())
              ) {
                setDate(undefined);
                onChange(undefined);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
