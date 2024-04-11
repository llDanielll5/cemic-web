import axiosInstance from "..";

export const getTimesheetOfDay = async (day: string, employeeId?: string) => {
  return await axiosInstance.get(
    `/timesheets/?filters[day]=${day}&filters[employee]=${employeeId}`
  );
};

export const createTimesheetOfEmployee = async () => {
  return;
};
