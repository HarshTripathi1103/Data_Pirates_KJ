"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerateResponse {
  content: string;
  metadata?: {
    model: string;
    tone: string;
    timestamp: string;
  };
  error?: string;
  details?: string;
}

const BlogGeneratorPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [displayedContent, setDisplayedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] =
    useState<GenerateResponse["metadata"]>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (generatedContent && !loading) {
      setIsAnimating(true);
      let currentIndex = 0;
      const paragraphs = generatedContent.split("\n").filter(Boolean);
      let animatedText = "";

      const animate = () => {
        if (currentIndex < generatedContent.length) {
          animatedText += generatedContent[currentIndex];
          setDisplayedContent(animatedText);
          currentIndex++;
          setTimeout(animate, 10);
        } else {
          setIsAnimating(false);
        }
      };

      animate();
    }
  }, [generatedContent, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedContent("");
    setDisplayedContent("");
    setMetadata(undefined);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tone,
        }),
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate blog content");
      }

      if (data.error) {
        setError(data.error);
        if (data.details) {
          // console.error("Error details:", data.details);
        }
        return;
      }

      if (data.content) {
        setGeneratedContent(data.content);
        if (data.metadata) {
          setMetadata(data.metadata);
        }
      } else {
        throw new Error("No content received from API");
      }
    } catch (error) {
      // console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <Card className="mt-8 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      );
    }

    if (generatedContent) {
      return (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Generated Blog</h2>
            {metadata && (
              <div className="text-sm text-gray-500 mb-4">
                <p>Generated using {metadata.model}</p>
                <p>Tone: {metadata.tone}</p>
                <p>
                  Generated on: {new Date(metadata.timestamp).toLocaleString()}
                </p>
              </div>
            )}
            <div className="prose max-w-none">
              {isAnimating ? (
                <div className="relative">
                  {displayedContent
                    .split("\n")
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                        {index ===
                          displayedContent.split("\n").filter(Boolean).length -
                            1 && <span className="animate-pulse">|</span>}
                      </p>
                    ))}
                </div>
              ) : (
                generatedContent
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 p-4 ml-50">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">AI Blog Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blog Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a brief description of what you want to write about"
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Writing Tone
                  </label>
                  <Select
                    value={tone}
                    onValueChange={(value) => setTone(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || isAnimating}
          >
            {loading ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              "Generate Blog"
            )}
          </Button>
        </form>

        {renderContent()}
      </div>
    </div>
  );
};

export default BlogGeneratorPage;
