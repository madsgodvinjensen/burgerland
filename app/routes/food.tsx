import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { checkAvailability, getAvailableFeatures } from "~/backend";
import { ErrorMessage, Heading } from "~/components/ui/text";
import { bookingProgress } from "~/lib/cookies";

export const meta: MetaFunction = () => {
  return [{ title: "Burgerland booking" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await bookingProgress.parse(cookieHeader);

  if (!cookie || !cookie["date"] || !cookie["guests"]) {
    return redirect("/");
  }

  const foodFeatures = await getAvailableFeatures(
    new Date(cookie.date),
    parseInt(cookie.guests),
    "food"
  );

  return {
    features: foodFeatures,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await bookingProgress.parse(cookieHeader)) ?? {};

  if (!cookie || !cookie["date"] || !cookie["guests"]) {
    return redirect("/");
  }

  const food = formData.get("feature");
  if (!food) {
    throw new Response("Food not specified", {
      status: 400,
    });
  }

  const available = await checkAvailability(
    cookie.date,
    cookie.guests[food as string]
  );

  if (!available) {
    return {
      errorCode: "food-feature-not-available",
    };
  }

  cookie.features = [food];

  return redirect("/accessibility", {
    headers: {
      "Set-Cookie": await bookingProgress.serialize(cookie),
    },
  });
};

export default function Food() {
  const { features } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="p-4 flex flex-col gap-6">
      <Heading headingStyle="h2" as="h2">
        Book your food
      </Heading>
      {actionData?.errorCode ? (
        <ErrorMessage>
          The chosen eating experience was not available on the selected day.
          Pick another.
        </ErrorMessage>
      ) : null}
      <Form method="post" className="flex flex-col gap-2">
        {features.map((feature) => (
          <button
            key={feature.id}
            name="feature"
            value={feature.id}
            type="submit"
            className="flex flex-col text-left p-2 border-2 max-w-64 hover:bg-orange-400 focus:outline-2 focus:outline-black focus:outline-offset-2"
          >
            <span className="font-bold">{feature.name}</span>
            <span>{feature.description}</span>
          </button>
        ))}
      </Form>
    </main>
  );
}
