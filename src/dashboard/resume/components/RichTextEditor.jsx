import React, { useContext, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { Brain, LoaderCircle } from "lucide-react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  Separator,
} from "react-simple-wysiwyg";
import { toast } from "sonner";

import { AIClient } from "@services/AIClient";
import { buildExperiencePrompt } from "@services/promptBuilder";
import { LanguageToneSelector } from "@/components/LanguageToneSelector";

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("professional");

  const handleGenerateFromAI = async () => {
    const title = resumeInfo?.Experience?.[index]?.title;

    if (!title) {
      toast("⚠️ Please add a Position Title before generating.");
      return;
    }

    setLoading(true);
    try {
      const prompt = buildExperiencePrompt(title, { language, tone });
      const result = await AIClient.generate(prompt);

      setValue(result);
      onRichTextEditorChange({ target: { value: result } });
    } catch (err) {
      console.error("AI error:", err);
      toast("❌ Failed to generate content from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-2">
        <label className="text-xs text-gray-600">Summary</label>
      </div>

      <LanguageToneSelector
        language={language}
        tone={tone}
        setLanguage={setLanguage}
        setTone={setTone}
      />

      <div className="flex justify-between mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate from AI
            </>
          )}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
