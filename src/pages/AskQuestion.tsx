import React from "react";
import { Layout } from "@/components/Layout";
import { AskQuestionForm } from "@/components/AskQuestionForm";
import { useNavigate } from "react-router-dom";

export default function AskQuestion() {
  const navigate = useNavigate();

  const handleSubmit = (question: { title: string; description: string; tags: string[] }) => {
    console.log('New question:', question);
    // Here you would typically save to database
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AskQuestionForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </Layout>
  );
}