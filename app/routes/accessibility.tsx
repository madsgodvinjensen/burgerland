import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Heading } from "~/components/ui/text";
import { bookingProgress } from "~/lib/cookies";

export const meta: MetaFunction = () => {
  return [{ title: "Burgerland booking" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await bookingProgress.parse(cookieHeader);

  return {
    cookie,
  };
};

export default function Food() {
  const { cookie } = useLoaderData<typeof loader>();
  return (
    <main className="p-4 flex flex-col gap-6">
      <Heading headingStyle="h2" as="h2">
        EOL
      </Heading>
      <p>Cookie value:</p>
      <code>
        <pre>{JSON.stringify(cookie, null, 2)}</pre>
      </code>
    </main>
  );
}
