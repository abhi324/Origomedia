"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { submitVerification } from "@/lib/origometer/api";
import toast from "react-hot-toast";

interface Props {
  creatorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VerificationRequestForm({ creatorId, onSuccess, onCancel }: Props) {
  const [submittedBy, setSubmittedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [screenshotInput, setScreenshotInput] = useState("");
  const [loading, setLoading] = useState(false);

  function addScreenshot() {
    const url = screenshotInput.trim();
    if (url && !screenshots.includes(url)) {
      setScreenshots([...screenshots, url]);
      setScreenshotInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submittedBy.trim()) {
      toast.error("Please enter your email or name");
      return;
    }
    setLoading(true);
    try {
      await submitVerification({
        creator_id: creatorId,
        submitted_by: submittedBy,
        notes,
        screenshot_urls: screenshots,
      });
      toast.success("Verification request submitted. Reviewed within 48 hours.");
      onSuccess();
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#EFEFED]/60 rounded-2xl p-6 border border-gray-200/60">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-cormorant font-bold text-gray-900 text-xl">
          Request ORIGO Verification
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="eyebrow-sm text-gray-500 block mb-2">
            Your email or name *
          </label>
          <input
            className="input text-sm"
            placeholder="you@brand.com"
            value={submittedBy}
            onChange={(e) => setSubmittedBy(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="eyebrow-sm text-gray-500 block mb-2">
            Notes (optional)
          </label>
          <textarea
            className="input text-sm resize-none"
            rows={3}
            placeholder="Any additional context about this creator…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label className="eyebrow-sm text-gray-500 block mb-2">
            Analytics screenshot URLs (optional)
          </label>
          <div className="flex gap-2">
            <input
              className="input text-sm flex-1"
              placeholder="https://imgur.com/screenshot.png"
              value={screenshotInput}
              onChange={(e) => setScreenshotInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addScreenshot())
              }
            />
            <button
              type="button"
              className="btn-secondary !px-4 !py-3"
              onClick={addScreenshot}
              aria-label="Add screenshot"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
          {screenshots.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {screenshots.map((url, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 grain-bg rounded-lg px-2.5 py-1 text-xs text-gray-600 border border-gray-200/80"
                >
                  <span className="max-w-[140px] truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setScreenshots(screenshots.filter((_, j) => j !== i))
                    }
                    className="text-gray-300 hover:text-[#C8503A]"
                    aria-label="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
