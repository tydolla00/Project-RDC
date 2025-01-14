import { AzureKeyCredential } from "@azure/core-auth";
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
import sanitizedConfig from "@/lib/config";

const client = DocumentIntelligence(
  process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]!,
  {
    key: process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]!,
  },
);
const modelId = "custom-rdc";

export const analyzeScreenShotTest = async () => {
  console.log(
    "Document Endpointz: ",
    process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"],
  );
  console.log("Document API Key: ", sanitizedConfig.YOUTUBE_API_KEY);
  try {
    if (!process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]) {
      throw new Error("Missing DOCUMENT_INTELLIGENCE_ENDPOINT in .env");
    } else if (!process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]) {
      throw new Error(
        "Missing NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY in .env",
      );
    }

    const response = await fetch(
      `${process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]}documentintelligence/documentModels/{modelId}:analyze?_overload=analyzeDocument&api-version=2024-11-30`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key":
            process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]!,
        },
        body: JSON.stringify({
          urlSource: "https://i.imgur.com/QTvH8QA.png",
        }),
      },
    );
    console.log("Response: ", response);
  } catch (error) {
    console.error(error);
  }
};
