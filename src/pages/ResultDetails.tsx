import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/StatusBadge";
import { VerificationResult } from "@/types/verification";
import { ArrowLeft, Download, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockResults: Record<string, VerificationResult> = {
  EFGH8901234: {
    containerId: "EFGH8901234",
    timestamp: "2025-10-22 10:40:15",
    overallResult: "warnings",
    summary: {
      shipper: "Global Exports Ltd.",
      consignee: "ABC Imports Inc.",
      origin: "Shanghai Port",
      destination: "Los Angeles Port",
      declaredValue: "$45,000 USD",
      weight: "520 kg",
      packages: 150,
      documentsProcessed: 3,
    },
    documents: [
      {
        type: "Bill of Lading",
        fileName: "BL_1234.pdf",
        status: "valid",
      },
      {
        type: "Commercial Invoice",
        fileName: "INV_4567.pdf",
        status: "warnings",
        notes: "Value mismatch vs Packing List",
      },
      {
        type: "Packing List",
        fileName: "PL_4567.pdf",
        status: "valid",
      },
    ],
    consistencyChecks: [
      {
        check: "Container number consistent across all documents",
        result: "pass",
      },
      {
        check: "Shipper matches between Invoice & Manifest",
        result: "pass",
      },
      {
        check: "Weight (Invoice vs Packing List)",
        result: "warning",
        details: "Mismatch (500 kg vs 520 kg)",
      },
      {
        check: "Currency and declared value consistent",
        result: "pass",
      },
    ],
  },
  IJKL5678901: {
    containerId: "IJKL5678901",
    timestamp: "2025-10-22 09:58:30",
    overallResult: "valid",
    summary: {
      shipper: "European Traders GmbH",
      consignee: "Pacific Distributors",
      origin: "Rotterdam Port",
      destination: "Singapore Port",
      declaredValue: "$78,500 EUR",
      weight: "1,240 kg",
      packages: 280,
      documentsProcessed: 4,
    },
    documents: [
      {
        type: "Bill of Lading",
        fileName: "BL_9876.pdf",
        status: "valid",
      },
      {
        type: "Commercial Invoice",
        fileName: "INV_5432.pdf",
        status: "valid",
      },
      {
        type: "Packing List",
        fileName: "PL_5432.pdf",
        status: "valid",
      },
      {
        type: "Certificate of Origin",
        fileName: "COO_3210.pdf",
        status: "valid",
      },
    ],
    consistencyChecks: [
      {
        check: "Container number consistent across all documents",
        result: "pass",
      },
      {
        check: "Shipper matches between Invoice & Manifest",
        result: "pass",
      },
      {
        check: "Weight matches across documents",
        result: "pass",
      },
      {
        check: "Currency and declared value consistent",
        result: "pass",
      },
      {
        check: "HS codes present and valid",
        result: "pass",
      },
    ],
  },
};

const ResultDetails = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();

  const result = containerId ? mockResults[containerId] : null;

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No results found for container: {containerId}
            </p>
            <Button onClick={() => navigate("/check-status")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success("Results exported successfully");
  };

  const getCheckIcon = (result: "pass" | "warning" | "fail") => {
    switch (result) {
      case "pass":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/check-status")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-mono">{result.containerId}</CardTitle>
              <CardDescription>Processed on {result.timestamp}</CardDescription>
            </div>
            <StatusBadge status={result.overallResult} />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Summary Panel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipment Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(result.summary).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Documents Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Document Validation</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.documents.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{doc.type}</TableCell>
                      <TableCell className="font-mono text-sm">{doc.fileName}</TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.notes || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Consistency Checks */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Consistency Checks</h3>
            <div className="space-y-3">
              {result.consistencyChecks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="mt-0.5">{getCheckIcon(check.result)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{check.check}</p>
                    {check.details && (
                      <p className="text-sm text-muted-foreground mt-1">{check.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDetails;
