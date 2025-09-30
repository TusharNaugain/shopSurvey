import { useState, useEffect } from "react";
import { SurveyQuestion, SurveySession } from "@shared/schema";
import { surveyStorage } from "@/lib/survey-storage";
import WelcomeScreen from "@/components/welcome-screen";
import SurveyScreen from "@/components/survey-screen";
import CompletionScreen from "@/components/completion-screen";

type ScreenType = 'welcome' | 'survey' | 'completion';

export default function SurveyKiosk() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [currentSession, setCurrentSession] = useState<SurveySession | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load questions on component mount
    const loadedQuestions = surveyStorage.getQuestions();
    setQuestions(loadedQuestions);

    // Clear any existing session on mount
    surveyStorage.clearCurrentSession();
  }, []);

  const startSurvey = () => {
    const session = surveyStorage.createSession();
    setCurrentSession(session);
    setCurrentQuestionIndex(0);
    setResponses({});
    setCurrentScreen('survey');
  };

  const saveResponse = (questionId: string, answer: string) => {
    if (!currentSession) return;

    const newResponses = { ...responses, [questionId]: answer };
    setResponses(newResponses);

    // Save to localStorage
    surveyStorage.saveResponse({
      sessionId: currentSession.id,
      questionId,
      answer
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeSurvey();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  const completeSurvey = () => {
    if (currentSession) {
      surveyStorage.completeSession(currentSession.id);
      surveyStorage.clearCurrentSession();
    }
    setCurrentScreen('completion');
  };

  const returnToWelcome = () => {
    setCurrentScreen('welcome');
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setResponses({});
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          totalQuestions={questions.length}
          onStartSurvey={startSurvey}
        />
      )}

      {currentScreen === 'survey' && currentQuestion && currentSession && (
        <SurveyScreen
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          currentAnswer={responses[currentQuestion.id] || ''}
          canGoBack={currentQuestionIndex > 0}
          onAnswerChange={(answer) => saveResponse(currentQuestion.id, answer)}
          onNext={nextQuestion}
          onPrevious={previousQuestion}
          onSkip={skipQuestion}
        />
      )}

      {currentScreen === 'completion' && (
        <CompletionScreen
          answeredQuestions={Object.keys(responses).length}
          totalQuestions={questions.length}
          onStartNewSurvey={startSurvey}
          onReturnToWelcome={returnToWelcome}
        />
      )}
    </div>
  );
}
