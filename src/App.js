import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [allJobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(5);
  const [jobDetails, setJobDetails] = useState({});

  const loadMore = () => {
    setVisibleJobs((prev) => prev + 5);
  };

  const getJobDetails = async (jobId) => {
    console.log(`getting job details for ${jobId}`);
    axios
      .get(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`)
      .then((res) => {
        console.log(res.data);
        setJobDetails((prev) => ({
          ...prev,
          [jobId]: res.data,
        }));
      })
      .catch((e) => console.error(e));
  };

  const getJobPostings = async () => {
    const options = {
      url: `https://hacker-news.firebaseio.com/v0/jobstories.json`,
      method: "get",
    };
    axios(options)
      .then((res) => {
        // console.log(res.data);
        setJobs(res.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getJobPostings();
  }, []);

  useEffect(() => {
    allJobs?.slice(0, visibleJobs).forEach((job) => {
      if (!jobDetails[job]) {
        getJobDetails(job);
      }
    });
  }, [allJobs, visibleJobs]);

  return (
    <>
      <div>
        <h1>Jobs:</h1>
        {allJobs.slice(0, visibleJobs).map((job) => (
          <div key={job}>
            {jobDetails[job] ? (
              <>
                <p>Title: {jobDetails[job]?.title}</p>
                <p>By: {jobDetails[job]?.by}</p>
                <p>
                  Link: <a href={jobDetails[job]?.url}>Link</a>
                </p>
                <hr/>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        ))}
      </div>
      {visibleJobs < allJobs?.length && (
        <button onClick={loadMore}>load more</button>
      )}
    </>
  );
}

export default App;
