import React, { useState } from "react";
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
  Bookmark
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockQuestion = {
  id: "1",
  title: "How do I implement JWT authentication in React with TypeScript?",
  description: `<p>I'm trying to implement JWT authentication in my React application using TypeScript. I've set up the backend with Node.js and Express, but I'm struggling with the frontend implementation.</p>

<p><strong>What I've tried:</strong></p>
<ul>
<li>Using localStorage to store the token</li>
<li>Creating a custom hook for authentication</li>
<li>Setting up protected routes</li>
</ul>

<p>The issue I'm facing is that the token expires after some time, but my frontend doesn't handle this gracefully. How can I implement automatic token refresh?</p>`,
  author: "john_doe",
  createdAt: "2 hours ago",
  tags: ["react", "typescript", "jwt", "authentication"],
  votes: 15,
  views: 234,
  accepted: false
};

const mockAnswers = [
  {
    id: "1",
    content: `<p>Here's a comprehensive approach to handle JWT authentication with automatic refresh:</p>

<p><strong>1. Create an Auth Context:</strong></p>
<pre><code>const AuthContext = createContext&lt;AuthContextType | null&gt;(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};</code></pre>

<p><strong>2. Implement Token Refresh:</strong></p>
<p>Use axios interceptors to automatically refresh tokens when they expire.</p>`,
    author: "expert_dev",
    createdAt: "1 hour ago",
    votes: 8,
    accepted: true
  },
  {
    id: "2",
    content: `<p>Another approach is to use React Query for better caching and error handling:</p>

<p>This gives you automatic retries and better UX when dealing with authentication failures.</p>`,
    author: "react_master",
    createdAt: "45 minutes ago",
    votes: 3,
    accepted: false
  }
];

export default function QuestionDetail() {
  const navigate = useNavigate();
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswerTips, setShowAnswerTips] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      console.log('Submitting answer:', newAnswer);
      setNewAnswer('');
    }
  };

  const answerValid = newAnswer.replace(/<[^>]*>/g, '').length >= 30;

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
                          {mockQuestion.votes} votes
                        </span>
                        <span>{mockQuestion.views} views</span>
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
                      <span className="font-bold text-xl text-muted-foreground">{mockQuestion.votes}</span>
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
                      {mockQuestion.title}
                    </h1>
                    
                    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'} mb-4 text-sm text-muted-foreground`}>
                      <span>Asked {mockQuestion.createdAt}</span>
                      {!isMobile && <span>Viewed {mockQuestion.views} times</span>}
                    </div>

                    <div 
                      className={`prose prose-sm max-w-none mb-4 sm:mb-6 ${isMobile ? 'text-sm' : ''}`}
                      dangerouslySetInnerHTML={{ __html: mockQuestion.description }}
                    />

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {mockQuestion.tags.map((tag) => (
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
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`text-sm ${isMobile ? 'text-left' : 'text-right'}`}>
                          <div className="text-muted-foreground">asked {mockQuestion.createdAt}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-blue-600">{mockQuestion.author}</div>
                              <div className="text-xs text-muted-foreground">1,234 reputation</div>
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
                {mockAnswers.length} Answer{mockAnswers.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Answers */}
            <div className="space-y-4 sm:space-y-6">
              {mockAnswers.map((answer) => (
                <Card 
                  key={answer.id} 
                  className={`shadow-sm border-border/50 ${
                    answer.accepted ? 'border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-950/10' : ''
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
                            {answer.accepted && (
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
                          {answer.accepted && (
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
                          dangerouslySetInnerHTML={{ __html: answer.content }}
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
                                  <div className="font-medium text-blue-600">{answer.author}</div>
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
                    disabled={!answerValid}
                    className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'w-full' : 'min-w-[120px]'}`}
                    size={isMobile ? "default" : "default"}
                  >
                    Post Your Answer
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
                      <div className="font-semibold text-lg">{mockQuestion.votes}</div>
                      <div className="text-muted-foreground">votes</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{mockAnswers.length}</div>
                      <div className="text-muted-foreground">answers</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{mockQuestion.views}</div>
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
                    <span>{mockQuestion.createdAt}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Viewed</span>
                    <span>{mockQuestion.views} times</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span>today</span>
                  </div>
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
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                    How to handle JWT token expiration in React?
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                    React authentication with protected routes
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                    TypeScript best practices for auth context
                  </a>
                  {!isMobile && (
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                      Implementing refresh tokens in React
                    </a>
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
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                      Best practices for React state management
                    </a>
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                      How to optimize React performance?
                    </a>
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                      Understanding TypeScript generics
                    </a>
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