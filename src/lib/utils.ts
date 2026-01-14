import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateYearsOfExperience(experiences: { startDate: string; endDate?: string }[] = []): string {
  const validExperiences = experiences.filter(exp => exp.startDate);

  if (validExperiences.length === 0) {
    return "0 months";
  }

  const totalMonths = validExperiences.reduce((acc, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    return acc + years * 12 + months;
  }, 0);

  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (totalYears === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  }

  if (remainingMonths === 0) {
    return `${totalYears} year${totalYears !== 1 ? "s" : ""}`;
  }

  return `${totalYears} year${totalYears !== 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
}
