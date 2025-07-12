import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "./RichTextEditor";
import { X, HelpCircle, Info, CheckCircle } from "lucide-react";

interface AskQuestionFormProps {
  onSubmit?: (question: {
    title: string;
    description: string;
    tags: string[];
  }) => void;
  onCancel?: () => void;
}

export function AskQuestionForm({ onSubmit, onCancel }: AskQuestionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [showTitleTips, setShowTitleTips] = useState(false);
  const [showBodyTips, setShowBodyTips] = useState(false);
  const [showTagTips, setShowTagTips] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim()) && tags.length < 5) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (title.trim() && description.trim() && tags.length > 0) {
      onSubmit?.({
        title: title.trim(),
        description: description.trim(),
        tags
      });
    }
  };

  const isValid = title.trim() && description.trim() && tags.length > 0;
  const titleValid = title.trim().length >= 15;
  const bodyValid = description.trim().length >= 30;
  const tagsValid = tags.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ask a Public Question
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Get help from millions of developers around the world. Follow our guidelines to increase your chances of getting a great answer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          {/* Title Section */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Title
                  {titleValid && <CheckCircle className="h-4 w-4 text-green-500" />}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTitleTips(!showTitleTips)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Be specific and imagine you're asking a question to another person.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Input
                placeholder="e.g., How do I implement JWT authentication in React with automatic token refresh?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`text-base ${titleValid ? 'border-green-500' : title.length > 0 && !titleValid ? 'border-red-500' : ''}`}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={title.length >= 15 ? 'text-green-600' : 'text-muted-foreground'}>
                  {title.length >= 15 ? '✓' : `${Math.max(0, 15 - title.length)} more characters needed`}
                </span>
                <span className="text-muted-foreground">{title.length}/150</span>
              </div>
              
              {showTitleTips && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-sm mb-2">Writing a good title</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Summarize your problem in a one-line question</li>
                    <li>• Include relevant technologies and keywords</li>
                    <li>• Be specific about what you want to achieve</li>
                    <li>• Avoid asking multiple questions in one post</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Body Section */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  What are the details of your problem?
                  {bodyValid && <CheckCircle className="h-4 w-4 text-green-500" />}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBodyTips(!showBodyTips)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Introduce the problem and expand on what you put in the title. Minimum 30 characters.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Provide details about your question. Include what you've tried, what you expected to happen, and what actually happened. The more details you provide, the better answers you'll get."
              />
              <div className="mt-2 text-xs">
                <span className={description.replace(/<[^>]*>/g, '').length >= 30 ? 'text-green-600' : 'text-muted-foreground'}>
                  {description.replace(/<[^>]*>/g, '').length >= 30 
                    ? '✓ Good detailed question' 
                    : `${Math.max(0, 30 - description.replace(/<[^>]*>/g, '').length)} more characters needed`}
                </span>
              </div>

              {showBodyTips && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-sm mb-2">Writing a good question body</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Explain how you encountered the problem you're trying to solve</li>
                    <li>• Include relevant code samples, error messages, or logs</li>
                    <li>• Describe what you've already tried and what didn't work</li>
                    <li>• Use proper formatting for code blocks and error messages</li>
                    <li>• Be clear about what you expect to happen</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Tags
                  {tagsValid && <CheckCircle className="h-4 w-4 text-green-500" />}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagTips(!showTagTips)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Input
                placeholder="e.g., react javascript authentication jwt"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                className="text-base"
                disabled={tags.length >= 5}
              />
              
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                {tags.length > 0 ? `${tags.length}/5 tags added` : 'Press Enter to add tags'}
              </div>

              {showTagTips && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-sm mb-2">Choosing good tags</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Include the main programming languages and frameworks</li>
                    <li>• Add specific libraries or tools you're using</li>
                    <li>• Use existing popular tags when possible</li>
                    <li>• Avoid creating new tags unless absolutely necessary</li>
                    <li>• Don't include tags in your title, use the tags field instead</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              Discard Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isValid}
              className="min-w-[140px] bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              size="lg"
            >
              Post Your Question
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 order-1 lg:order-2">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                Step-by-step guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-start gap-3 p-3 rounded-md transition-colors ${titleValid ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${titleValid ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {titleValid ? '✓' : '1'}
                </div>
                <div>
                  <p className="font-medium text-sm">Write a clear title</p>
                  <p className="text-xs text-muted-foreground">Summarize your problem in a one-line question</p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-md transition-colors ${bodyValid ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${bodyValid ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {bodyValid ? '✓' : '2'}
                </div>
                <div>
                  <p className="font-medium text-sm">Describe your problem</p>
                  <p className="text-xs text-muted-foreground">Include what you've tried and what you expect</p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-md transition-colors ${tagsValid ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${tagsValid ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {tagsValid ? '✓' : '3'}
                </div>
                <div>
                  <p className="font-medium text-sm">Add relevant tags</p>
                  <p className="text-xs text-muted-foreground">Help others find your question</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Tips for getting answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">• Search for similar questions first</p>
                <p className="text-muted-foreground">• Be specific and detailed</p>
                <p className="text-muted-foreground">• Include minimal reproducible code</p>
                <p className="text-muted-foreground">• Use proper formatting</p>
                <p className="text-muted-foreground">• Accept helpful answers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}