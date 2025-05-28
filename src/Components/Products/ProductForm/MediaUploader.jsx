import React, { useState, useEffect, useRef } from "react";

const MediaUploader = ({ value, onFilesChange }) => {
  const [preview, setPreview] = useState(null);
  const urlRef = useRef(null);

  // Khi value (từ cha) thay đổi (ví dụ khi edit), cập nhật preview
  useEffect(() => {
    // Clear URL cũ nếu có
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    if (!value) {
      setPreview(null);
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      urlRef.current = url;
      setPreview({ url, type: value.type });
    } else if (value.url) {
      setPreview({ url: value.url, type: value.type || "video/mp4" });
    }
  }, [value]);

  // Khi chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFilesChange(file);
    } else {
      onFilesChange(null);
    }
  };

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Video sản phẩm
      </label>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-60 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Hiển thị preview */}
      <div className="mt-4">
        {preview && (
          <video
            key={preview.url} // Thêm key này!
            controls
            className="w-60 h-auto rounded border"
          >
            <source src={preview.url} type={preview.type} />
            Trình duyệt không hỗ trợ video.
          </video>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
