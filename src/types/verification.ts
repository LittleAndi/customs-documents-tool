export interface ContainerStatus {
  containerId: string;
  status: "processing" | "completed" | "failed";
  lastUpdated: string;
  result?: "valid" | "warnings" | "errors";
}

export interface Message {
  type: "error" | "warning" | "info" | "success";
  message: string;
}

export interface StatusWithMessages {
  status: "error" | "warning" | "info" | "success";
  messages: Message[];
}

export interface Article {
  articleNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  containerNumber: string;
}

export interface ConfidenceValue {
  value: any;
  confidence: {
    label: string;
    value: number;
  };
}

export interface DocumentExtractedData {
  status: string;
  messages: Message[];
  type: string;
  delimiterFormat?: {
    thousandSeparator: string;
    decimalSeparator: string;
  } | null;
  articles?: any[];
  orderNumbers?: ConfidenceValue[];
  flattenedOrderNumbers?: string[];
  containerNumbers?: ConfidenceValue[];
  flattenedContainerNumbers?: string[];
  invoiceNumber?: ConfidenceValue;
  invoiceDate?: ConfidenceValue;
  packingListDate?: ConfidenceValue;
  grossWeightTotal?: ConfidenceValue;
  itemsSubtotalAmount?: ConfidenceValue;
  deductions?: ConfidenceValue[];
  flattenedDeductions?: string[];
}

export interface DocumentDetail {
  id: string;
  originalDocumentId?: string;
  splittedDocumentId?: string;
  classifiedDocumentId?: string;
  type: string;
  hasSparePartsOrSamples: boolean;
  extractedData?: DocumentExtractedData;
  storage?: {
    bucketName: string;
    fileName: string;
  };
  createdAt: string;
  handled?: boolean;
  updatedAt?: string;
}

export interface VerificationResult {
  status: "error" | "warning" | "info" | "success";
  hasSamplesOrSpareParts: boolean;
  validationStatus: StatusWithMessages;
  documentInternalStatus: StatusWithMessages;
  articles: Article[];
  documents: {
    packingList?: DocumentDetail;
    commercialInvoice?: DocumentDetail;
    billOfLading?: DocumentDetail;
  };
}
