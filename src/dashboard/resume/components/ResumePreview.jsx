import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext } from "react";
import PersonalDetailPreview from "./preview/PersonalDetailPreview";
import SummeryPreview from "./preview/SummeryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EducationalPreview";
import SkillsPreview from "./preview/SkillsPreview";

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="h-full p-14 border-t-[20px] resume max-w-[1000px] m-auto"
      style={{
        borderColor: resumeInfo?.themeColor,
      }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      <SummeryPreview resumeInfo={resumeInfo} />
      {resumeInfo?.experiences?.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}
      {/* Educational  */}
      {resumeInfo?.educations?.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}
      {/* Skilss  */}
      {resumeInfo?.skills && <SkillsPreview resumeInfo={resumeInfo} />}
    </div>
  );
}

export default ResumePreview;
