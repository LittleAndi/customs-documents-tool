import { useCallback, useState } from "react";
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type FileStatus = "queued" | "uploading" | "completed" | "failed";

export interface UploadFile {
  id: string;
  file: File;
  status: FileStatus;
  progress?: number;
}

interface FileUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  uploadedFiles: UploadFile[];
  onRemoveFile: (id: string) => void;
}

const FileUploadZone = ({ onFilesAdded, uploadedFiles, onRemoveFile }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const pdfFiles = files.filter((file) => file.type === "application/pdf");

      if (pdfFiles.length !== files.length) {
        toast.error("Only PDF files are accepted");
      }

      if (pdfFiles.length > 0) {
        onFilesAdded(pdfFiles);
      }
    },
    [onFilesAdded]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        onFilesAdded(files);
        e.target.value = "";
      }
    },
    [onFilesAdded]
  );

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground mb-2">
          Drop PDF files here or click to browse
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your shipment or container documents (PDF format)
        </p>
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept=".pdf"
          multiple
          onChange={handleFileInput}
        />
        <Button asChild variant="outline">
          <label htmlFor="file-input" className="cursor-pointer">
            Browse Files
          </label>
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-foreground">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024).toFixed(1)} KB • {file.status}
                    </p>
                  </div>
                </div>
                {file.status !== "uploading" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
