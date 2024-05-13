import axiosInstance from "..";

export const getTrafficDevice = async () => {
  const { data: ios } = await axiosInstance.get(
    `/wa-schedules/?filters[device][$eq]=ios`
  );
  const { data: android } = await axiosInstance.get(
    `/wa-schedules/?filters[device][$eq]=android`
  );
  const { data: web } = await axiosInstance.get(
    `/wa-schedules/?filters[device][$eq]=web`
  );
  const { data: total } = await axiosInstance.get(`/wa-schedules`);
  const { data: scheduleds } = await axiosInstance.get(
    `/wa-schedules/?filters[hour][$ne]=`
  );

  const devices = {
    ios: ios.meta.pagination.total,
    android: android.meta.pagination.total,
    web: web.meta.pagination.total,
    total: total.meta.pagination.total,
    scheduleds: scheduleds.meta.pagination.total,
  };

  return devices;
};
