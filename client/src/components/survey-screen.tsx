import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SurveyQuestion } from "@shared/schema";
import QuestionRenderer from "@/components/question-renderer";

interface SurveyScreenProps {
  question: SurveyQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer: string | string[];
  canGoBack: boolean;
  onAnswerChange: (answer: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export default function SurveyScreen({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  canGoBack,
  onAnswerChange,
  onNext,
  onPrevious,
  onSkip
}: SurveyScreenProps) {
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="kiosk-container p-8">
      {/* Header with progress */}
      <Card className="card-shadow mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground" data-testid="title-survey">
              Customer Survey
            </h2>
            <div className="text-lg font-medium text-muted-foreground" data-testid="text-progress">
              Question <span className="text-primary">{questionNumber}</span> of {totalQuestions}
            </div>
          </div>
          
          {/* Progress bar */}
          <Progress 
            value={progressPercentage} 
            className="w-full h-3"
            data-testid="progress-survey"
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <QuestionRenderer
        question={question}
        currentAnswer={currentAnswer}
        onAnswerChange={onAnswerChange}
      />

      {/* Navigation controls */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button 
              onClick={onPrevious}
              disabled={!canGoBack}
              variant="outline"
              className="font-medium py-3 px-6"
              data-testid="button-previous"
            >
              <ArrowLeft className="mr-2" size={16} />
              Previous
            </Button>
            
            <div className="flex space-x-4">
              <Button 
                onClick={onSkip}
                variant="outline"
                className="font-medium py-3 px-6"
                data-testid="button-skip"
              >
                Skip
              </Button>
              
              <Button 
                onClick={onNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8"
                data-testid="button-next"
              >
                Next
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
