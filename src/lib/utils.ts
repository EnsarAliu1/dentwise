import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAvatar(name: string, gender: "MALE" | "FEMALE") {
  const username = name.replace(/\s+/g, "").toLowerCase();
  const base = "https://avatar.iran.liara.run/public";
  if (gender === "FEMALE") return `${base}/girl?username=${username}`;
  // default to boy
  return `${base}/boy?username=${username}`;
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  if (phoneNumberLength < 9) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 5)} ${phoneNumber.slice(5)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 5)} ${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8, 11)}`;
};

//  ai generated 🎉
export const getNext5Days = () => {
  const dates = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (let i = 0; i < 5; i++) {
    const date = new Date(tomorrow);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

export const getAvailableTimeSlots = () => {
  return [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
};

export const APPOINTMENT_TYPES = [
  { id: "checkup", name: "Regular Checkup", duration: "60 min", durationInMinutes: 60, price: "$120" },
  { id: "cleaning", name: "Teeth Cleaning", duration: "45 min", durationInMinutes: 45, price: "$90" },
  { id: "consultation", name: "Consultation", duration: "30 min", durationInMinutes: 30, price: "$75" },
  { id: "emergency", name: "Emergency Visit", duration: "30 min", durationInMinutes: 30, price: "$150" },
];