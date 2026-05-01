import { toast } from "sonner";

type NotifyType = "success" | "error" | "warning" | "info";

export function notify(type: NotifyType, title: string, description?: string) {
  const options = { description, duration: type === "error" ? 5000 : 3500 };
  if (type === "success") return toast.success(title, options);
  if (type === "error") return toast.error(title, options);
  if (type === "warning") return toast.warning(title, options);
  return toast.info(title, options);
}
