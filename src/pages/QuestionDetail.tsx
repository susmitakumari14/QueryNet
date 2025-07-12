import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChevronUp, 
  ChevronDown, 
  Check, 
  User, 
  ArrowLeft,
  Star,
  BookOpen,
  HelpCircle,
  Info,
  Share,
  Bookmark,
  Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api, Question, Answer } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function QuestionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswerTips, setShowAnswerTips] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<Question[]>([]);
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.getQuestion(id);
        if (response.success && response.data) {
          setQuestion(response.data.question);
          setAnswers(response.data.answers || []);
          
          // Fetch related questions based on this question's tags
          try {
            const relatedResponse = await api.getRelatedQuestions(id, 4);
            if (relatedResponse.success && relatedResponse.data) {
              setRelatedQuestions(relatedResponse.data);
            }
          } catch (error) {
            console.error('Error fetching related questions:', error);
          }
          
          // Fetch popular questions
          try {
            const popularResponse = await api.getPopularQuestions(4);
            if (popularResponse.success && popularResponse.data) {
              setPopularQuestions(popularResponse.data);
            }
          } catch (error) {
            console.error('Error fetching popular questions:', error);
          }
        } else {
          throw new Error('Question not found');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast({
          title: "Error",
          description: "Failed to load question. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [id, navigate, toast]);

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !question || !isAuthenticated) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to post an answer",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.createAnswer({
        questionId: question._id,
        body: newAnswer.trim(),
      });

      if (response.success && response.data) {
        // Refresh the question to get updated answers
        const updatedQuestion = await api.getQuestion(question._id);
        if (updatedQuestion.success && updatedQuestion.data) {
          setQuestion(updatedQuestion.data.question);
          setAnswers(updatedQuestion.data.answers || []);
        }
        
        setNewAnswer('');
        toast({
          title: "Answer Posted!",
          description: "Your answer has been posted successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to post answer');
      }
    } catch (error) {
      console.error('Error posting answer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const answerValid = newAnswer.replace(/<[^>]*>/g, '').length >= 30;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-0 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading question...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-0 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
            <Button onClick={() => navigate('/')}>
              Back to Questions
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4 w-full sm:w-auto justify-start"
              size={isMobile ? "sm" : "default"}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>

            {/* Question */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className={`flex ${isMobile ? 'flex-col' : 'items-start'} gap-4 sm:gap-6`}>
                  {/* Mobile Stats Header */}
                  {isMobile && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border/50 pb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ChevronUp className="h-4 w-4" />
                          {question.votes?.length || 0} votes
                        </span>
                        <span>{question.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="p-1">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Desktop Voting */}
                  {!isMobile && (
                    <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                      <Button variant="ghost" size="icon" className="hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                        <ChevronUp className="h-6 w-6" />
                      </Button>
                      <span className="font-bold text-xl text-muted-foreground">{question.votes?.length || 0}</span>
                      <Button variant="ghost" size="icon" className="hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                        <ChevronDown className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 mt-2">
                        <Star className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <h1 className={`font-semibold mb-3 sm:mb-4 leading-tight ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      {question.title}
                    </h1>
                    
                    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'} mb-4 text-sm text-muted-foreground`}>
                      <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                      {!isMobile && <span>Viewed {question.views} times</span>}
                    </div>

                    <div 
                      className={`prose prose-sm max-w-none mb-4 sm:mb-6 ${isMobile ? 'text-sm' : ''}`}
                      dangerouslySetInnerHTML={{ __html: question.body }}
                    />

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} pt-4 border-t border-border/50`}>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Share</Button>
                        <Button variant="ghost" size="sm">Follow</Button>
                        {isMobile && (
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        )}
                      </div>                        <div className="flex items-center space-x-3">
                          <div className={`text-sm ${isMobile ? 'text-left' : 'text-right'}`}>
                            <div className="text-muted-foreground">asked {new Date(question.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                                <User className="h-3 w-3 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-blue-600">{question.author.username}</div>
                                <div className="text-xs text-muted-foreground">{question.author.reputation} reputation</div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers Header */}
            <div className="border-b border-border/50 pb-4">
              <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {answers.length} Answer{answers.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Answers */}
            <div className="space-y-4 sm:space-y-6">
              {answers.map((answer) => (
                <Card 
                  key={answer._id} 
                  className={`shadow-sm border-border/50 ${
                    answer.isAccepted ? 'border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-950/10' : ''
                  }`}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className={`flex ${isMobile ? 'flex-col' : 'items-start'} gap-4 sm:gap-6`}>
                      {/* Mobile Answer Stats */}
                      {isMobile && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border/50 pb-3">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <ChevronUp className="h-4 w-4" />
                              {answer.votes} votes
                            </span>
                            {answer.isAccepted && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="h-4 w-4" />
                                Accepted
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Desktop Voting */}
                      {!isMobile && (
                        <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                          <Button variant="ghost" size="icon" className="hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                            <ChevronUp className="h-6 w-6" />
                          </Button>
                          <span className="font-bold text-xl text-muted-foreground">{answer.votes}</span>
                          <Button variant="ghost" size="icon" className="hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                            <ChevronDown className="h-6 w-6" />
                          </Button>
                          {answer.isAccepted && (
                            <div className="mt-2 p-2 bg-green-500 rounded-full">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <div 
                          className={`prose prose-sm max-w-none mb-4 sm:mb-6 ${isMobile ? 'text-sm' : ''}`}
                          dangerouslySetInnerHTML={{ __html: answer.body }}
                        />
                        
                        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} pt-4 border-t border-border/50`}>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">Share</Button>
                            <Button variant="ghost" size="sm">Follow</Button>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`text-sm ${isMobile ? 'text-left' : 'text-right'}`}>
                              <div className="text-muted-foreground">answered {answer.createdAt}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-6 h-6 bg-purple-500 rounded-sm flex items-center justify-center">
                                  <User className="h-3 w-3 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-blue-600">{answer.author.username}</div>
                                  <div className="text-xs text-muted-foreground">5,678 reputation</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Answer Form */}
            <Card className="shadow-sm border-border/50 mt-6 sm:mt-8">
              <CardHeader className="p-4 sm:p-6">
                <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'}`}>
                  <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Your Answer</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnswerTips(!showAnswerTips)}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Thanks for contributing an answer! Please be sure to answer the question and provide details.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <RichTextEditor
                  content={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Enter your answer here. Provide a comprehensive solution that helps other developers..."
                />
                
                <div className="flex items-center justify-between text-sm">
                  <span className={answerValid ? 'text-green-600' : 'text-muted-foreground'}>
                    {answerValid 
                      ? '✓ Good detailed answer' 
                      : `${Math.max(0, 30 - newAnswer.replace(/<[^>]*>/g, '').length)} more characters needed`}
                  </span>
                </div>

                {showAnswerTips && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-sm mb-2">How to write a good answer</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Read the question carefully and understand what is being asked</li>
                      <li>• Provide a clear, step-by-step solution</li>
                      <li>• Include code examples when relevant</li>
                      <li>• Explain why your solution works</li>
                      <li>• Be respectful and constructive</li>
                    </ul>
                  </div>
                )}

                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} pt-4`}>
                  <div className="text-xs text-muted-foreground">
                    By posting your answer, you agree to our terms of service.
                  </div>
                  <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!answerValid || isSubmitting}
                    className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'w-full' : 'min-w-[120px]'}`}
                    size={isMobile ? "default" : "default"}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Your Answer'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 order-1 lg:order-2">
            {/* Mobile condensed stats */}
            {isMobile && (
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-lg">{question.votes?.length || 0}</div>
                      <div className="text-muted-foreground">votes</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{answers.length}</div>
                      <div className="text-muted-foreground">answers</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{question.views}</div>
                      <div className="text-muted-foreground">views</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question Stats - Desktop Only */}
            {!isMobile && (
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Question Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Asked</span>
                    <span>{new Date(question.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Viewed</span>
                    <span>{question.views.toLocaleString()} times</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span>{question.lastActivity ? 
                      new Date(question.lastActivity).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'today'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="capitalize">{question.status}</span>
                  </div>
                  {question.isPinned && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pinned</span>
                      <span className="text-blue-600">Yes</span>
                    </div>
                  )}
                  {question.isFeatured && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Featured</span>
                      <span className="text-orange-600">Yes</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Related Questions */}
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Related Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  {relatedQuestions.length > 0 ? (
                    relatedQuestions.map((relatedQ) => (
                      <a 
                        key={relatedQ._id}
                        href={`/question/${relatedQ._id}`} 
                        className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/question/${relatedQ._id}`);
                        }}
                      >
                        {relatedQ.title}
                      </a>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No related questions found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hot Network Questions - Desktop Only */}
            {!isMobile && (
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Hot Network Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    {popularQuestions.length > 0 ? (
                      popularQuestions.map((popularQ) => (
                        <a 
                          key={popularQ._id}
                          href={`/question/${popularQ._id}`} 
                          className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/question/${popularQ._id}`);
                          }}
                        >
                          {popularQ.title}
                        </a>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No popular questions available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}