export interface ContainerStatus {
  containerId: string;
  status: "processing" | "completed" | "failed";
  lastUpdated: string;
  result?: "valid" | "warnings" | "errors";
}

export interface DocumentInfo {
  type: string;
  fileName: string;
  status: "valid" | "warnings" | "errors";
  notes?: string;
}

export interface ConsistencyCheck {
  check: string;
  result: "pass" | "warning" | "fail";
  details?: string;
}

export interface VerificationResult {
  containerId: string;
  timestamp: string;
  overallResult: "valid" | "warnings" | "errors";
  summary: {
    shipper?: string;
    consignee?: string;
    origin?: string;
    destination?: string;
    declaredValue?: string;
    weight?: string;
    packages?: number;
    documentsProcessed: number;
  };
  documents: DocumentInfo[];
  consistencyChecks: ConsistencyCheck[];
}
