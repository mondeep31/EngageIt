import { Card } from "@/components/ui/card";

const VisualizationChart = () => {
  return (
    <Card className="bg-white p-6 shadow-sm mb-4">
      <div className="h-[400px] w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50">
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-gray-500">Visualization Chart Area</p>
        </div>
      </div>
    </Card>
  );
};

export default VisualizationChart;
