import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, XCircle, Info, CheckCircle2 } from "lucide-react";
import { Message } from "@/types/verification";

interface ValidationMessagesProps {
  title: string;
  messages: Message[];
}

const ValidationMessages = ({ title, messages }: ValidationMessagesProps) => {
  if (messages.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string): "default" | "destructive" => {
    return type === "error" ? "destructive" : "default";
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {messages.map((msg, index) => (
        <Alert key={index} variant={getVariant(msg.type)} className="flex items-start gap-2">
          {getIcon(msg.type)}
          <AlertDescription className="flex-1">{msg.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default ValidationMessages;
