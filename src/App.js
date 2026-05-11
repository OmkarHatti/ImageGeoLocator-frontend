import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "https://imagegeolocator-backend-2.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status === "success") {
        setResult(res.data.data);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>ImageGeoLocator 🌍</h1>

        <p className="subtitle">
          Upload an image to detect GPS location
        </p>

        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />

          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="preview"
            />
          ) : (
            <div className="placeholder">
              <span>📸</span>
              <p>Click to Upload Image</p>
            </div>
          )}
        </label>

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload & Locate"}
        </button>

        {result && (
          <div className="result">

            {/* LOCATION SECTION */}
            {result.lat && result.lon ? (
              <>
                <h3>📍 Location Found</h3>

                <div className="result-item">
                  <span>Latitude</span>
                  <p>{result.lat}</p>
                </div>

                <div className="result-item">
                  <span>Longitude</span>
                  <p>{result.lon}</p>
                </div>
              </>
            ) : (
              <>
                <h3>❌ Location Not Found</h3>

                <p className="no-location">
                  This image does not contain GPS location data.
                </p>
              </>
            )}

            {/* OTHER METADATA */}
            <div className="result-item">
              <span>Date & Time</span>
              <p>{result.date_time || "N/A"}</p>
            </div>

            <div className="result-item">
              <span>Camera Brand</span>
              <p>{result.camera_make || "N/A"}</p>
            </div>

            <div className="result-item">
              <span>Camera Model</span>
              <p>{result.camera_model || "N/A"}</p>
            </div>

            {/* GOOGLE MAPS LINK AT LAST */}
            {result.lat && result.lon && (
              <a
                href={`https://www.google.com/maps?q=${result.lat},${result.lon}`}
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                Open in Google Maps →
              </a>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;