"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDecodedToken } from "@/lib/utils";

const accentColors = [
  { color: "#FF0000" }, // Red
  { color: "#0000FF" }, // Blue
  { color: "#00FF00" }, // Green
  { color: "#800080" }, // Purple
  { color: "#FFA500" }, // Orange
  { color: "#FFD700" }, // Gold
  { color: "#FF1493" }, // Deep Pink
  { color: "#00FFFF" }, // Cyan
  { color: "#8B4513" }, // Saddle Brown
  { color: "#4B0082" }, // Indigo
  { color: "#FF4500" }, // Orange Red
  { color: "#2E8B57" }, // Sea Green
];

export function AccentColorSwitcher() {
  // Initialize state from JWT token immediately
  const decoded = getDecodedToken();
  console.log("Decoded token:", decoded); // Debugging line
  console.log("Decoded preferences:", decoded?.preferences); // Debugging line
  
  const initialColor = decoded?.preferences?.accentColor || accentColors[0].color;
  const [selectedColor, setSelectedColor] = React.useState(initialColor);

  // Set initial color on mount
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", initialColor);
  }, [initialColor]);

  const handleColorChange = async (color: string) => {
    setSelectedColor(color);
    document.documentElement.style.setProperty("--accent-color", color);

    // Update preference in database if user is logged in
      try {
        await fetch('/api/users/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preferences: {
              accentColor: color
            }
          }),
        });
      } catch (error) {
        console.error('Failed to update accent color preference:', error);
      }
    
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] p-2">
        <div className="grid grid-cols-4 gap-2">
          {accentColors.map((item) => (
            <button
              key={item.color}
              className="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: item.color }}
              onClick={() => handleColorChange(item.color)}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}