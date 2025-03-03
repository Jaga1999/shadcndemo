import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getCurrentDateTime = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return now.toLocaleDateString("en-US", options);
};

export const toastMessage = (message: string, type: "success" | "error" = "success") => {
  const description = getCurrentDateTime();
  const action = {
    label: "Undo",
    onClick: () => console.log("Undo"),
  };

  if (type === "success") {
    toast(message, { description, action });
  } else {
    toast.error(message, { description, action });
  }
};