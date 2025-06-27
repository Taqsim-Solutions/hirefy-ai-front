import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { editResume } from "@/api";
import RichTextEditor from "../RichTextEditor";

function Experience({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExperienceList(
      (resumeInfo.experiences || []).map((exp) => ({
        ...exp,
        isPresent: exp.endDate === "Present",
      }))
    );
  }, [resumeInfo]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedList = experienceList.map((exp, i) =>
      i === index ? { ...exp, [name]: value } : exp
    );
    setExperienceList(updatedList);
    setResumeInfo({ ...resumeInfo, experiences: updatedList });
  };

  const handleRichTextChange = (e, index) => {
    const value = e.target.value;
    const updatedList = experienceList.map((exp, i) =>
      i === index ? { ...exp, summary: value } : exp
    );
    setExperienceList(updatedList);
    setResumeInfo({ ...resumeInfo, experiences: updatedList });
  };

  const handlePresentToggle = (index) => {
    const updatedList = experienceList.map((exp, i) =>
      i === index
        ? {
            ...exp,
            isPresent: !exp.isPresent,
            endDate: exp.isPresent ? "" : null, // toggle orqali to'g'ri holatni saqlash
          }
        : exp
    );
    setExperienceList(updatedList);
    setResumeInfo({ ...resumeInfo, experiences: updatedList });
  };

  const addExperience = () => {
    const newExp = {
      jobTitle: "",
      companyName: "",
      city: "",
      state: "",
      country: "",
      startDate: "",
      endDate: "",
      summary: "",
      isPresent: false,
      resumeId: Number(resumeId),
    };
    const updatedList = [...experienceList, newExp];
    setExperienceList(updatedList);
    setResumeInfo({ ...resumeInfo, experiences: updatedList });
  };

  const deleteExperience = (index) => {
    const updatedList = experienceList.filter((_, i) => i !== index);
    setExperienceList(updatedList);
    setResumeInfo({ ...resumeInfo, experiences: updatedList });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const cleanedExperiences = experienceList.map((exp) => ({
        ...exp,
        endDate: exp.isPresent ? null : exp.endDate,
      }));
      await editResume(
        { ...resumeInfo, experiences: cleanedExperiences },
        resumeId
      );
      toast.success("Experience saved successfully!");
      enabledNext(true);
    } catch (err) {
      console.error("Failed to save experience:", err);
      toast.error("Failed to save experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p className="mb-4">Add your previous job experiences.</p>

      {experienceList.map((exp, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 gap-x-5 border p-3 my-5 rounded-lg relative"
        >
          <Button
            type="button"
            variant="ghost"
            className="absolute top-0 right-0 text-red-500"
            onClick={() => deleteExperience(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div>
            <label className="text-xs mb-2 block">Position Title</label>
            <Input
              name="jobTitle"
              value={exp.jobTitle}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs mb-2 block">Company Name</label>
            <Input
              name="companyName"
              value={exp.companyName}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs mb-2 block">City</label>
            <Input
              name="city"
              value={exp.city}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs mb-2 block">Country</label>
            <Input
              name="country"
              value={exp.country}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs mb-2 block">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={exp.startDate}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs mb-2 block flex justify-between items-center">
              End Date
              <span className="text-xs flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={!exp.endDate}
                  onChange={() => handlePresentToggle(index)}
                  className="mr-1"
                />
                Present
              </span>
            </label>
            <Input
              type="date"
              name="endDate"
              value={exp.isPresent ? "" : exp.endDate || ""}
              onChange={(e) => handleInputChange(index, e)}
              disabled={exp.isPresent}
            />
          </div>

          <div className="col-span-2">
            <RichTextEditor
              index={index}
              defaultValue={exp.summary}
              onRichTextEditorChange={(e) => handleRichTextChange(e, index)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={addExperience}>
          + Add More Experience
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Experience;
