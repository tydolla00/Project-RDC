import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const getAllMembers = () => {
  return new Promise<string[]>((resolve, reject) => {
    resolve([
      "Mark",
      "Ippi",
      "John",
      "Aff",
      "Leland",
      "Dylan",
      "Ben",
      "Desmond",
    ]);
  });
};
export default async function Page() {
  const members = await getAllMembers();
  return (
    <div className="m-16">
      <H1>Games</H1>
      <div className="flex flex-wrap justify-center gap-10">
        {members.map((member) => (
          <Card className="h-64 w-64 shrink-0" key={member}>
            <CardHeader>
              <CardTitle>{member}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mt-10 flex gap-10">
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
          </CardHeader>
        </Card>
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
