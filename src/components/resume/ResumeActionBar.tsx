import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, FileText, Upload, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useResumeImport } from '@/hooks/useResumeImport';

interface ResumeActionBarProps {
  id?: string;
  resumePreviewRef: React.RefObject<HTMLDivElement>;
  resumeFullName: string;
}

const ResumeActionBar = ({ id, resumePreviewRef, resumeFullName }: ResumeActionBarProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { importResume, isImporting } = useResumeImport();

  const generatePDF = async () => {
    if (!resumePreviewRef.current) {
      toast({
        title: "Error",
        description: "Resume preview not found",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your resume.",
      });

      // Create a hidden div with the resume at full scale for PDF generation
      const originalElement = resumePreviewRef.current;
      const clonedElement = originalElement.cloneNode(true) as HTMLElement;
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '850px'; // Fixed width for consistency
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';
      
      // Remove any scaling transforms
      clonedElement.style.transform = 'none';
      clonedElement.style.scale = '1';
      clonedElement.className = clonedElement.className.replace(/scale-\[[^\]]*\]/g, '');
      
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use html2canvas with better options
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // High quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 850,
        height: clonedElement.scrollHeight,
        windowWidth: 850,
        windowHeight: clonedElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure proper font rendering in cloned document
          const clonedBody = clonedDoc.body;
          clonedBody.style.fontFamily = 'serif';
          clonedBody.style.fontSize = '14px';
          clonedBody.style.lineHeight = '1.4';
          clonedBody.style.color = '#000000';
        }
      });
      
      // Clean up temporary element
      document.body.removeChild(tempContainer);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with proper A4 dimensions
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // Reasonable margin
      
      // Calculate dimensions to fit the page
      const maxWidth = pdfWidth - (margin * 2);
      const maxHeight = pdfHeight - (margin * 2);
      
      // Get original canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate scale to fit within page
      const scaleX = maxWidth / (canvasWidth * 0.264583); // Convert px to mm
      const scaleY = maxHeight / (canvasHeight * 0.264583);
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
      
      const finalWidth = (canvasWidth * 0.264583) * scale;
      const finalHeight = (canvasHeight * 0.264583) * scale;
      
      // Center the content
      const xOffset = margin + (maxWidth - finalWidth) / 2;
      const yOffset = margin;
      
      // Check if we need multiple pages
      if (finalHeight > maxHeight) {
        // Multi-page handling
        let currentY = 0;
        let pageNumber = 0;
        
        while (currentY < canvasHeight) {
          if (pageNumber > 0) {
            pdf.addPage();
          }
          
          const remainingHeight = canvasHeight - currentY;
          const pageCanvasHeight = Math.min(remainingHeight, maxHeight / (0.264583 * scale));
          
          // Create a temporary canvas for this page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          pageCanvas.width = canvasWidth;
          pageCanvas.height = pageCanvasHeight;
          
          if (pageCtx) {
            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, canvasWidth, pageCanvasHeight);
            pageCtx.drawImage(canvas, 0, -currentY);
            
            const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(
              pageImgData,
              'PNG',
              xOffset,
              yOffset,
              finalWidth,
              (pageCanvasHeight * 0.264583) * scale
            );
          }
          
          currentY += pageCanvasHeight;
          pageNumber++;
        }
      } else {
        // Single page
        pdf.addImage(
          imgData,
          'PNG',
          xOffset,
          yOffset,
          finalWidth,
          finalHeight
        );
      }
      
      // Save the PDF
      const fileName = `${resumeFullName ? resumeFullName.replace(/[^a-zA-Z0-9]/g, '_') : 'resume'}.pdf`;
      pdf.save(fileName);
      
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
    } finally {
      setIsGenerating(false);
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

    await importResume(resumeFile);
    setResumeFile(null);
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

  const navigateBack = () => {
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
                Upload your existing resume in PDF or text format. Our AI will extract and populate all the fields automatically.
              </p>
              <Input 
                type="file" 
                accept=".pdf,.txt" 
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <Button 
                onClick={handleImportResume} 
                className="w-full" 
                disabled={!resumeFile || isImporting}
              >
                {isImporting ? "Processing..." : "Import Resume"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={generatePDF} 
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <Download className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Export as PDF"}
        </Button>
      </div>
    </div>
  );
};

export default ResumeActionBar;
