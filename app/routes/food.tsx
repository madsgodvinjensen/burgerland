import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { bookingProgress } from "~/lib/cookies";

export const meta: MetaFunction = () => {
  return [{ title: "Burgerland booking" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await bookingProgress.parse(cookieHeader);

  console.log({ cookie });

  return {};
};

export default function Food() {
  return <></>;
}
