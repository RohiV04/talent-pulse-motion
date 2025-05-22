
import { useToast } from "@/hooks/use-toast";

// List of APIs we can use for generation
type AIModel = "gpt4" | "gemini";

interface GenerateDescriptionParams {
  resumeSection: string;
  jobTitle?: string;
  fieldContext?: string;
  currentText?: string;
  model?: AIModel;
}

// Gemini API implementation
const generateWithGemini = async (prompt: string, apiKey: string) => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Failed to generate text with Gemini");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

// Function to generate descriptions using the specified AI model
export const generateDescription = async ({
  resumeSection,
  jobTitle = "",
  fieldContext = "",
  currentText = "",
  model = "gemini"
}: GenerateDescriptionParams): Promise<string> => {
  
  // Build a prompt based on the resume section
  let prompt = "";
  
  switch (resumeSection) {
    case "summary":
      prompt = `Write a professional summary for a ${jobTitle || "professional"} resume. ${
        fieldContext ? `They work in ${fieldContext}.` : ""
      } ${
        currentText ? `Improve upon or incorporate elements from this existing summary: "${currentText}"` : ""
      } The summary should be concise (3-4 sentences), highlight key strengths, and be written in first person. Make it impactful and memorable.`;
      break;
    
    case "experience":
      prompt = `Write a detailed job description for a ${jobTitle || "professional"} position ${
        fieldContext ? `at ${fieldContext}` : ""
      }. ${
        currentText ? `Improve upon or incorporate elements from this existing description: "${currentText}"` : ""
      } Focus on achievements and responsibilities. Use bullet points, strong action verbs, and quantifiable results where possible. Keep it professional and concise.`;
      break;
    
    case "education":
      prompt = `Write a description for educational achievement for a ${jobTitle || "student"} ${
        fieldContext ? `at ${fieldContext}` : ""
      }. ${
        currentText ? `Improve upon or incorporate elements from this existing description: "${currentText}"` : ""
      } Include relevant coursework, achievements, activities, or projects. Keep it concise and relevant to career goals.`;
      break;
    
    default:
      prompt = `Write professional content for a resume ${resumeSection} section for a ${jobTitle || "professional"}. ${
        fieldContext ? `Context: ${fieldContext}.` : ""
      } ${
        currentText ? `Improve upon or incorporate elements from this existing text: "${currentText}"` : ""
      } Keep it concise, professional, and impactful.`;
  }

  // Add instruction for formatting
  prompt += " Format it appropriately for a resume, avoiding any unnecessary explanations or headers.";
  
  try {
    // Use the appropriate API based on the model parameter
    if (model === "gemini") {
      // Use Gemini API
      const apiKey = "AIzaSyCL8SCp-YKOz9EoLMIFNY0KEXeTjS1CFt8"; // Using the key provided by user
      return await generateWithGemini(prompt, apiKey);
    } else {
      // Fallback message if other models not implemented
      throw new Error("Selected AI model is not available");
    }
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
};

// Hook for using the AI generation in components
export const useAIGenerator = () => {
  const { toast } = useToast();

  const generateWithAI = async (params: GenerateDescriptionParams): Promise<string | null> => {
    try {
      toast({
        title: "Generating content...",
        description: "Our AI is crafting your professional content.",
      });
      
      const generatedText = await generateDescription(params);
      
      toast({
        title: "Content generated!",
        description: "AI-powered content is ready for your review.",
      });
      
      return generatedText;
    } catch (error) {
      console.error("Error in AI generation:", error);
      toast({
        title: "Generation failed",
        description: "Unable to generate content. Please try again later.",
        variant: "destructive"
      });
      return null;
    }
  };

  return { generateWithAI };
};
