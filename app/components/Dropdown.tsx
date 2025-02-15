"use client";

import { useState } from "react";
import Image from "next/image";
import { ValidAIs, VALID_AIS } from "@/app/definitions/types";
import { AI_CONFIG } from "@/app/definitions/constants";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
  selectedAi: ValidAIs;
  onSelect: (ai: ValidAIs) => void;
  className?: string;
}

export default function Dropdown({
  selectedAi,
  onSelect,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
      >
        <Image
          src={AI_CONFIG[selectedAi].icon}
          alt={AI_CONFIG[selectedAi].name}
          width={24}
          height={24}
          className="rounded-sm"
        />
        <span>{AI_CONFIG[selectedAi].name}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg">
          {VALID_AIS.map((ai) => (
            <button
              key={ai}
              onClick={() => {
                onSelect(ai);
                setIsOpen(false);
              }}
              className="flex w-full items-center space-x-2 px-4 py-2 hover:bg-gray-50"
            >
              <Image
                src={AI_CONFIG[ai].icon}
                alt={AI_CONFIG[ai].name}
                width={24}
                height={24}
                className="rounded-sm"
              />
              <div className="flex flex-col items-start">
                <span className="font-medium">{AI_CONFIG[ai].name}</span>
                <span className="text-sm text-gray-500">
                  {AI_CONFIG[ai].description}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
