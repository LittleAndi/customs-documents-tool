import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { ContainerStatus } from "@/types/verification";
import { toast } from "sonner";
import { Search, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockStatuses: Record<string, ContainerStatus> = {
  ABCD1234567: {
    containerId: "ABCD1234567",
    status: "processing",
    lastUpdated: "2025-10-22 10:42",
  },
  EFGH8901234: {
    containerId: "EFGH8901234",
    status: "completed",
    lastUpdated: "2025-10-22 10:40",
    result: "warnings",
  },
  IJKL5678901: {
    containerId: "IJKL5678901",
    status: "completed",
    lastUpdated: "2025-10-22 09:58",
    result: "valid",
  },
};

const CheckStatus = () => {
  const [containerInput, setContainerInput] = useState("");
  const [results, setResults] = useState<ContainerStatus[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!containerInput.trim()) {
      toast.error("Please enter at least one container number");
      return;
    }

    setIsSearching(true);

    // Parse container numbers (comma-separated)
    const containerIds = containerInput
      .split(",")
      .map((id) => id.trim().toUpperCase())
      .filter((id) => id.length > 0);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundResults: ContainerStatus[] = containerIds.map((id) => {
      // Check if we have mock data for this container
      if (mockStatuses[id]) {
        return mockStatuses[id];
      }
      // Return a not found result
      return {
        containerId: id,
        status: "failed" as const,
        lastUpdated: new Date().toISOString().split("T")[0] + " " + new Date().toLocaleTimeString(),
      };
    });

    setResults(foundResults);
    setIsSearching(false);

    if (foundResults.length > 0) {
      toast.success(`Found ${foundResults.length} container(s)`);
    }
  };

  const handleViewDetails = (containerId: string) => {
    navigate(`/result/${containerId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Check Processing Status</CardTitle>
          <CardDescription>
            Enter one or more container numbers to check their verification status and results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="container-input">Container Number(s)</Label>
            <div className="flex gap-2">
              <Input
                id="container-input"
                placeholder="e.g., ABCD1234567 or ABCD1234567, EFGH8901234"
                value={containerInput}
                onChange={(e) => setContainerInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                <Search className="h-4 w-4" />
                {isSearching ? "Searching..." : "Check Status"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You can enter multiple container numbers separated by commas
            </p>
          </div>

          {results.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Container</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((container) => (
                    <TableRow key={container.containerId}>
                      <TableCell className="font-mono font-medium">
                        {container.containerId}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={container.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {container.lastUpdated}
                      </TableCell>
                      <TableCell>
                        {container.result ? (
                          <StatusBadge status={container.result} />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {container.status === "completed" && container.result && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(container.containerId)}
                            className="gap-1"
                          >
                            View Details
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {results.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter container numbers above to check their status</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Demo Container Numbers</CardTitle>
          <CardDescription>
            Try these sample container numbers to see the system in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.keys(mockStatuses).map((id) => (
              <Button
                key={id}
                variant="outline"
                size="sm"
                onClick={() => setContainerInput(id)}
                className="font-mono"
              >
                {id}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckStatus;
