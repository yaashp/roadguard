import { useRef, useState } from "react";
import { ImagePlus, X, AlertCircle } from "lucide-react";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({ file, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function handleFile(f) {
    setError("");
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setPreview(URL.createObjectURL(f));
    onChange(f);
  }

  function clear() {
    setPreview(null);
    setError("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-asphalt-900/10 dark:border-white/10">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-asphalt-950/70 text-white flex items-center justify-center"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          className={`rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 h-48 transition-colors ${
            dragOver ? "border-signal bg-signal/5" : "border-asphalt-900/15 dark:border-white/15 hover:border-signal/50"
          }`}
        >
          <ImagePlus size={26} className="text-asphalt-900/35 dark:text-mist-100/35" />
          <p className="text-sm font-medium">Click or drag a photo here</p>
          <p className="text-xs text-asphalt-900/40 dark:text-mist-100/40">JPG, PNG or WEBP — up to 5MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-hazard">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}
