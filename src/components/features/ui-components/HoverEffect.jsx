import { HoverEffect } from "@/components/ui/card-hover-effect";

export function CardHoverEffect({projects}) {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

