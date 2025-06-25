import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from '../../services/GlobalApi'
import ResumeCardItem from './components/ResumeCardItem'

function Dashboard() {
  const { user } = useUser()
  const [resumeList, setResumeList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      GetResumesList()
    }
  }, [user])

  /**
   * Fetch user resumes with error handling
   */
  const GetResumesList = async () => {
    setLoading(true)
    try {
      const resp = await GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
      const data = resp?.data?.data
      if (Array.isArray(data)) {
        setResumeList(data)
      } else {
        setResumeList([])
      }
    } catch (error) {
      console.error('Failed to load resumes:', error)
      setResumeList([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>

      <div
        className="
          grid grid-cols-2
          md:grid-cols-3 lg:grid-cols-5 gap-5
          mt-10
        "
      >
        <AddResume />

        {/* Show loading placeholders */}
        {loading && (
          <>
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
              />
            ))}
          </>
        )}

        {/* Show resume cards if not loading and have resumes */}
        {!loading && Array.isArray(resumeList) && resumeList.length > 0 ? (
          resumeList.map((resume) => (
            <ResumeCardItem
              key={resume.id || resume._id || resumeList.indexOf(resume)}
              resume={resume}
              refreshData={GetResumesList}
            />
          ))
        ) : null}

        {/* Show no resumes message if not loading and empty */}
        {!loading && Array.isArray(resumeList) && resumeList.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            You have no resumes yet. Click “Add Resume” to create your first one.
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
