import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "processing" | "completed" | "valid" | "warnings" | "errors" | "failed" | "error" | "warning" | "info" | "success";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "valid":
      case "success":
        return {
          icon: CheckCircle2,
          label: "Valid",
          className: "bg-success/10 text-success hover:bg-success/20",
        };
      case "warnings":
      case "warning":
        return {
          icon: AlertTriangle,
          label: "Warnings",
          className: "bg-warning/10 text-warning hover:bg-warning/20",
        };
      case "errors":
      case "error":
      case "failed":
        return {
          icon: XCircle,
          label: "Errors Found",
          className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          label: "Completed",
          className: "bg-success/10 text-success hover:bg-success/20",
        };
      case "processing":
        return {
          icon: Loader2,
          label: "Processing",
          className: "bg-primary/10 text-primary hover:bg-primary/20",
        };
      case "info":
        return {
          icon: AlertTriangle,
          label: "Info",
          className: "bg-primary/10 text-primary hover:bg-primary/20",
        };
      default:
        return {
          icon: Loader2,
          label: status,
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.className, "gap-1", className)}>
      <Icon className={cn("h-3 w-3", status === "processing" && "animate-spin")} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
