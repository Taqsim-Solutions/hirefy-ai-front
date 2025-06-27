import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Brain, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { editResume } from "@/api";
import { AIClient } from "../../../../../services/AIClient";

function Skills({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [skills, setSkills] = useState(resumeInfo?.skills || "");
  const [loading, setLoading] = useState(false);

  const generateSkillsFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error("Please provide a job title first.");
      return;
    }

    const prompt = `
Job Title: ${resumeInfo.jobTitle}.
Generate a comma-separated list of 15 relevant professional skills for this role.
Return plain text only.
    `.trim();

    setLoading(true);
    try {
      const result = await AIClient.generate(prompt);
      const resultText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      setSkills(resultText);
    } catch (error) {
      console.error("AI skill generation failed:", error);
      toast.error("❌ Failed to generate skills.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    editResume({ ...resumeInfo, skills }, resumeId)
      .then(() => {
        toast.success("Skills saved successfully!");
        enabledNext(true);
      })
      .catch((err) => {
        toast.error("❌ Failed to save skills.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (skills) {
      setResumeInfo({ ...resumeInfo, skills });
    }
  }, [skills]);

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Skills</h2>
        <p>List your professional skills. Separate by commas or line breaks.</p>

        <form onSubmit={handleSave} className="mt-7">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium">Your Skills</label>
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={generateSkillsFromAI}
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5 h-[120px]"
            required
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
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
    </div>
  );
}

export default Skills;
