import { useRef } from "react";

import {
  Upload,
  BrainCircuit,
  LoaderCircle,
  ImagePlus,
} from "lucide-react";

interface ImageUploaderProps {
  selectedFile: File | null;
  preview: string | null;
  loading: boolean;
  error: string;

  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onPredict: () => void;
}

export default function ImageUploader({
  selectedFile,
  preview,
  loading,
  error,
  onFileChange,
  onPredict,
}: ImageUploaderProps) {
  const anotherImageInputRef =
    useRef<HTMLInputElement>(null);

  const handleUploadAnother = () => {
    anotherImageInputRef.current?.click();
  };

  return (
    <section className="upload-card">

      {/* HEADER */}

      <div className="upload-header">

        <span className="section-badge">
          AI CLASSIFICATION
        </span>

        <h2>Analyze Your Waste</h2>

        <p>
          Upload a waste image and our MobileNetV2
          model will classify it as dry, wet, or mixed.
        </p>

      </div>


      {/* IMAGE UPLOAD / PREVIEW */}

      {!preview ? (

        <label className="upload-area">

          <div className="upload-placeholder">

            <div className="upload-icon">
              <Upload size={32} />
            </div>

            <h3>Upload an image</h3>

            <p>
              Click here to select JPG, PNG or WebP
            </p>

          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            hidden
          />

        </label>

      ) : (

        <div className="image-preview-layout">

          {/* IMAGE */}

          <div className="preview-card">

            <img
              src={preview}
              alt="Selected waste"
              className="preview-image"
            />

          </div>


          {/* UPLOAD ANOTHER */}

          <button
            type="button"
            className="upload-another-button"
            onClick={handleUploadAnother}
          >

            <ImagePlus size={22} />

            <span>
              Upload
              <br />
              Another
              <br />
              Image
            </span>

          </button>


          {/* HIDDEN INPUT */}

          <input
            ref={anotherImageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            hidden
          />

        </div>

      )}


      {/* FILE NAME */}

      {selectedFile && (
        <div className="file-info">
          <span>{selectedFile.name}</span>
        </div>
      )}


      {/* PREDICT BUTTON */}

      <button
        className="predict-button"
        onClick={onPredict}
        disabled={!selectedFile || loading}
      >

        {loading ? (

          <>
            <LoaderCircle
              size={20}
              className="spin"
            />

            Analyzing Image...
          </>

        ) : (

          <>
            <BrainCircuit size={20} />

            Classify Waste
          </>

        )}

      </button>


      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

    </section>
  );
}