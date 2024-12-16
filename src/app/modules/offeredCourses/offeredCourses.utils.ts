import { TDay } from "./offeredCourses.interface";

export type TSchedule = {
  days: TDay[];
  startTime: string;
  endTime: string;
};

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
): boolean => {
  const newStartTime = new Date(`2000-07-26T${newSchedule.startTime}:00Z`);
  const newEndTime = new Date(`2000-07-26T${newSchedule.endTime}:00Z`);

  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`2000-07-26T${schedule.startTime}:00Z`);
    const existingEndTime = new Date(`2000-07-26T${schedule.endTime}:00Z`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime)
      return true;
  }
  return false;
};
