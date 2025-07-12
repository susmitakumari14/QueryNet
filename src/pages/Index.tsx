import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationBar, useNotifications } from "@/components/NotificationBar";

// Mock data
const mockQuestions = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine...",
    author: "User Name",
    createdAt: "5 min",
    tags: ["sql", "join"],
    votes: 0,
    answers: 0,
    accepted: false,
    views: 3
  },
  {
    id: "2", 
    title: "Question.....",
    description: "Description....",
    author: "User Name",
    createdAt: "1 min", 
    tags: ["tag", "tag2"],
    votes: 0,
    answers: 0,
    accepted: false,
    views: 1
  },
  {
    id: "3",
    title: "Question.....",
    description: "Description....",
    author: "User Name", 
    createdAt: "2 min",
    tags: ["tag", "tag2"],
    votes: 0,
    answers: 0,
    accepted: false,
    views: 2
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { notification, showNotification, dismissNotification } = useNotifications();

  const totalPages = 7;

  // Demo notification on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        showNotification({
          type: "info",
          title: "Welcome to QueryNet!",
          message: "Please login to ask questions and get personalized recommendations.",
          action: {
            label: "Login",
            onClick: () => setIsLoggedIn(true)
          }
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [showNotification, isLoggedIn]);

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 7;
    
    // Add previous button
    pages.push(
      <Button
        key="prev"
        variant="ghost"
        size="sm"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // Add page numbers
    for (let i = 1; i <= Math.min(totalPages, maxVisible); i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="px-3"
        >
          {i}
        </Button>
      );
    }

    // Add next button
    pages.push(
      <Button
        key="next"
        variant="ghost"
        size="sm"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return pages;
  };

  return (
    <>
      <NotificationBar 
        notification={notification} 
        onDismiss={dismissNotification} 
      />
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">All Questions</h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    {isLoggedIn ? "User can see questions with out login" : "Filters"}
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/ask')}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  size="sm"
                >
                  Ask New Question
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                  <Button
                    variant={selectedFilter === "Newest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("Newest")}
                  >
                    Newest
                  </Button>
                  <Button
                    variant={selectedFilter === "Unanswered" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("Unanswered")}
                  >
                    Unanswered
                  </Button>
                  <Button
                    variant={selectedFilter === "more" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("more")}
                  >
                    more ▼
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {mockQuestions.map((question) => (
                  <Card 
                    key={question.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer border-border/50"
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Stats */}
                        <div className="flex sm:flex-col items-center sm:items-center text-sm text-muted-foreground sm:min-w-[80px] space-x-4 sm:space-x-0 sm:space-y-1 justify-center sm:justify-start">
                          <div className="text-center">
                            <div className="font-medium text-xs sm:text-sm">{question.votes}</div>
                            <div className="text-xs">votes</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-xs sm:text-sm">{question.answers}</div>
                            <div className="text-xs">answers</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-xs sm:text-sm">{question.views}</div>
                            <div className="text-xs">views</div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="font-medium text-blue-600 hover:text-blue-800 mb-2 text-sm sm:text-base leading-tight">
                            {question.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                            {question.description}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="flex gap-1 sm:gap-2 flex-wrap">
                              {question.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="truncate">{question.author}</span>
                              <span>•</span>
                              <span>{question.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center mt-8 space-x-1">
                {renderPagination()}
              </div>
              
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Pagination
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {!isLoggedIn && (
                <Card className="shadow-sm border-border/50 bg-blue-50 dark:bg-blue-950/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                      Join the Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Sign up to ask questions, get answers, and connect with developers worldwide.
                    </p>
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setIsLoggedIn(true)}
                      >
                        Login
                      </Button>
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">Total Questions</span>
                    </div>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Active Users</span>
                    </div>
                    <span className="font-semibold">456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="text-sm">Questions Today</span>
                    </div>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">Answered</span>
                    </div>
                    <span className="font-semibold">89%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['javascript', 'react', 'python', 'sql', 'css', 'html', 'node.js', 'typescript'].map((tag) => (
                      <div key={tag} className="flex items-center justify-between">
                        <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30">
                          {tag}
                        </Badge>
                        <span className="text-xs text-muted-foreground">×{Math.floor(Math.random() * 100)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hot Network Questions */}
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Hot Network Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "How to optimize React performance?",
                      "Best practices for SQL queries",
                      "Understanding async/await in JavaScript",
                      "CSS Grid vs Flexbox comparison"
                    ].map((question, index) => (
                      <a 
                        key={index}
                        href="#" 
                        className="block text-sm text-blue-600 hover:text-blue-800 line-clamp-2"
                      >
                        {question}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
