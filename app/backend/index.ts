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

type Feature = {
  id: string;
};

export async function checkAvailability(
  date: Date,
  guests: number,
  features?: Feature[]
) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(randomBoolean(0.1)), randomLatency());
  });
}
