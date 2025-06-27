import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { editResume } from "@/api";

function PersonalDetail({ enabledNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    enabledNext(false);

    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setResumeInfo(updated);
  };

  useEffect(() => {
    setFormData(resumeInfo);
  }, [resumeInfo]);

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);

    editResume(formData, params?.resumeId)
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

  const fields = [
    { name: "firstName", label: "First Name", colSpan: 1 },
    { name: "lastName", label: "Last Name", colSpan: 1 },
    { name: "jobTitle", label: "Job Title", colSpan: 2 },
    { name: "address", label: "Address", colSpan: 2 },
    { name: "phone", label: "Phone", colSpan: 1 },
    { name: "email", label: "Email", colSpan: 1 },
  ];

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-4">
          {fields.map(({ name, label, colSpan }) => (
            <div key={name} className={`col-span-${colSpan}`}>
              <label className="text-sm mb-2 block">{label}</label>
              <Input
                name={name}
                required
                value={formData?.[name] || ""}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetail;
