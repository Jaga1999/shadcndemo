import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import jwt from 'jsonwebtoken';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DecodedToken {
  email: string;
  id: string;
  username: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
};
}

export function getDecodedToken(): DecodedToken | null {
  try {
    // Get the token from the cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) return null;

    // Decode the token
    const decoded = jwt.decode(token) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
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