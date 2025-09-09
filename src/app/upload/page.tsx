// src/app/upload/page.tsx

"use client";

import { useRef, useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Upload,
  FileVideo,
  FileImage,
  Trash2,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

const MAX_LEN = 1000;

export default function UploadPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"video" | "photo">("video");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeMB = selectedFile ? selectedFile.size / 1024 / 1024 : 0;

  // keep preview URL in sync + cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSet(file);
  };

  const validateAndSet = (file?: File) => {
    setError(null);
    if (!file) return;

    const okType =
      file.type.startsWith("image/") ||
      (file.type.startsWith("video/") &&
        (file.type.includes("mp4") || file.type.includes("quicktime")));

    if (!okType) {
      setError(
        "Unsupported file type. Use JPG/PNG for images or MP4/MOV for videos."
      );
      return;
    }
    const tooBig = file.size > 1024 * 1024 * 200; // 200MB cap
    if (tooBig) {
      setError("File is too large. Max size is 200 MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) validateAndSet(files[0]);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      setError("Please write a message before publishing.");
      return;
    }
    console.log("Uploading:", { content, file: selectedFile, mode });
    alert("Post uploaded! (Demo mode)");
    router.push("/");
  };

  const ContentHeader = () => (
    <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 rounded-t-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-1">
            What&apos;s happening in your area? Share your story, updates, or
            thoughts...
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );

  const SegmentedToggle = () => (
    <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
      <button
        onClick={() => setMode("photo")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
          mode === "photo"
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-pressed={mode === "photo"}
      >
        <FileImage size={18} />
        Photo
      </button>
      <button
        onClick={() => setMode("video")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
          mode === "video"
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-pressed={mode === "video"}
      >
        <FileVideo size={18} />
        Video
      </button>
    </div>
  );

  const Dropzone = () => (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload media. Drag and drop or browse."
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
      }}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all outline-none
        ${
          dragActive
            ? "border-orange-400 bg-orange-50"
            : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/40"
        }
        ${selectedFile ? "border-green-400 bg-green-50/50" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {selectedFile ? (
        <div className="space-y-4">
          {/* Preview area */}
          <div className="w-full mx-auto overflow-hidden rounded-xl border border-gray-200 bg-black/5">
            {selectedFile.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl ?? ""}
                alt="Selected preview"
                className="w-full h-auto object-contain max-h-[360px]"
              />
            ) : (
              <video
                src={previewUrl ?? ""}
                className="w-full max-h-[420px]"
                controls
                preload="metadata"
              />
            )}
          </div>

          {/* Meta + actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
              {selectedFile.type.startsWith("video/") ? (
                <FileVideo size={16} />
              ) : (
                <FileImage size={16} />
              )}
              <span className="truncate max-w-[60vw] sm:max-w-[32ch]">
                {selectedFile.name}
              </span>
              <span className="text-gray-400">•</span>
              <span>{sizeMB.toFixed(2)} MB</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="border border-gray-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={16} className="mr-2" />
                Change
              </Button>
              <Button type="button" variant="secondary" onClick={removeFile}>
                <Trash2 size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ImageIcon size={48} className="mx-auto text-gray-400" />
          <div>
            <p className="text-gray-900 font-semibold text-base">
              Upload media
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Drag & drop your files here, or{" "}
              <span className="font-medium text-orange-600">
                click to browse
              </span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
            <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
            <span className="bg-gray-100 px-2 py-1 rounded">MP4</span>
            <span className="bg-gray-100 px-2 py-1 rounded">MOV</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );

  const Tips = () => (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h4 className="font-medium text-blue-900 mb-2">📢 Posting Guidelines</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• Share accurate information and verify facts when possible</li>
        <li>
          • Respect privacy and avoid posting personal information of others
        </li>
        <li>
          • Use clear, descriptive content to help others understand the
          situation
        </li>
        <li>• Report urgent situations to appropriate authorities as well</li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="p-4 bg-white">
          {/* title only, centered */}
          <div className="relative flex items-center justify-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
          </div>

          <div className="mb-4 flex justify-center">
            <SegmentedToggle />
          </div>

          <div className="mb-6">
            <Dropzone />
          </div>

          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LEN))}
              placeholder="What's happening in your area? Share your story..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none 
                         focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                         text-black placeholder:text-gray-400"
              rows={5}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span className="text-xs text-gray-400">
                Be respectful and truthful in your reporting
              </span>
              <span
                className={
                  content.length > MAX_LEN * 0.8 ? "text-orange-500" : ""
                }
              >
                {content.length}/{MAX_LEN}
              </span>
            </div>
          </div>

          {/* Actions (Go Back + Post) with tight spacing */}
          <div className="space-y-2 mt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Go Back
            </button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="w-full bg-gradient-to-r from-red-500 to-blue-500 
                         hover:from-red-600 hover:to-blue-600 
                         focus:ring-2 focus:ring-red-300 
                         text-white font-medium rounded-xl py-3"
            >
              <span className="flex w-full items-center justify-center gap-2">
                <Upload size={16} />
                <span>Post</span>
              </span>
            </Button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 inline-flex items-center gap-2">
              <Info size={16} /> {error}
            </p>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="max-w-4xl mx-auto p-6">
          <div className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <ContentHeader />

            <div className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Create Your Post
                    </h3>
                    <p className="text-sm text-gray-600">
                      Share photos, videos, and updates
                    </p>
                  </div>
                  <SegmentedToggle />
                </div>

                <Dropzone />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Message
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value.slice(0, MAX_LEN))
                    }
                    placeholder="What's happening in your area? Share your story..."
                    className="w-full p-4 border border-gray-300 rounded-xl resize-none 
                               focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                               text-black placeholder:text-gray-400"
                    rows={5}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span className="text-xs text-gray-400">
                      Be respectful and truthful in your reporting
                    </span>
                    <span
                      className={
                        content.length > MAX_LEN * 0.8 ? "text-orange-500" : ""
                      }
                    >
                      {content.length}/{MAX_LEN}
                    </span>
                  </div>
                </div>

                {/* Actions (Go Back + Publish) with tight spacing */}
                <div className="space-y-2 mt-2">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    Go Back
                  </button>

                  <Button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="w-full py-4 text-lg font-semibold 
                               bg-gradient-to-r from-red-500 to-blue-500 
                               hover:from-red-600 hover:to-blue-600 
                               focus:ring-2 focus:ring-red-300 
                               text-white rounded-xl"
                    size="lg"
                  >
                    <span className="flex w-full items-center justify-center gap-3">
                      <Upload size={20} />
                      <span>Publish Post</span>
                    </span>
                  </Button>
                </div>

                <Tips />

                {error && (
                  <div className="text-sm text-red-600 inline-flex items-center gap-2">
                    <Info size={16} /> {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
