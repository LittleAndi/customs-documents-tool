import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentDetail } from "@/types/verification";
import { FileText, Package } from "lucide-react";

interface DocumentDetailsCardProps {
  title: string;
  document?: DocumentDetail;
}

const DocumentDetailsCard = ({ title, document }: DocumentDetailsCardProps) => {
  if (!document) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {title}
          </CardTitle>
          {document.hasSparePartsOrSamples && (
            <Badge variant="outline" className="gap-1">
              <Package className="h-3 w-3" />
              Has Samples/Spare Parts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {document.storage && (
          <div>
            <p className="text-xs text-muted-foreground">File Name</p>
            <p className="text-sm font-mono break-all">{document.storage.fileName}</p>
          </div>
        )}
        
        {document.extractedData?.flattenedContainerNumbers && 
         document.extractedData.flattenedContainerNumbers.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Container Numbers</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {document.extractedData.flattenedContainerNumbers.map((num, idx) => (
                <Badge key={idx} variant="secondary" className="font-mono text-xs">
                  {num}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {document.extractedData?.flattenedOrderNumbers && 
         document.extractedData.flattenedOrderNumbers.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Order Numbers</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {document.extractedData.flattenedOrderNumbers.map((num, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {num}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {document.extractedData?.invoiceNumber && (
          <div>
            <p className="text-xs text-muted-foreground">Invoice Number</p>
            <p className="text-sm font-mono">
              {document.extractedData.invoiceNumber.value}
              <span className="text-xs text-muted-foreground ml-2">
                ({document.extractedData.invoiceNumber.confidence.label})
              </span>
            </p>
          </div>
        )}

        {document.extractedData?.grossWeightTotal && (
          <div>
            <p className="text-xs text-muted-foreground">Gross Weight</p>
            <p className="text-sm">
              {document.extractedData.grossWeightTotal.value} kg
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground">Status</p>
          <Badge 
            variant={document.extractedData?.status === "success" ? "default" : "secondary"}
            className="mt-1"
          >
            {document.extractedData?.status || "Unknown"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentDetailsCard;
