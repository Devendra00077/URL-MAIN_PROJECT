import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [totalClicks, setTotalClicks] = useState(0);

  const handleSubmit = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
  new URL(url);
} catch (error) {
  alert("Please enter a valid URL");
  return;
}

try {
  const response = await fetch("http://localhost:3000/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  const data = await response.json();

  setShortUrl(`http://localhost:3000/url/${data.id}`);

  const analyticsResponse = await fetch(
    `http://localhost:3000/url/analytics/${data.id}`
  );

  const analyticsData = await analyticsResponse.json();

  setTotalClicks(analyticsData.totalClicks);

  console.log(data);

} catch (error) {
  alert("Server Error! Please try again.");
}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("URL Copied Successfully!");
  };

  const fetchAnalytics = async () => {
  const response = await fetch(
    `http://localhost:3000/url/analytics/${shortUrl.split("/").pop()}`
  );

  const data = await response.json();

  setTotalClicks(data.totalClicks);
};

useEffect(() => {
  if (!shortUrl) return;

  fetchAnalytics();

  const intervalId = setInterval(fetchAnalytics, 5000);

  return () => clearInterval(intervalId);
}, [shortUrl]);


 
return (
  <div className="app-container">
    <div className="url-card">
      <h1>URL Shortener</h1>
      <p>Shorten your long URLs easily</p>

      <input
        className="url-input"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter your long URL"
      />

      <button className="primary-btn" onClick={handleSubmit}>
        Shorten URL
      </button>

      {shortUrl && (
        <div className="result-box">
          <p>Your Short URL:</p>
          <a href={shortUrl} target="_blank">
            {shortUrl}
          </a>
          <button className="copy-btn" onClick={handleCopy}>
            Copy URL
          </button>
        </div>
      )}

      {shortUrl && (
        <div className="analytics-box">
          <h3>Total Clicks: {totalClicks}</h3>
        </div>
      )}
    </div>
  </div>
);

}

export default App;
