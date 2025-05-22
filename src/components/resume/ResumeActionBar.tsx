
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResumeActionBarProps {
  id?: string;
  resumePreviewRef: React.RefObject<HTMLDivElement>;
  resumeFullName: string;
}

const ResumeActionBar = ({ id, resumePreviewRef, resumeFullName }: ResumeActionBarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const generatePDF = async () => {
    if (!resumePreviewRef.current) return;
    
    try {
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`resume-${resumeFullName || 'untitled'}.pdf`);
      
      toast({
        title: "PDF Generated!",
        description: "Your resume has been downloaded as a PDF file.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToAtsScore = () => {
    navigate(`/dashboard/resumes/${id}/ats`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Resume Editor</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={navigateToAtsScore}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          ATS Score
        </Button>
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export as PDF
        </Button>
      </div>
    </div>
  );
};

export default ResumeActionBar;
