// This is a mock to illustrate a very clever backend system.

function randomLatency() {
  return Math.random() * 1000;
}

function randomBoolean(probability: number = 0.5) {
  return Math.random() > probability;
}

export async function getTicketAvailability(
  guests: number,
  year: number,
  month: number
) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Record<string, boolean> = {};

  for (let day = 0; day <= daysInMonth; day++) {
    days[new Date(year, month, day).toISOString()] = randomBoolean();
  }

  return new Promise<Record<string, boolean>>((resolve) => {
    setTimeout(() => {
      resolve(days);
    }, randomLatency());
  });
}

type FeatureSection = "food" | "accessibility" | "merchandise";
type Feature = {
  id: string;
  name: string;
  section: FeatureSection;
  description: string;
};

const features: Feature[] = [
  {
    id: "burger-emporium",
    name: "Burger Emporium (Michelin)",
    section: "food",
    description:
      "First class eating experience, right in the heart of Burger Land. See for yourself how high a burger can be lifted!",
  },
  {
    id: "family-restaurant",
    name: "Family restaurant",
    section: "food",
    description:
      "Take a break in our nice family restaurant. Buffet serving, lots of great choices for both kids and adults. And a soft serve machine!",
  },
  {
    id: "picnic",
    name: "Picnic package",
    section: "food",
    description:
      "Pick up a picnic package at the entrance to enjoy in one of our cozy spots. Options for grill, vegetarian and vegan.",
  },
];

export async function checkAvailability(
  date: Date,
  guests: number,
  features?: Feature["id"][]
) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(randomBoolean(0.1)), randomLatency());
  });
}

export async function getAvailableFeatures(
  date: Date,
  guests: number,
  section: FeatureSection
) {
  return features.filter((x) => x.section === section && randomBoolean(0.3));
}
