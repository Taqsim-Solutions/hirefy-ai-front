import { useUser } from "@clerk/clerk-react";
import React from "react";

function PersonalDetailPreview({ resumeInfo }) {
  const { user } = useUser();
  const imageUrl = user?.imageUrl;

  const hasImage = Boolean(imageUrl);

  return (
    <div
      className={`flex ${
        hasImage ? "items-start gap-4" : "flex-col items-center"
      } mb-4`}
    >
      {hasImage && (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
      )}
      <div className={`${hasImage ? "text-left" : "text-center"} w-full`}>
        <h2
          className="font-bold text-xl"
          style={{
            color: resumeInfo?.themeColor,
          }}
        >
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        <h2 className="text-sm font-medium">{resumeInfo?.jobTitle}</h2>
        <h2
          className="font-normal text-xs"
          style={{
            color: resumeInfo?.themeColor,
          }}
        >
          {resumeInfo?.address}
        </h2>

        <div className="flex justify-between text-xs font-normal mt-1">
          <span style={{ color: resumeInfo?.themeColor }}>
            {resumeInfo?.phone}
          </span>
          <span style={{ color: resumeInfo?.themeColor }}>
            {resumeInfo?.email}
          </span>
        </div>

        <hr
          className="border-[1.5px] my-2"
          style={{
            borderColor: resumeInfo?.themeColor,
          }}
        />
      </div>
    </div>
  );
}

export default PersonalDetailPreview;
