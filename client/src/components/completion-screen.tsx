import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle, Clock, Save, Plus } from "lucide-react";

interface CompletionScreenProps {
  answeredQuestions: number;
  totalQuestions: number;
  onStartNewSurvey: () => void;
  onReturnToWelcome: () => void;
}

export default function CompletionScreen({
  answeredQuestions,
  totalQuestions,
  onStartNewSurvey,
  onReturnToWelcome
}: CompletionScreenProps) {
  return (
    <div className="kiosk-container flex flex-col justify-center items-center p-8">
      <Card className="max-w-2xl w-full card-shadow">
        <CardContent className="p-12 text-center">
          {/* Success icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-4xl text-secondary-foreground" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="title-thank-you">
              Thank You!
            </h1>
            <p className="text-xl text-muted-foreground">
              Your feedback has been successfully submitted
            </p>
          </div>
          
          {/* Completion message */}
          <div className="mb-10">
            <h2 className="text-2xl font-medium text-foreground mb-4">Survey Complete</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We appreciate you taking the time to share your thoughts with us. 
              Your feedback helps us improve our products and services.
            </p>
            
            {/* Survey summary */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center" data-testid="info-answered">
                  <CheckCircle className="mr-2 text-secondary" size={16} />
                  <span>{answeredQuestions} questions answered</span>
                </div>
                <div className="flex items-center" data-testid="info-completion-time">
                  <Clock className="mr-2" size={16} />
                  <span>Completed in 1:45</span>
                </div>
                <div className="flex items-center" data-testid="info-saved">
                  <Save className="mr-2" size={16} />
                  <span>Responses saved</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-4">
            <Button 
              onClick={onStartNewSurvey}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-12 text-xl transition-all duration-200 hover:shadow-lg w-full"
              size="lg"
              data-testid="button-start-new-survey"
            >
              <Plus className="mr-3" size={20} />
              Start New Survey
            </Button>
            
            <Button 
              onClick={onReturnToWelcome}
              variant="outline"
              className="font-medium py-3 px-8"
              data-testid="button-return-welcome"
            >
              Return to Welcome
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
