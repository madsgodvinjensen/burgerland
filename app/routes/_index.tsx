import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { cn } from "../lib/utils";
import { ErrorMessage, Heading } from "../components/ui/text";
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
import { checkAvailability, getTicketAvailability } from "~/backend";
import { bookingProgress } from "~/lib/cookies";

export const meta: MetaFunction = () => {
  return [{ title: "Burgerland booking" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams;

  const dateParam = params.get("date");
  const defaultDate = dateParam === null ? new Date() : new Date(dateParam);

  const availability = await getTicketAvailability(
    parseInt(params.get("guests") ?? "1"),
    defaultDate.getFullYear(),
    defaultDate.getMonth()
  );

  return {
    defaultDate,
    availability,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const guests = formData.get("guests");
  const date = formData.get("date");
  if (!guests || !date) {
    throw new Response("Parameters missing", {
      status: 400,
    });
  }

  const available = await checkAvailability(
    new Date(date as string),
    parseInt(guests as string)
  );

  if (!available) {
    return {
      errorCode: "tickets-not-available",
    };
  }

  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await bookingProgress.parse(cookieHeader)) ?? {};

  cookie.date = new Date(date as string);
  cookie.guests = parseInt(guests as string);

  return redirect("/food", {
    headers: {
      "Set-Cookie": await bookingProgress.serialize(cookie),
    },
  });
};

export default function Index() {
  const { availability, defaultDate } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [date, setDate] = useState<Date | undefined>(new Date(defaultDate));

  const disabledDays = Object.entries(availability)
    .filter(([, value]) => !value)
    .map(([key]) => new Date(key));

  return (
    <main className="p-4 flex flex-col gap-10">
      <Heading headingStyle="h2" as="h2">
        Welcome to Burger Land!
      </Heading>
      {actionData?.errorCode ? (
        <ErrorMessage>
          Tickets where not available on the selected day. Pick another.
        </ErrorMessage>
      ) : null}
      <Form method="post" className="flex flex-col gap-2 bg-orange-100 p-4">
        <Heading headingStyle="h3" as="h3">
          Book your experience today
        </Heading>
        <fieldset className="flex gap-4 items-end">
          <Label htmlFor="guests" className="flex flex-col gap-2">
            How many are you?
            <span className="flex gap-2 items-center">
              <PersonStandingIcon />
              <Input
                type="number"
                name="guests"
                className="text-lg w-20"
                required
                min={1}
                max={10}
              />
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
                formatters={{
                  formatDay(date: Date) {
                    console.log({ date, av: availability[date.toISOString()] });
                    return (
                      <span
                        className={cn("font-bold", {
                          "text-red-800 block":
                            !availability[date.toISOString()],
                          "text-green-800": availability[date.toISOString()],
                        })}
                      >
                        {format(date, "d")}
                      </span>
                    );
                  },
                }}
                disabled={[
                  ...disabledDays,
                  {
                    before: new Date(),
                  },
                ]}
              />
            </PopoverContent>
          </Popover>

          <Button type="submit">Get tickets</Button>
        </fieldset>
      </Form>
    </main>
  );
}
