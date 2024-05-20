export const formatTask = (task) => {
  return (
    "task-" + task._id + "/" + task.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .slice(0, 6)
      .join("-")
  );
};
