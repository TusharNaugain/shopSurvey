import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SurveyQuestion, SurveySession } from "@shared/schema";
import { apiClient } from "@/lib/api-client";
import { useDebounce } from "@/hooks/use-debounce";
import WelcomeScreen from "@/components/welcome-screen";
import SurveyScreen from "@/components/survey-screen";
import CompletionScreen from "@/components/completion-screen";

type ScreenType = 'welcome' | 'survey' | 'completion';

export default function SurveyKiosk() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [currentSession, setCurrentSession] = useState<SurveySession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [textInputValue, setTextInputValue] = useState('');
  const debouncedTextInputValue = useDebounce(textInputValue, 500);

  const { data: questions = [], isLoading } = useQuery<SurveyQuestion[]>({
    queryKey: ['/api/questions'],
  });

  const startSurvey = async () => {
    try {
      const session = await apiClient.createSession(questions.length);
      setCurrentSession(session);
      setCurrentQuestionIndex(0);
      setResponses({});
      setCurrentScreen('survey');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const saveResponse = async (questionId: string, answer: string | string[]) => {
    if (!currentSession) return;

    const newResponses = { ...responses, [questionId]: answer };
    setResponses(newResponses);

    try {
      await apiClient.saveResponse(currentSession.id, questionId, answer);
    } catch (error) {
      console.error('Failed to save response:', error);
    }
  };

  useEffect(() => {
    if (debouncedTextInputValue) {
      saveResponse(questions[currentQuestionIndex].id, debouncedTextInputValue);
    }
  }, [debouncedTextInputValue]);

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

  const completeSurvey = async () => {
    if (currentSession) {
      try {
        await apiClient.updateSession(currentSession.id, { 
          completedAt: new Date(),
          answeredQuestions: Object.keys(responses).length
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading survey...</div>
      </div>
    );
  }

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
          onAnswerChange={(answer) => {
            if (currentQuestion.type === 'text') {
              setTextInputValue(answer as string);
            } else {
              saveResponse(currentQuestion.id, answer);
              setTimeout(nextQuestion, 500);
            }
          }}
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
