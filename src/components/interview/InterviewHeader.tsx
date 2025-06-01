
interface InterviewHeaderProps {
  title?: string;
  subtitle?: string;
}

const InterviewHeader = ({ 
  title = "AI Interview Practice", 
  subtitle = "Practice your interview skills with our AI-powered system" 
}: InterviewHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default InterviewHeader;
