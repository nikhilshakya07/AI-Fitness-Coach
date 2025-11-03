"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { generatePlanPDF } from "@/lib/pdf/generator";
import type { FitnessPlan } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface PDFExporterProps {
  plan: FitnessPlan;
}

export function PDFExporter({ plan }: PDFExporterProps) {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await generatePlanPDF(plan);
      toast({
        title: "PDF exported successfully",
        description: "Your fitness plan has been downloaded.",
      });
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      disabled={exporting}
      className="flex items-center gap-2"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}

