import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Brain, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { editResume } from "@/api";
import { AIClient } from "../../../../../services/AIClient";

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateSummaryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error("Please provide a job title first.");
      return;
    }

    const prompt =
      `Job Title: ${resumeInfo.jobTitle}. Based on this title, generate a summary
    `.trim();

    setLoading(true);
    try {
      const result = await AIClient.generate(prompt);
      const resultValue = result?.candidates?.[0]?.content.parts?.[0].text;
      setSummary(resultValue);
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate summary suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editResume({ ...resumeInfo, summary }, resumeId);
      setResumeInfo({ ...resumeInfo, summary });
      toast.success("Summary saved successfully!");
      enabledNext(true);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("❌ Failed to save summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a brief professional summary for your job title.</p>

        <form onSubmit={handleSave} className="mt-7">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium">Your Summary</label>
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={generateSummaryFromAI}
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5 h-[160px]"
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <div className="mt-5 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoaderCircle className="animate-spin w-4 h-4" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>

      {aiSuggestions.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg mb-3">AI Suggestions</h2>
          {aiSuggestions.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummary(item.summary)}
              className="p-4 border rounded-lg shadow-sm mb-3 hover:bg-muted cursor-pointer transition"
            >
              <h3 className="text-primary font-semibold">
                Level: {item.experience_level}
              </h3>
              <p className="text-sm mt-1">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
