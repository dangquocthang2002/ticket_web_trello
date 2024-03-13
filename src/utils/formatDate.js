import { format, parseISO } from "date-fns";

export const formatDate = (dateInPut) => {
  return format(
    parseISO(dateInPut, "yyyy-MM-dd", new Date()),
    " MMM d yyyy h:mm  a"
  );
};
