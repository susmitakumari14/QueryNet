import React from "react";
import { ChevronUp, ChevronDown, MessageSquare, Check, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  tags: string[];
  votes: number;
  answers: number;
  accepted: boolean;
  views: number;
}

interface QuestionCardProps {
  question: Question;
  showVoting?: boolean;
  onClick?: () => void;
}

export function QuestionCard({ question, showVoting = true, onClick }: QuestionCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card 
      className="hover:shadow-medium transition-all duration-200 cursor-pointer group border-border/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3 p-3 sm:p-6">
        <div className={`flex items-start gap-3 sm:gap-4 ${isMobile ? 'flex-col' : ''}`}>
          {/* Mobile Layout - Stats at top */}
          {isMobile && (
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answers} answers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{question.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{question.votes} votes</span>
                </div>
              </div>
              {question.accepted && (
                <div className="flex items-center space-x-1 text-accepted">
                  <Check className="h-4 w-4" />
                  <span className="text-xs">Accepted</span>
                </div>
              )}
            </div>
          )}

          <div className={`flex items-start gap-3 sm:gap-4 ${isMobile ? 'w-full' : ''}`}>
            {/* Desktop Voting Section */}
            {showVoting && !isMobile && (
              <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                <Button 
                  variant="vote" 
                  size="icon" 
                  className="h-8 w-8 hover:text-vote-up hover:border-vote-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <span className="font-medium text-sm text-foreground">{question.votes}</span>
                <Button 
                  variant="vote" 
                  size="icon" 
                  className="h-8 w-8 hover:text-vote-down hover:border-vote-down"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold group-hover:text-primary transition-colors line-clamp-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                {question.title}
              </h3>
              <p className={`text-muted-foreground mt-2 line-clamp-2 ${isMobile ? 'text-sm' : ''}`}>
                {question.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Desktop Stats */}
            {!isMobile && (
              <div className="flex flex-col items-end space-y-2 text-sm text-muted-foreground min-w-[100px]">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers}</span>
                  </div>
                  {question.accepted && (
                    <div className="flex items-center space-x-1 text-accepted">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Accepted</span>
                    </div>
                  )}
                </div>
                <div className="text-xs">{question.views} views</div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs sm:text-sm truncate">{question.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{question.createdAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}