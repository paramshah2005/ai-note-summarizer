"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Wand2, Copy } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleSummarize(selectedFile);
    }
  };

  const handleSummarize = async (fileToSummarize: File) => {
    setLoading(true);
    setSummary("");
    setError("");
    const formData = new FormData();
    formData.append("file", fileToSummarize);
    try {
      const extractRes = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });
      if (!extractRes.ok) {
        throw new Error("Failed to extract text from PDF.");
      }
      const { text, error: extractError } = await extractRes.json();
      if (extractError) {
        throw new Error(extractError);
      }
      const summarizeRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!summarizeRes.ok) {
        throw new Error("Failed to get summary from the server.");
      }
      const { summary, error: summarizeError } = await summarizeRes.json();
      if (summarizeError) {
        throw new Error(summarizeError);
      }
      setSummary(summary);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white p-4">
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora-shape-1"></div>
        <div className="aurora-shape-2"></div>
        <div className="aurora-shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-2xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            <Sparkles className="w-10 h-10 text-yellow-300" />
            AI Note Summarizer
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Instantly distill your lengthy PDF notes into concise, easy-to-digest summaries with the power of AI.
          </p>
        </motion.header>
        <br />
        <br />
        {/* Uploader and Summary Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`glass-card border border-white/10 shadow-lg transition-all duration-300 ${summary ? "max-h-[80vh]" : "max-h-[50vh]"}`}
        >
          <div className={`py-8 px-4 sm:py-12 sm:px-8 transition-all duration-300 ${loading ? "h-48" : "h-auto"}`}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <Loader2 className="animate-spin text-yellow-300 w-12 h-12" />
                  <p className="mt-4 text-lg text-gray-300">
                    {file ? `Extracting text from ${file.name}...` : "Preparing to summarize..."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="uploader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center h-full flex flex-col justify-center"
                >
                  <h2 className="text-2xl font-semibold mb-2">
                    {file ? `Ready to summarize: ${file.name}` : "Upload Your PDF"}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Drag and drop your file here or click to select one.
                  </p>
                  <br />
                  <button
                    onClick={triggerFileSelect}
                    aria-label={file ? "Choose another file" : "Select a PDF file"}
                    className="bg-yellow-400 text-gray-900 font-bold py-3 px-10 rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 hover:shadow-yellow-300/50 flex items-center gap-2 mx-auto"
                  >
                    <Wand2 />
                    {file ? "Choose Another File" : "Select PDF"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    aria-label="Upload your PDF file"
                    className="hidden"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary/Error Display */}
          <AnimatePresence>
            {(summary || error) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="border-t border-white/20 p-8"
              >
                {summary && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold text-yellow-300">✨ Your Summary</h2>
                      <button
                        onClick={() => navigator.clipboard.writeText(summary)}
                        className="text-sm bg-white/10 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                    <div className="prose prose-invert text-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
                      {summary}
                    </div>
                  </div>
                )}
                {error && (
                  <div>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">An Error Occurred</h2>
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                      onClick={() => setError("")}
                      className="bg-red-500/20 text-red-300 px-4 py-2 rounded"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
