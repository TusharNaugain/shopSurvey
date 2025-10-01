import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SurveyQuestion } from "@shared/schema";
import { useState } from "react";

interface QuestionRendererProps {
  question: SurveyQuestion;
  currentAnswer: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
}

export default function QuestionRenderer({
  question,
  currentAnswer,
  onAnswerChange
}: QuestionRendererProps) {
  const [textValue, setTextValue] = useState(currentAnswer);

  const handleRatingClick = (rating: number) => {
    onAnswerChange(rating.toString());
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    onAnswerChange(value);
  };

  const getRatingScale = () => {
    switch (question.type) {
      case 'rating_5':
        return Array.from({ length: 5 }, (_, i) => i + 1);
      case 'rating_10':
        return Array.from({ length: 10 }, (_, i) => i + 1);
      default:
        return [];
    }
  };

  const getRatingLabels = () => {
    switch (question.type) {
      case 'rating_5':
        return { low: 'Very Dissatisfied', high: 'Very Satisfied' };
      case 'rating_10':
        return { low: 'Not likely', high: 'Extremely likely' };
      default:
        return { low: '', high: '' };
    }
  };

  const isRatingType = question.type === 'rating_5' || question.type === 'rating_10';
  const isTextType = question.type === 'text';

  if (isRatingType) {
    const scale = getRatingScale();
    const labels = getRatingLabels();
    const gridCols = question.type === 'rating_10' ? 'grid-cols-5 md:grid-cols-10' : 'grid-cols-5';

    return (
      <Card className="question-card card-shadow mb-6">
        <CardContent className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-medium text-foreground mb-4" data-testid="text-question">
              {question.text}
            </h3>
            <p className="text-muted-foreground">
              Please select a rating from 1 ({labels.low}) to {scale.length} ({labels.high})
            </p>
          </div>
          
          {/* Rating scale labels */}
          {labels.low && labels.high && (
            <div className="flex justify-between mb-4 text-sm text-muted-foreground">
              <span>{labels.low}</span>
              <span>{labels.high}</span>
            </div>
          )}
          
          {/* Rating buttons */}
          <div className={`grid ${gridCols} gap-3 mb-8`}>
            {scale.map((rating) => (
              <Button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                variant="outline"
                className={`rating-button font-semibold py-6 px-4 text-2xl border-2 transition-all duration-200 ${
                  currentAnswer === rating.toString()
                    ? 'selected bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground border-transparent hover:border-border'
                }`}
                data-testid={`button-rating-${rating}`}
              >
                {rating}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isTextType) {
    return (
      <Card className="question-card card-shadow mb-6">
        <CardContent className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-medium text-foreground mb-4" data-testid="text-question">
              {question.text}
            </h3>
            <p className="text-muted-foreground">
              Please share your thoughts and suggestions {question.required ? '' : '(optional)'}
            </p>
          </div>
          
          {/* Text input area */}
          <div className="mb-8">
            <Textarea 
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-4 border-2 text-lg resize-none focus:border-ring transition-colors"
              rows={6}
              placeholder="Share your thoughts here..."
              maxLength={500}
              data-testid="textarea-answer"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Your feedback helps us improve</span>
              <span data-testid="text-character-count">{textValue.length} / 500</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="question-card card-shadow mb-6">
      <CardContent className="p-8">
        <div className="text-center text-muted-foreground">
          <p>Unsupported question type: {question.type}</p>
        </div>
      </CardContent>
    </Card>
  );
}
