import React, { useEffect, useState } from "react";
import { createImage, getAllImages, deleteImage } from "../../commonServices";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { Alert } from "@mui/material";

export default function ImageUploader() {
  const navigate = useNavigate();
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentFileInfo, setCurrentFileInfo] = useState();
  const [imagesList, setImagesList] = useState([
    {
      id: 123,
      url: `https://images.unsplash.com/photo-1600716051809-e997e11a5d52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2050&q=80`,
    },
    {
      id: 456,
      url: `https://images.unsplash.com/photo-1600716051809-e997e11a5d52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2050&q=80`,
    },
  ]);
  const [storageUsed, setStorageUsed] = useState(2);
  const [storageUsagePerDay, setStorageUsagePerDay] = useState(2);

  useEffect(async () => {
    // await getImages();
  }, []);

  const getImages = async () => {
    const username = localStorage.getItem("username");
    if (!username) onLogout();
    setLoading(true);
    const data = await getAllImages(username);
    setImagesList(data.images);
    setStorageUsed(data.storageUsed);
    setStorageUsagePerDay(data.storageUsagePerDay);
    setLoading(false);
  };

  const onFileChange = async (event) => {
    if (parseInt(storageUsed) + event.target.files[0].size / 1000 / 1000 > 8) {
      alert(
        "You have used more than 80% of your space please delete some images."
      );
    } else if (
      parseInt(storageUsed) + event.target.files[0].size / 1000 / 1000 >
      10
    ) {
      alert("You have used 100% space please delete some images.");
      setFileSelected(null);
      return;
    }

    setFileSelected(event.target.files[0]);
    const imageObj = {
      fileName: event.target.files[0].name,
      fileSize: event.target.files[0].size / 1000 / 1000,
    };
    setCurrentFileInfo(imageObj);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    await createImage(fileSelected, currentFileInfo.fileSize);
    setUploading(false);
    await getAllImages();
  };

  const onLogout = async () => {
    // prepare UI
    localStorage.removeItem("username");
    navigate("/");
  };

  const onViewLogsClick = () => {
    navigate("/logs");
  };

  const imagesPercent = useMemo(() => {
    return ((storageUsed / 10) * 100).toFixed(2);
  }, [storageUsed]);

  return (
    <>
      {isLoading ? (
        <div className="loader-styling">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <div style={{ margin: "20px" }}>
          <div style={{ margin: "20px" }}>
            <h2>Choose an Image to upload</h2>

            <input
              type="file"
              accept="images/*"
              disabled={storageUsagePerDay > 25}
              onChange={onFileChange}
            />
            <Button
              type="submit"
              disabled={storageUsagePerDay > 25}
              variant="contained"
              onClick={onFileUpload}
            >
              Upload!
            </Button>
            <Button
              variant="contained"
              style={{ float: "right" }}
              onClick={onLogout}
            >
              Logout
            </Button>

            {uploading && "    . . . File Uploading. Please Wait"}
          </div>
          <Card style={{ margin: "20px 0 20px 0", padding: 20 }}>
            <h3>Storage Info</h3>
            You have used cloud storage of {storageUsed} MB out of 10MB.
            <br />
            <label htmlFor="file">Used Storage:</label>
            <progress id="file" value={imagesPercent} max="100"></progress>
            {imagesPercent}%
            {storageUsagePerDay >= 25 && (
              <Alert className="mt-10" severity="error">
                Usage limit reached
              </Alert>
            )}
            <div className="mt-10 d-block">
              <Button
                className="mt-10 d-block"
                variant="contained"
                onClick={onViewLogsClick}
              >
                View Logs
              </Button>
            </div>
          </Card>
          <h4>Images Gallery</h4>
          {imagesList.map((item, index) => (
            <Card
              style={{
                display: "inline-block",
                margin: "10px",
                padding: "5px",
              }}
              key={`img-${index}`}
            >
              <div className="card-content">
                <img
                  src={item.url}
                  width={200}
                  height={200}
                  key={item.fileName + index}
                  style={{ margin: "20px" }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  key={item.fileName + index + "button"}
                  value={index}
                  id={index}
                  disabled={storageUsagePerDay > 25}
                  onClick={() => {
                    deleteImage(item.id).then(async () => await getImages());
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
