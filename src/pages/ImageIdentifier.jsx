import { useState, useEffect, useRef } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as mobilenet from "@tensorflow-models/mobilenet";

const ImageIdentifier = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  const identify = async () => {
    textInputRef.current.value = "";
    if (model) {
      const results = await model.classify(imageRef.current);
      setResults(results);
    }
  };

  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  if (isModelLoading) {
    return (
      <h2 className="text-center flex justify-center items-center font-bold text-blue-500">
        Loading Image Identifier App..
      </h2>
    );
  }

  return (
    <div className="w-full h-screen md:w-[700px] md:mx-auto">
      <div className="py-3">
        <h1 className="text-center font-bold text-xl text-blue-500">
          Specie Identifier
        </h1>
      </div>
      <div className="mx-10 mb-5">
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            capture="camera"
            className="hidden"
            onChange={uploadImage}
            ref={fileInputRef}
          />
          <button
            onClick={triggerUpload}
            className="bg-gray-700 text-white rounded-sm text-xs h-6"
          >
            Upload Image
          </button>
          <input
            type="text"
            placeholder="Paste Image URL"
            ref={textInputRef}
            onChange={handleOnChange}
            className="border border-gray-400 rounded-sm text-xs text-center h-6"
          />
        </div>
      </div>
      <div className="flex justify-around items-center flex-wrap h-[50%] border border-blue-500 rounded-sm mx-10">
        {imageURL && (
          <img
            src={imageURL}
            alt="Upload Preview"
            crossOrigin="anonymous"
            ref={imageRef}
            className="w-full h-full rounded-sm"
          />
        )}
      </div>
      <div className="mx-10 py-4">
        <div className="bg-blue-700 text-white rounded-sm">
          <button
            onClick={identify}
            className="w-full h-7 flex justify-center items-center text-center text-sm font-semibold"
          >
            Identify Image
          </button>
        </div>
      </div>
      <div className="px-10">
        {results.length > 0 && (
          <div>
            {results.map((result, index) => (
              <div
                className={`border border-blue-400 rounded-sm px-5 ${
                  index === 0 ? "bg-blue-700 text-white" : ""
                }`}
                key={result.className}
              >
                <span className="text-lg font-semibold uppercase">
                  {result.className}
                </span>
                <span className="block font-light">
                  Confidence level: {(result.probability * 100).toFixed(2)}%
                  {index === 0 && (
                    <span className="text-white font-bold ml-20 text-2xl">Best Guess</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <div className="px-10 py-5">
        <div>
          {history.length > 0 && (
            <div>
              <h2 className="text-xl py-5 font-semibold text-blue-600">
                Recent Images
              </h2>
              <div className="md:flex gap-2">
                <div className="w-[150px]">
                  {history.map((image, index) => {
                    return (
                      <div key={`${image}${index}`}>
                        <img
                          src={image}
                          alt="Recent Prediction"
                          onClick={() => setImageURL(image)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ImageIdentifier;
