import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateYearsOfExperience(startDate: string, endDate: string, previousExperience: any[] = []): string {
  const experiences = [
    { startDate, endDate },
    ...previousExperience.map(exp => ({ startDate: exp.startDate, endDate: exp.endDate }))
  ];

  let totalMonths = 0;

  experiences.forEach(exp => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date(); // Use current date if no end date

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    totalMonths += years * 12 + months;
  });

  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (totalYears === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${totalYears} year${totalYears !== 1 ? 's' : ''}`;
  } else {
    return `${totalYears} year${totalYears !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
}
