import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Clock, HelpCircle, Shield, Play } from "lucide-react";

interface WelcomeScreenProps {
  totalQuestions: number;
  onStartSurvey: () => void;
}

export default function WelcomeScreen({ totalQuestions, onStartSurvey }: WelcomeScreenProps) {
  return (
    <div className="kiosk-container flex flex-col justify-center items-center p-8">
      <Card className="max-w-2xl w-full card-shadow">
        <CardContent className="p-12 text-center">
          {/* Store branding section */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="text-3xl text-primary-foreground" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="title-store-name">
              RetailStore Survey
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us improve your shopping experience
            </p>
          </div>
          
          {/* Welcome message */}
          <div className="mb-10">
            <h2 className="text-2xl font-medium text-foreground mb-4">Welcome!</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your feedback is valuable to us. This quick survey will take approximately 2-3 minutes to complete.
              All responses are anonymous and will help us serve you better.
            </p>
          </div>
          
          {/* Survey info */}
          <div className="bg-muted rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center" data-testid="info-duration">
                <Clock className="mr-2" size={16} />
                <span>2-3 minutes</span>
              </div>
              <div className="flex items-center" data-testid="info-questions">
                <HelpCircle className="mr-2" size={16} />
                <span>{totalQuestions} questions</span>
              </div>
              <div className="flex items-center" data-testid="info-anonymous">
                <Shield className="mr-2" size={16} />
                <span>Anonymous</span>
              </div>
            </div>
          </div>
          
          {/* Start button */}
          <Button 
            onClick={onStartSurvey}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-12 text-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            size="lg"
            data-testid="button-start-survey"
          >
            <Play className="mr-3" size={20} />
            Start Survey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
