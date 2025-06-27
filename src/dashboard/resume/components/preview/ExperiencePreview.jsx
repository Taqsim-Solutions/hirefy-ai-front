import dayjs from "dayjs";

function ExperiencePreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        Professional Experience
      </h2>
      <hr
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />

      {resumeInfo?.experiences?.map((experience, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {experience?.jobTitle}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName} - {experience?.city},{" "}
            {experience?.country}
            <span>
              {experience?.startDate &&
                dayjs(experience?.startDate).format("MMMM YYYY")}{" "}
              -{" "}
              {experience?.isPresent
                ? "Now"
                : experience?.endDate &&
                  dayjs(experience?.endDate).format("MMMM YYYY")}
            </span>
          </h2>
          {/* <p className='text-xs my-2'>
                    {experience.workSummery}
                </p> */}
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{ __html: experience?.summary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
