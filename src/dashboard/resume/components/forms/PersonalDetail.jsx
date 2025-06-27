import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle, UserRound } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { editResume } from "@/api";

function PersonalDetail({ enabledNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { user } = useUser();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    enabledNext(false);
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setResumeInfo({ ...resumeInfo, ...updated });
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

  const handleUseClerkPhoto = () => {
    if (user?.imageUrl) {
      const updated = { ...formData, profileImage: user.imageUrl };
      setFormData(updated);
      setResumeInfo({ ...resumeInfo, ...updated });
    }
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

          {/* Profile Image Preview */}
          <div className="col-span-2 mt-4">
            <label className="text-sm mb-2 block">Profile Image</label>
            {formData?.profileImage && (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
            )}
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleUseClerkPhoto}
              className="text-primary"
              size="sm"
            >
              <UserRound className="w-4 h-4 mr-1" />
              Use Profile Photo for resume
            </Button>

            <div className="flex items-center mt-5 gap-2.5">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-7 h-7 ring-2 ring-primary", // Tailwind classes
                  },
                }}
              />
              <p className="text-sm">
                Click avatar for uploading profile image
              </p>
            </div>
          </div>
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
