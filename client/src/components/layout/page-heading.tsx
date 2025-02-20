import { Card, CardContent } from "@/components/ui/card";

const PageHeading = ({ heading }: any) => {
  return (
    <Card className="px-5 py-3.5 text-base/5 shadow-sm font-semibold text-black">
      <CardContent className="py-4">{heading}</CardContent>
    </Card>
  );
};

export default PageHeading;
