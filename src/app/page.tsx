"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  PenLine,
  Clock,
  Brain,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const TypingEffect = ({ text, className = "" }: any) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
      {displayText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-2 bg-purple-100 rounded-lg">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function IntroPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="bg-purple-100 rounded-full p-4"
            >
              <Sparkles className="w-8 h-8 text-purple-600" />
            </motion.div>
          </div>

          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            <TypingEffect text="Transform Your Ideas into Engaging Blog Posts" />
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Harness the power of AI to create compelling, SEO-optimized blog
            content in seconds. Let our advanced algorithms do the heavy lifting
            while you focus on what matters most.
          </p>

          <div className="flex justify-center space-x-4">
            <Link href="/blog">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg font-semibold flex items-center space-x-2 transform hover:scale-105 transition-transform duration-200">
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our AI Blog Generator?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create professional, engaging content with our cutting-edge AI
              technology. Save time and resources while maintaining high-quality
              output.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Writing"
              description="Advanced algorithms understand context and generate human-like content tailored to your needs."
            />
            <FeatureCard
              icon={Clock}
              title="Lightning Fast"
              description="Generate complete blog posts in seconds, not hours. Perfect for meeting tight deadlines."
            />
            <FeatureCard
              icon={PenLine}
              title="Multiple Tones"
              description="Choose from various writing styles to match your brand voice and target audience."
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to generate your perfect blog post
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter Your Topic",
                description: "Provide your blog title and brief description",
              },
              {
                step: "2",
                title: "Choose Your Tone",
                description: "Select the writing style that matches your brand",
              },
              {
                step: "3",
                title: "Generate Content",
                description: "Get your AI-generated blog post in seconds",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-purple-600 font-bold text-xl mb-4">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 ">
                    <ChevronRight className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-purple-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Content?
            </h2>
            <p className="mb-8 text-purple-100">
              Join thousands of content creators who trust our AI blog generator
            </p>
            <Link href="/blog">
              <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 rounded-full text-lg font-semibold flex items-center space-x-2 mx-auto transform hover:scale-105 transition-transform duration-200">
                <span>Start Creating Now</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
