import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { cn } from "../lib/utils";
import { Heading } from "../components/ui/text";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { useState } from "react";
import { CalendarIcon, PersonStandingIcon } from "lucide-react";
import { format } from "date-fns";

export const meta: MetaFunction = () => {
  return [{ title: "Burgerland booking" }];
};

export default function Index() {
  const [date, setDate] = useState<Date>();

  return (
    <main className="p-4 flex flex-col gap-10">
      <Heading headingStyle="h2" as="h2">
        Welcome to Burger Land!
      </Heading>
      <Form className="flex flex-col gap-2 bg-orange-100 p-4" action="/booking">
        <Heading headingStyle="h3" as="h3">
          Book your experience today
        </Heading>
        <fieldset className="flex gap-4 items-end">
          <Label htmlFor="guests" className="flex flex-col gap-2">
            How many are you?
            <span className="flex gap-2 items-center">
              <PersonStandingIcon />
              <Input type="number" name="guests" className="text-lg w-20" />
            </span>
          </Label>

          <input
            type="hidden"
            name="date"
            value={date ? date.toISOString() : undefined}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(e) => setDate(e)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button type="submit">Get tickets</Button>
        </fieldset>
      </Form>
    </main>
  );
}
