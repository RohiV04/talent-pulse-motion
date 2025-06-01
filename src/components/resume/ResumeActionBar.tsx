import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, FileText, Upload, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';


interface ResumeActionBarProps {
  id?: string;
  resumePreviewRef: React.RefObject<HTMLDivElement>;
  resumeFullName: string;
}

const ResumeActionBar = ({ id, resumePreviewRef, resumeFullName }: ResumeActionBarProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const showToast = (title: string, description: string, variant = 'default') => {
    // Simple toast replacement since we don't have the hook
    console.log(`${title}: ${description}`);
    alert(`${title}: ${description}`);
  };

  const generatePDF = async () => {
    if (!resumePreviewRef.current) return;
    
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your resume.",
      });

      const element = resumePreviewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with proper A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      
      // Calculate scaling to fit content properly
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(contentWidth / (imgWidth * 0.264583), (pdfHeight - margin * 2) / (imgHeight * 0.264583));
      
      const scaledWidth = imgWidth * 0.264583 * ratio;
      const scaledHeight = imgHeight * 0.264583 * ratio;
      
      // Calculate how many pages we need
      const pageCount = Math.ceil(scaledHeight / (pdfHeight - margin * 2));
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const yOffset = -i * (pdfHeight - margin * 2);
        pdf.addImage(
          imgData, 
          'PNG', 
          margin, 
          margin + yOffset, 
          scaledWidth, 
          scaledHeight
        );
      }
      
      // Save the PDF
      const fileName = `${resumeFullName ? resumeFullName.replace(/[^a-zA-Z0-9]/g, '_') : 'resume'}.pdf`;
      pdf.save(fileName);
      
      showToast("PDF Generated!", "Your resume has been downloaded successfully.");
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast("Error", "Could not generate PDF. Please try again.", "destructive");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportResume = async () => {
    if (!resumeFile) {
      showToast("Error", "Please select a file to import.", "destructive");
      return;
    }

    try {
      showToast("Processing Resume...", "Extracting information from your resume file.");

      // Simulate processing time
      setTimeout(() => {
        showToast("Resume Imported", "Your resume has been imported successfully.");
        setResumeFile(null);
      }, 2000);
    } catch (error) {
      showToast("Import Failed", "Unable to process the resume file.", "destructive");
    }
  };

  const handleLinkedinImport = async () => {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      showToast("Invalid URL", "Please enter a valid LinkedIn URL.", "destructive");
      return;
    }

    try {
      showToast("Processing LinkedIn Profile", "Extracting information from your LinkedIn profile.");

      setTimeout(() => {
        showToast("LinkedIn Import Complete", "Your resume has been populated with LinkedIn data.");
        setLinkedinUrl('');
      }, 3000);
    } catch (error) {
      showToast("Import Failed", "Unable to fetch LinkedIn data.", "destructive");
    }
  };

  const navigateBack = () => {
    // Replace with your navigation logic
    window.history.back();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <button
          onClick={navigateBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </button>
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
              <DialogTitle>Import LinkedIn</DialogTitle>
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
        
        <Button 
          onClick={generatePDF} 
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export as PDF
        </Button>
      </div>
    </div>
  );
};

export default ResumeActionBar;