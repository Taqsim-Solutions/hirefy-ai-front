import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { editResume } from "@/api";

function Education({ enabledNext }) {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [loading, setLoading] = useState(false);
  const [educationalList, setEducationalList] = useState([]);

  // Sync changes with resumeInfo
  useEffect(() => {
    setResumeInfo({ ...resumeInfo, educations: educationalList });
  }, [educationalList]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setEducationalList((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [name]: value } : edu))
    );
  };

  const addEducation = () => {
    setEducationalList((prev) => [
      ...prev,
      {
        institution: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
        resumeId: Number(resumeId),
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducationalList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    editResume({ ...resumeInfo, educations: educationalList }, resumeId)
      .then(() => {
        toast.success("Details saved successfully!");
        enabledNext(true);
      })
      .catch((err) => {
        console.error("Failed to update resume:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p className="mb-4">Add your educational details</p>

      {educationalList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-4 gap-x-5 border p-3 my-5 rounded-lg relative"
        >
          <Button
            type="button"
            variant="ghost"
            className="absolute top-2 right-2 text-red-500"
            onClick={() => removeEducation(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="col-span-2">
            <label className="text-sm mb-2 block">University Name</label>
            <Input
              name="institution"
              value={item.institution}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label className="text-sm mb-2 block">Degree</label>
            <Input
              name="degree"
              value={item.degree}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label className="text-sm mb-2 block">Major</label>
            <Input
              name="major"
              value={item.major}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label className="text-sm mb-2 block">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label className="text-sm mb-2 block">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm mb-2 block">Description</label>
            <Textarea
              name="description"
              value={item.description}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-5">
        <Button variant="outline" onClick={addEducation}>
          + Add More Education
        </Button>
        <Button disabled={loading} onClick={handleSave}>
          {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Education;
