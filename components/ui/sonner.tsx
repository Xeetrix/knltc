"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      richColors
      closeButton
      expand={false}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-slate-900 group-[.toaster]:border group-[.toaster]:border-slate-200/90 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:px-4 group-[.toaster]:py-3.5",
          title: "group-[.toast]:font-bold group-[.toast]:text-xs sm:group-[.toast]:text-sm group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-slate-500 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:font-semibold group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 group-[.toast]:rounded-lg group-[.toast]:font-semibold group-[.toast]:text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

