import { useContext, useState } from "react";
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
    const title = resumeInfo?.experiences?.[index]?.jobTitle;

    if (!title) {
      toast("⚠️ Please add a Position Title before generating.");
      return;
    }
    setLoading(true);
    try {
      const result =
        await AIClient.generate(`Write a concise 2–3 sentence with resume summary for a ${title}.
  Avoid using "I", personal opinions, or years of experience. Write 3–5 professional resume bullet points for a person's work experience.
Each point should:

Begin with a strong action verb (e.g., Coordinated, Facilitated, Organized, Delivered, Supported)

Emphasize real responsibilities, improvements, or outcomes in the role

Highlight interpersonal, organizational, or operational skills

Include specific results, scale, or impact if possible (e.g., “served 300+ clients”, “reduced wait times by 20%”)

Avoid technical jargon or software developer language You can set styled with html tags like ul, bold, i...`);
      const resultValue = result?.candidates?.[0]?.content.parts?.[0].text;
      setValue(resultValue);
      onRichTextEditorChange({ target: { value: resultValue } });
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
        <label className="text-sm">Summary</label>
      </div>

      <div className="flex justify-between mb-4">
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
