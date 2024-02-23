import axiosInstance from "..";

export const handleUpdateUser = async (id: string, data: any) => {
  return await axiosInstance.put(`/users/${id}`, data);
};

export const uploadFile = async (file: FormData, type?: string) => {
  return await axiosInstance.post("/upload/", file, {
    headers: {
      "Content-Type": type ?? "application/pdf",
    },
  });
};
