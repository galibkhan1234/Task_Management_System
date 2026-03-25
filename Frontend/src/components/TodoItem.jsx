import { Check, Trash2, Edit2, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const TodoItem = ({ todo, onToggle, onDelete, onEdit, onConvertToTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEdit(todo._id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group transition-all hover:bg-purple-50">
      <button
        onClick={() => onToggle(todo._id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.isCompleted
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-purple-400"
        }`}
      >
        {todo.isCompleted && <Check size={14} />}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 px-2 py-1 border-b-2 border-purple-400 bg-transparent focus:outline-none"
            autoFocus
          />
          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
            <Check size={18} />
          </button>
          <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      ) : (
        <span className={`flex-1 text-sm ${todo.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}>
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onConvertToTask(todo)}
            className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg"
            title="Convert to full task"
          >
            <ArrowUpRight size={14} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
