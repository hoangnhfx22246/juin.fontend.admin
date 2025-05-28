import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableImage = ({ file, index, removeFile, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative aspect-square border rounded-md overflow-hidden w-28"
    >
      {/* Chỉ truyền {...listeners} vào vùng kéo */}
      <div
        {...listeners}
        className="absolute inset-0 cursor-move z-10"
        style={{ background: "rgba(0,0,0,0)", minHeight: 24 }}
        title="Kéo để di chuyển"
      />
      <img
        src={file.url ? file.url : URL.createObjectURL(file)}
        alt={`preview ${index}`}
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={() => removeFile(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center hover:bg-red-600 z-20"
      >
        X
      </button>
    </div>
  );
};

const ImageUploader = ({ files, setFiles }) => {
  // Khi thêm file mới:
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .slice(0, 9 - files.length)
        .map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);
      setFiles((files) => arrayMove(files, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((_, i) => i.toString())}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 mb-4" style={{ flexWrap: "wrap" }}>
            {files.map((file, index) => (
              <SortableImage
                key={index}
                id={index.toString()}
                file={file}
                index={index}
                removeFile={removeFile}
              />
            ))}
            {files.length < 9 && (
              <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500">
                <span className="text-indigo-600 text-4xl">+</span>
                <span className="text-xs text-gray-500 mt-1">
                  Thêm ảnh ({files.length}/9)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ImageUploader;
