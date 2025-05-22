
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Upload, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePersonalInfo, updateSummary } from '@/store/resumeSlice';

interface ResumeActionBarProps {
  id?: string;
  resumePreviewRef: React.RefObject<HTMLDivElement>;
  resumeFullName: string;
}

const ResumeActionBar = ({ id, resumePreviewRef, resumeFullName }: ResumeActionBarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const generatePDF = async () => {
    if (!resumePreviewRef.current) return;
    
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your resume.",
      });

      // Get the resume content
      const element = resumePreviewRef.current;
      
      // Create a canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit within the PDF
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content overflows a single page, split it across multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Move position to capture next portion
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      // Save the PDF
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

  const handleImportResume = () => {
    if (!resumeFile) {
      toast({
        title: "Error",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would connect to a resume parser service
    // For now, we'll simulate importing by filling in sample data
    toast({
      title: "Processing Resume",
      description: "Extracting information from your uploaded resume...",
    });

    // Simulate successful import after a short delay
    setTimeout(() => {
      // Populate with example data
      dispatch(updatePersonalInfo({
        fullName: resumeFullName || "Your Name (Imported)",
        title: "Professional Title (Imported from Resume)",
        email: "imported@example.com",
        phone: "(123) 456-7890",
        location: "New York, NY"
      }));
      
      dispatch(updateSummary("This information was imported from your uploaded resume. In a real implementation, we would extract the actual content from your resume file."));
      
      toast({
        title: "Resume Imported",
        description: "Your resume has been successfully imported.",
      });
      
      setResumeFile(null);
    }, 2000);
  };

  const handleLinkedinImport = () => {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn URL.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processing LinkedIn Profile",
      description: "Extracting information from your LinkedIn profile...",
    });

    // Simulate LinkedIn data import after a short delay
    setTimeout(() => {
      // Populate with example data
      dispatch(updatePersonalInfo({
        fullName: resumeFullName || "LinkedIn User",
        title: "Professional Title (Imported from LinkedIn)",
        email: "linkedin@example.com",
        phone: "(123) 456-7890",
        location: "San Francisco, CA",
        linkedin: linkedinUrl
      }));
      
      dispatch(updateSummary("This information was imported from your LinkedIn profile. In a real implementation, we would extract your actual LinkedIn profile content."));
      
      toast({
        title: "LinkedIn Import Complete",
        description: "Your resume has been populated with LinkedIn data.",
      });
      
      setLinkedinUrl('');
    }, 2000);
  };

  const navigateToAtsScore = () => {
    navigate(`/dashboard/resumes/${id}/ats`);
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
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
      
      <div className="flex items-center gap-2 flex-wrap">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 h-9 px-3" size="sm">
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
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
            <Button variant="outline" className="flex items-center gap-1 h-9 px-3" size="sm">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Existing Resume</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Upload your existing resume to populate the editor.
              </p>
              <Input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleImportResume} className="w-full">
                Import Resume
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          onClick={navigateToAtsScore}
          className="flex items-center gap-1 h-9 px-3"
          size="sm"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">ATS Score</span>
        </Button>
        
        <Button 
          onClick={generatePDF} 
          className="flex items-center gap-1 h-9 px-3"
          size="sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default ResumeActionBar;
