import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function Sheet({ open, onClose, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        />
      )}
      <div
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {children}
      </div>
    </>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-between border-b border-border px-6 py-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, children, ...props }) {
  return (
    <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props}>
      {children}
    </h2>
  );
}

function SheetClose({ onClose, className }) {
  return (
    <button
      onClick={onClose}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

function SheetContent({ className, ...props }) {
  return <div className={cn("flex-1 overflow-y-auto p-6", className)} {...props} />;
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn("border-t border-border p-4", className)}
      {...props}
    />
  );
}

export { Sheet, SheetHeader, SheetTitle, SheetClose, SheetContent, SheetFooter };
