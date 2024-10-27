import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Form from "next/form";

export const SubmissionForm = () => {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Form</CardTitle>
        <CardContent>
          <form action="/">
            <Button>Submit</Button>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
