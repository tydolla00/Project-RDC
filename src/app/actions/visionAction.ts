import { AzureKeyCredential } from "@azure/core-auth";
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";

const client = DocumentIntelligence(
  process.env["DOCUMENT_INTELLIGENCE_ENDPOINT"]!,
  {
    key: process.env["DOCUMENT_INTELLIGENCE_API_KEY"]!,
  },
);
const modelId = "custom-rdc";

export const analyzeScreenshot = async (base64Source: string) => {
  const initialResponse = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
    .post({
      contentType: "application/json",
      body: {
        urlSource:
          "https://raw.githubusercontent.com/Azure/azure-sdk-for-js/6704eff082aaaf2d97c1371a28461f512f8d748a/sdk/formrecognizer/ai-form-recognizer/assets/forms/Invoice_1.pdf",
      },
      queryParameters: { locale: "en-IN" },
    });
  if (!initialResponse) {
    throw new Error(`Error analyzing document: ${initialResponse}`);
  }

  const result = initialResponse;
  console.log("Analysis Result:", result);
  return result;
};
