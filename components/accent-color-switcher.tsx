"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const accentColors = [
  { name: "Red", color: "red" },
  { name: "Blue", color: "blue" },
  { name: "Green", color: "green" },
  { name: "Purple", color: "purple" },
];

export function AccentColorSwitcher() {
  const [selectedColor, setSelectedColor] = useState(accentColors[0].color);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    document.documentElement.style.setProperty("--accent-color", color);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="sr-only">Change Accent Color</span>
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: `var(--accent-color, ${selectedColor})` }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {accentColors.map((color) => (
          <DropdownMenuItem
            key={color.color}
            onClick={() => handleColorChange(color.color)}
          >
            {color.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}