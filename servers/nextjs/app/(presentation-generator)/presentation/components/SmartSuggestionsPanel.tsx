"use client";
import React, { useState, useEffect } from "react";
import { Lightbulb, Sparkles, Palette, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PresentationGenerationApi } from "../../services/api/presentation-generation";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { updateSlide } from "@/store/slices/presentationGeneration";
import { RootState } from "@/store/store";

interface Suggestion {
  id: string;
  type: 'text' | 'design';
  title: string;
  description: string;
  prompt: string;
}

interface SmartSuggestionsPanelProps {
  selectedText: string;
  slideId: string | null;
  slideIndex: number | null;
  onClose: () => void;
}

const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({
  selectedText,
  slideId,
  slideIndex,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const { presentationData } = useSelector(
    (state: RootState) => state.presentationGeneration
  );

  useEffect(() => {
    if (selectedText) {
      generateSuggestions();
    }
  }, [selectedText]);

  const generateSuggestions = () => {
    setIsGenerating(true);

    // Generate smart suggestions based on selected text
    const textSuggestions: Suggestion[] = [
      {
        id: 'improve-clarity',
        type: 'text',
        title: 'Improve Clarity',
        description: 'Make the text more clear and concise',
        prompt: `Improve the clarity and conciseness of this text: "${selectedText}". Keep the same meaning but make it more professional and easier to understand.`,
      },
      {
        id: 'expand-detail',
        type: 'text',
        title: 'Add More Detail',
        description: 'Expand with additional information',
        prompt: `Expand on this text with more details and examples: "${selectedText}". Add relevant information that would help the audience understand better.`,
      },
      {
        id: 'make-engaging',
        type: 'text',
        title: 'Make More Engaging',
        description: 'Transform into compelling content',
        prompt: `Make this text more engaging and compelling: "${selectedText}". Use storytelling techniques, active voice, and persuasive language.`,
      },
      {
        id: 'bullet-points',
        type: 'text',
        title: 'Convert to Bullets',
        description: 'Transform into bullet points',
        prompt: `Convert this text into clear, concise bullet points: "${selectedText}". Each bullet should be impactful and easy to scan.`,
      },
    ];

    const designSuggestions: Suggestion[] = [
      {
        id: 'emphasize-text',
        type: 'design',
        title: 'Emphasize Text',
        description: 'Make the selected text stand out',
        prompt: `Apply bold formatting and increase font size for this text: "${selectedText}". Make it visually prominent.`,
      },
      {
        id: 'add-visual',
        type: 'design',
        title: 'Add Visual Element',
        description: 'Suggest relevant icons or images',
        prompt: `Add a relevant icon or visual element next to this text: "${selectedText}". Choose something that reinforces the message.`,
      },
      {
        id: 'improve-layout',
        type: 'design',
        title: 'Improve Layout',
        description: 'Optimize spacing and arrangement',
        prompt: `Improve the layout and visual hierarchy around this text: "${selectedText}". Optimize spacing, alignment, and visual flow.`,
      },
      {
        id: 'color-scheme',
        type: 'design',
        title: 'Enhance Colors',
        description: 'Suggest better color combinations',
        prompt: `Enhance the color scheme around this text: "${selectedText}". Suggest colors that improve readability and visual appeal.`,
      },
    ];

    setSuggestions([...textSuggestions, ...designSuggestions]);
    setIsGenerating(false);
  };

  const applySuggestion = async (suggestion: Suggestion) => {
    if (!slideId || slideIndex === null) {
      toast.error("Could not identify the slide. Please try again.");
      return;
    }

    setApplyingId(suggestion.id);

    try {
      const response = await PresentationGenerationApi.editSlide(
        slideId,
        suggestion.prompt
      );

      if (response) {
        dispatch(updateSlide({ index: slideIndex, slide: response }));
        setAppliedSuggestions(prev => new Set(prev).add(suggestion.id));
        toast.success("Suggestion applied successfully!");
      }
    } catch (error: any) {
      console.error("Error applying suggestion:", error);
      toast.error("Failed to apply suggestion", {
        description: error.message || "Please try again.",
      });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Smart Suggestions</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Selected Text Preview */}
      {selectedText && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Selected text:</p>
          <p className="text-sm text-gray-900 italic line-clamp-3">
            "{selectedText}"
          </p>
        </div>
      )}

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-gray-600">Generating suggestions...</p>
          </div>
        ) : !selectedText ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-600 mb-1">No text selected</p>
            <p className="text-xs text-gray-500">
              Highlight text in your slides to see smart suggestions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Text Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-semibold text-gray-700">Text Improvements</h4>
              </div>
              <div className="space-y-2">
                {suggestions
                  .filter((s) => s.type === 'text')
                  .map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      isApplying={applyingId === suggestion.id}
                      isApplied={appliedSuggestions.has(suggestion.id)}
                      onApply={() => applySuggestion(suggestion)}
                    />
                  ))}
              </div>
            </div>

            {/* Design Suggestions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-pink-600" />
                <h4 className="text-sm font-semibold text-gray-700">Design Enhancements</h4>
              </div>
              <div className="space-y-2">
                {suggestions
                  .filter((s) => s.type === 'design')
                  .map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      isApplying={applyingId === suggestion.id}
                      isApplied={appliedSuggestions.has(suggestion.id)}
                      onApply={() => applySuggestion(suggestion)}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: Suggestion;
  isApplying: boolean;
  isApplied: boolean;
  onApply: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  isApplying,
  isApplied,
  onApply,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors bg-white">
      <div className="flex items-start justify-between mb-2">
        <h5 className="text-sm font-medium text-gray-900">{suggestion.title}</h5>
        {isApplied && (
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
        )}
      </div>
      <p className="text-xs text-gray-600 mb-3">{suggestion.description}</p>
      <Button
        size="sm"
        onClick={onApply}
        disabled={isApplying || isApplied}
        className="w-full"
        variant={isApplied ? "outline" : "default"}
      >
        {isApplying ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin mr-2" />
            Applying...
          </>
        ) : isApplied ? (
          "Applied"
        ) : (
          "Apply"
        )}
      </Button>
    </div>
  );
};

export default SmartSuggestionsPanel;
