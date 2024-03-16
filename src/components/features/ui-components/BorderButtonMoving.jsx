import React from "react";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/Moving_order";
export function MovingBorderButton() {
  return (
    <div>
      <Button
        className="rounded-full dark:bg-black text-white dark:text-white border-neutral-200 dark:border-slate-800
        hover:bg-white hover:text-black hover:border-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black transition-all duration-700 ease-in-out
      "
      >
        <FontAwesomeIcon
          icon={faArrowDown}
          className="text-5xl rounded-full px-3 py-3"
        />
      </Button>
    </div>
  );
}
