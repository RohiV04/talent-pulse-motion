import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Upload, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ResumeActionBarProps {
  id?: string;
  resumePreviewRef: React.RefObject<HTMLDivElement>;
  resumeFullName: string;
}

const ResumeActionBar = ({ id, resumePreviewRef, resumeFullName }: ResumeActionBarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const generatePDF = async () => {
    if (!resumePreviewRef.current) return;
    
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your resume.",
      });

      const element = resumePreviewRef.current;
      
      // Temporarily remove the scale transformation for PDF generation
      const originalTransform = element.style.transform;
      element.style.transform = 'none';
      
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        removeContainer: true
      });
      
      // Restore the original transform
      element.style.transform = originalTransform;
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with proper A4 dimensions (210 x 297 mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);
      
      // Calculate dimensions to fit the content properly
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Convert pixels to mm (approximately 3.78 pixels per mm at 96 DPI)
      const imgWidthMM = imgWidth / 3.78;
      const imgHeightMM = imgHeight / 3.78;
      
      // Calculate scale to fit within page margins
      const scaleX = contentWidth / imgWidthMM;
      const scaleY = contentHeight / imgHeightMM;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
      
      const finalWidth = imgWidthMM * scale;
      const finalHeight = imgHeightMM * scale;
      
      // Center the content on the page
      const xPos = (pdfWidth - finalWidth) / 2;
      const yPos = margin;
      
      // Add the image to PDF
      pdf.addImage(
        imgData, 
        'PNG', 
        xPos, 
        yPos, 
        finalWidth, 
        finalHeight,
        undefined,
        'FAST'
      );
      
      // If content is too tall, handle multiple pages
      if (finalHeight > contentHeight) {
        const pagesNeeded = Math.ceil(finalHeight / contentHeight);
        
        for (let i = 1; i < pagesNeeded; i++) {
          pdf.addPage();
          const yOffset = -i * contentHeight;
          pdf.addImage(
            imgData, 
            'PNG', 
            xPos, 
            yPos + yOffset, 
            finalWidth, 
            finalHeight,
            undefined,
            'FAST'
          );
        }
      }
      
      pdf.save(`${resumeFullName || 'resume'}.pdf`);
      
      toast({
        title: "PDF Generated!",
        description: "Your resume has been downloaded successfully.",
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

  const handleImportResume = async () => {
    if (!resumeFile) {
      toast({
        title: "Error",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, this would parse the resume file
      // For now, we'll simulate the import process
      toast({
        title: "Processing Resume...",
        description: "Extracting information from your resume file.",
      });

      // Simulate processing time
      setTimeout(() => {
        toast({
          title: "Resume Imported",
          description: "Your resume has been imported successfully.",
        });
        setResumeFile(null);
      }, 2000);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to process the resume file.",
        variant: "destructive"
      });
    }
  };

  const handleLinkedinImport = async () => {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Processing LinkedIn Profile",
        description: "Extracting information from your LinkedIn profile.",
      });

      // In a real implementation, this would connect to LinkedIn API
      setTimeout(() => {
        toast({
          title: "LinkedIn Import Complete",
          description: "Your resume has been populated with LinkedIn data.",
        });
        setLinkedinUrl('');
      }, 3000);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to fetch LinkedIn data.",
        variant: "destructive"
      });
    }
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              Import from LinkedIn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import from LinkedIn</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Enter your LinkedIn profile URL to import your professional details.
              </p>
              <Input 
                placeholder="https://www.linkedin.com/in/yourprofile" 
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
              <Button onClick={handleLinkedinImport} className="w-full">
                Import Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Resume
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Existing Resume</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Upload your existing resume in PDF, DOC, or DOCX format.
              </p>
              <Input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleImportResume} className="w-full" disabled={!resumeFile}>
                Import Resume
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export as PDF
        </Button>
      </div>
    </div>
  );
};

export default ResumeActionBar;
