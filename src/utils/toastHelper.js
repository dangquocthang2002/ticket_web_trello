import { toast } from "react-toastify";

export const toastError = (error) => {
  toast.error(error?.message || error || "Something went wrong");
};
export const toastSuccess = (data) => {
  toast.success(data || data?.message || "Success !!!");
};
