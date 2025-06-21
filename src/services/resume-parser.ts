
interface ParsedResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
}

const extractResumeData = async (resumeText: string): Promise<ParsedResumeData> => {
  const apiKey = "AIzaSyCL8SCp-YKOz9EoLMIFNY0KEXeTjS1CFt8";
  
  const functionDeclaration = {
    name: "extract_resume_data",
    description: "Extract structured data from resume text",
    parameters: {
      type: "object",
      properties: {
        personalInfo: {
          type: "object",
          properties: {
            fullName: { type: "string", description: "Full name of the person" },
            title: { type: "string", description: "Professional title or job title" },
            email: { type: "string", description: "Email address" },
            phone: { type: "string", description: "Phone number" },
            location: { type: "string", description: "Location/address" },
            website: { type: "string", description: "Personal website URL" },
            linkedin: { type: "string", description: "LinkedIn profile URL" }
          },
          required: ["fullName"]
        },
        summary: {
          type: "string",
          description: "Professional summary or objective statement"
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Job title" },
              company: { type: "string", description: "Company name" },
              location: { type: "string", description: "Job location" },
              startDate: { type: "string", description: "Start date (MM/YYYY format)" },
              endDate: { type: "string", description: "End date (MM/YYYY format or 'Present')" },
              description: { type: "string", description: "Job description and achievements" }
            },
            required: ["title", "company", "startDate", "description"]
          }
        },
        education: {
          type: "array",
          items: {
            type: "object",
            properties: {
              degree: { type: "string", description: "Degree name" },
              school: { type: "string", description: "School/University name" },
              location: { type: "string", description: "School location" },
              graduationDate: { type: "string", description: "Graduation date (MM/YYYY format)" },
              description: { type: "string", description: "Additional details, GPA, honors, etc." }
            },
            required: ["degree", "school"]
          }
        },
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Skill name" }
            },
            required: ["name"]
          }
        },
        projects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Project title" },
              description: { type: "string", description: "Project description" },
              technologies: { type: "string", description: "Technologies used (comma-separated)" },
              link: { type: "string", description: "Project URL or repository link" },
              startDate: { type: "string", description: "Project start date (MM/YYYY format)" },
              endDate: { type: "string", description: "Project end date (MM/YYYY format or 'Present')" }
            },
            required: ["title", "description"]
          }
        }
      },
      required: ["personalInfo"]
    }
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Please extract all relevant information from this resume text and structure it according to the function schema. Parse dates into MM/YYYY format where possible. Here's the resume text:\n\n${resumeText}`
              }
            ]
          }
        ],
        tools: [
          {
            function_declarations: [functionDeclaration]
          }
        ],
        tool_config: {
          function_calling_config: {
            mode: "ANY",
            allowed_function_names: ["extract_resume_data"]
          }
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
      const functionCall = data.candidates[0].content.parts[0].functionCall;
      if (functionCall.name === "extract_resume_data") {
        return functionCall.args as ParsedResumeData;
      }
    }
    
    throw new Error("Failed to extract resume data with function calling");
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
};

// Function to extract text from different file types
const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      // For PDF files, we'll use a simple approach for now
      // In a real application, you'd use a PDF parsing library
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // This is a simplified approach - in production you'd use pdf-parse or similar
          const text = e.target?.result as string;
          resolve(text || 'Unable to extract text from PDF');
        } catch (error) {
          reject(new Error('Failed to parse PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsText(file);
    } else {
      reject(new Error('Unsupported file type. Please upload a PDF or text file.'));
    }
  });
};

export { extractResumeData, extractTextFromFile };
export type { ParsedResumeData };
