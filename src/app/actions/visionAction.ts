import { AzureKeyCredential } from "@azure/core-auth";
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";

const client = DocumentIntelligence("endpoint", new AzureKeyCredential("key"));

const modelId = "custom-rdc";
