"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedColor, setSelectedColor] = React.useState(accentColors[0].color);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    document.documentElement.style.setProperty("--accent-color", color);
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