import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RWebShare } from "react-web-share";

import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import { getResumeById } from "@/api";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const { resumeId } = useParams();

  console.log(resumeInfo);

  useEffect(() => {
    if (resumeId) {
      getResumeById(resumeId)
        .then((res) => {
          setResumeInfo(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to fetch resume:", err);
        });
    }
  }, [resumeId]);

  const handleDownload = () => {
    window.print();
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            🎉 Congrats! Your AI-generated resume is ready!
          </h2>
          <p className="text-center text-gray-400 mt-2">
            You can now download or share your unique resume URL.
          </p>

          <div className="flex justify-between px-4 md:px-44 my-10">
            <Button onClick={handleDownload}>Download</Button>

            <RWebShare
              data={{
                text: "Hello! This is my resume. Check it out below 👇",
                url: `${
                  import.meta.env.VITE_BASE_URL
                }/my-resume/${resumeId}/view`,
                title: `${resumeInfo?.firstName || ""} ${
                  resumeInfo?.lastName || ""
                }'s Resume`,
              }}
              onClick={() => console.log("Shared successfully!")}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          {resumeInfo ? (
            <ResumePreview />
          ) : (
            <p className="text-center text-gray-500">Loading resume...</p>
          )}
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
