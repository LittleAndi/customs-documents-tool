import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import ValidationMessages from "@/components/ValidationMessages";
import ArticlesTable from "@/components/ArticlesTable";
import DocumentDetailsCard from "@/components/DocumentDetailsCard";
import { VerificationResult } from "@/types/verification";
import { ArrowLeft, Download, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";

const ResultDetails = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!containerId) return;

      setIsLoading(true);
      try {
        const data = await api.get<VerificationResult>(`/containers/${containerId}/status`);
        setResult(data);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to load container details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [containerId]);

  const handleDownload = () => {
    toast.success("Results exported successfully");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
              <CardTitle className="text-2xl font-mono">{containerId}</CardTitle>
              <CardDescription>
                Verification completed • {result.articles.length} articles processed
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={result.status} />
              {result.hasSamplesOrSpareParts && (
                <Badge variant="outline" className="gap-1">
                  <Package className="h-3 w-3" />
                  Samples/Spare Parts
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Validation Status */}
          {result.validationStatus.messages.length > 0 && (
            <>
              <ValidationMessages
                title="Validation Status"
                messages={result.validationStatus.messages}
              />
              <Separator />
            </>
          )}

          {/* Document Internal Status */}
          {result.documentInternalStatus.messages.length > 0 && (
            <>
              <ValidationMessages
                title="Document Processing"
                messages={result.documentInternalStatus.messages}
              />
              <Separator />
            </>
          )}

          {/* Articles Table */}
          {result.articles.length > 0 && (
            <>
              <ArticlesTable articles={result.articles} />
              <Separator />
            </>
          )}

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DocumentDetailsCard
                title="Packing List"
                document={result.documents.packingList}
              />
              <DocumentDetailsCard
                title="Commercial Invoice"
                document={result.documents.commercialInvoice}
              />
              <DocumentDetailsCard
                title="Bill of Lading"
                document={result.documents.billOfLading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDetails;
