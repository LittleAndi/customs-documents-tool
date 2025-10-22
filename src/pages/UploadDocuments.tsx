import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUploadZone, { UploadFile } from "@/components/FileUploadZone";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const UploadDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFilesAdded = (files: File[]) => {
    const newFiles: UploadFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      status: "queued",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setUploadComplete(false);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please add files before uploading");
      return;
    }

    setIsUploading(true);
    setUploadComplete(false);

    // Simulate upload process
    for (const file of uploadedFiles) {
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" as const } : f))
      );

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly succeed or fail for demo purposes (90% success rate)
      const success = Math.random() > 0.1;

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: success ? "completed" : "failed" } : f
        )
      );
    }

    setIsUploading(false);
    setUploadComplete(true);
    toast.success("Upload complete! Documents are being processed.");
  };

  const hasCompletedFiles = uploadedFiles.some((f) => f.status === "completed");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Customs Documents</CardTitle>
          <CardDescription>
            Upload your shipment or container documents (PDF format). The system will
            automatically analyze and verify them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploadZone
            onFilesAdded={handleFilesAdded}
            uploadedFiles={uploadedFiles}
            onRemoveFile={handleRemoveFile}
          />

          {uploadedFiles.length > 0 && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? "Processing..." : "Upload & Process"}
            </Button>
          )}

          {uploadComplete && hasCompletedFiles && (
            <Alert className="bg-success/10 border-success">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success-foreground">
                Documents uploaded successfully. Processing will start shortly. You can check
                progress later by entering the container number.
              </AlertDescription>
            </Alert>
          )}

          {uploadComplete && hasCompletedFiles && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Container number(s) will be
                automatically detected from the uploaded documents.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDocuments;
