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
  Award,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationBar, useNotifications } from "@/components/NotificationBar";
import { useAuth } from "@/hooks/useAuth";
import { api, Question } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([]);
  const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalUsers: 0,
    questionsToday: 0,
    answeredPercentage: 0
  });
  const { notification, showNotification, dismissNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await api.getQuestions({
          page: currentPage,
          limit: 10,
          sort: selectedFilter as 'newest' | 'active' | 'votes' | 'unanswered'
        });

        if (response.success && response.data) {
          setQuestions(response.data);
          if (response.pagination) {
            setTotalPages(response.pagination.pages);
            setTotalCount(response.pagination.total);
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, selectedFilter, toast]);

  // Fetch community stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use fallback data if stats API fails
      }
    };

    const fetchPopularQuestions = async () => {
      try {
        const response = await api.getPopularQuestions(4, 7); // Get 4 popular questions from last 7 days
        if (response.success && response.data) {
          setPopularQuestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching popular questions:', error);
      }
    };

    const fetchPopularTags = async () => {
      try {
        const response = await api.getPopularTags(8);
        if (response.success && response.data) {
          setPopularTags(response.data);
        }
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      }
    };

    fetchStats();
    fetchPopularQuestions();
    fetchPopularTags();
  }, []);

  // Demo notification on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        showNotification({
          type: "info",
          title: "Welcome to StackIt!",
          message: "Please login to ask questions and get personalized recommendations.",
          action: {
            label: "Login",
            onClick: () => navigate('/login')
          }
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [showNotification, isAuthenticated, navigate]);

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
                    {totalCount} question{totalCount !== 1 ? 's' : ''} found
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
                    variant={selectedFilter === "newest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("newest")}
                  >
                    Newest
                  </Button>
                  <Button
                    variant={selectedFilter === "unanswered" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("unanswered")}
                  >
                    Unanswered
                  </Button>
                  <Button
                    variant={selectedFilter === "votes" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("votes")}
                  >
                    Most Votes
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading questions...</span>
                  </div>
                ) : questions.length === 0 ? (
                  <Card className="border-border/50">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No questions found</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to ask a question in this community!
                      </p>
                      <Button onClick={() => navigate('/ask')}>
                        Ask the First Question
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  questions.map((question) => (
                    <Card 
                      key={question._id} 
                      className="hover:shadow-md transition-shadow cursor-pointer border-border/50"
                      onClick={() => handleQuestionClick(question._id)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          {/* Stats */}
                          <div className="flex sm:flex-col items-center sm:items-center text-sm text-muted-foreground sm:min-w-[80px] space-x-4 sm:space-x-0 sm:space-y-1 justify-center sm:justify-start">
                            <div className="text-center">
                              <div className="font-medium text-xs sm:text-sm">{question.votes?.length || 0}</div>
                              <div className="text-xs">votes</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-xs sm:text-sm">{question.answers?.length || 0}</div>
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
                              {question.body?.replace(/<[^>]*>/g, '').substring(0, 150)}
                              {question.body?.replace(/<[^>]*>/g, '').length > 150 ? '...' : ''}
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
                                <span className="truncate">{question.author.username}</span>
                                <span>•</span>
                                <span>{new Date(question.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: new Date(question.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
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
              {!isAuthenticated && (
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
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/login')}
                      >
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
                    <span className="font-semibold">{stats.totalQuestions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Active Users</span>
                    </div>
                    <span className="font-semibold">{stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="text-sm">Questions Today</span>
                    </div>
                    <span className="font-semibold">{stats.questionsToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">Answered</span>
                    </div>
                    <span className="font-semibold">{stats.answeredPercentage}%</span>
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
                    {popularTags.length > 0 ? (
                      popularTags.map((tagData) => (
                        <div key={tagData.tag} className="flex items-center justify-between">
                          <Badge 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            onClick={() => navigate(`/questions/tag/${tagData.tag}`)}
                          >
                            {tagData.tag}
                          </Badge>
                          <span className="text-xs text-muted-foreground">×{tagData.count}</span>
                        </div>
                      ))
                    ) : (
                      // Fallback content while loading
                      ['javascript', 'react', 'python', 'sql', 'css', 'html', 'node.js', 'typescript'].map((tag) => (
                        <div key={tag} className="flex items-center justify-between">
                          <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30">
                            {tag}
                          </Badge>
                          <span className="text-xs text-muted-foreground">×{Math.floor(Math.random() * 100)}</span>
                        </div>
                      ))
                    )}
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
                    {popularQuestions.length > 0 ? (
                      popularQuestions.map((question) => (
                        <button
                          key={question._id}
                          onClick={() => navigate(`/question/${question._id}`)}
                          className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 line-clamp-2"
                        >
                          {question.title}
                        </button>
                      ))
                    ) : (
                      // Fallback content while loading
                      [
                        "How to optimize React performance?",
                        "Best practices for SQL queries",
                        "Understanding async/await in JavaScript",
                        "CSS Grid vs Flexbox comparison"
                      ].map((question, index) => (
                        <div 
                          key={index}
                          className="block text-sm text-muted-foreground line-clamp-2"
                        >
                          {question}
                        </div>
                      ))
                    )}
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
