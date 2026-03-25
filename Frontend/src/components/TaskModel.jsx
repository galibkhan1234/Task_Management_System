import { useState, useEffect } from "react"
import axios from "axios"
import { X, Plus, CheckCircle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSocket } from "../context/SocketContext"
import { Users, PlusCircle, LayoutList } from "lucide-react"
import TodoItem from "./TodoItem"

const API_URL = "http://localhost:8000/api/task"

const TaskModal = ({ task, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    status: "pending",
    todos: []
  })
  const [newTodo, setNewTodo] = useState("")
  const [loading, setLoading] = useState(false)

  const { socket } = useSocket()
  const [viewers, setViewers] = useState([])

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        status: task.status || "pending",
        todos: task.todos || []
      })
    }
  }, [task])

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    setFormData(prev => ({
      ...prev,
      todos: [...prev.todos, { _id: Date.now().toString(), title: newTodo.trim(), isCompleted: false }]
    }));
    setNewTodo("");
  };

  const handleToggleTodo = (id) => {
    setFormData(prev => ({
      ...prev,
      todos: prev.todos.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t)
    }));
  };

  const handleDeleteTodo = (id) => {
    setFormData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t._id !== id)
    }));
  };

  const handleEditTodo = (id, newTitle) => {
    setFormData(prev => ({
      ...prev,
      todos: prev.todos.map(t => t._id === id ? { ...t, title: newTitle } : t)
    }));
  };

  const handleConvertToTask = async (todo) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/gp`, {
        title: todo.title,
        status: "todo",
        priority: "Medium"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleDeleteTodo(todo._id);
      toast.success("Sub-task converted to a full task!");
    } catch (err) {
      toast.error("Failed to convert sub-task");
    }
  };

  useEffect(() => {
    if (formData.todos.length > 0 && formData.todos.every(t => t.isCompleted) && formData.status !== "completed") {
      // Small delay to let the animation play
      const timer = setTimeout(() => {
        if (window.confirm("All sub-tasks are completed! Mark parent task as completed?")) {
          setFormData(prev => ({ ...prev, status: "completed" }));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.todos]);

  const progress = formData.todos.length > 0
    ? Math.round((formData.todos.filter(t => t.isCompleted).length / formData.todos.length) * 100)
    : 0;

  useEffect(() => {
    if (!socket || !task?._id) return

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    
    socket.emit("task:viewing", { taskId: task._id, user: currentUser })

    const handlePresence = ({ taskId, viewers }) => {
      if (taskId === task._id) {
        setViewers(viewers)
      }
    }

    socket.on("presence:update", handlePresence)

    return () => {
      socket.emit("task:stopped-viewing", { taskId: task._id, userId: currentUser?.id })
      socket.off("presence:update", handlePresence)
    }
  }, [socket, task])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return toast.error("Task title is required")
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      
      // Prepare data to match backend expectations
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status
      }

      // Only add dueDate if it exists
      if (formData.dueDate) {
        taskData.dueDate = formData.dueDate
      }

      console.log("Sending task data:", taskData) // Debug log
      console.log("Token:", token ? "exists" : "missing") // Debug log
      
      if (task?._id) {
        // Update existing task
        const { data } = await axios.put(
          `${API_URL}/${task._id}`,
          taskData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        )
        console.log("Update response:", data) // Debug log
        toast.success("Task updated successfully! 🎉")
      } else {
        // Create new task
        const { data } = await axios.post(
          `${API_URL}/gp`,
          taskData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        )
        console.log("Create response:", data) // Debug log
        toast.success("Task created successfully! 🎉")
      }

      setTimeout(() => {
        onSaved()
      }, 500)
    } catch (error) {
      console.error("Task save error FULL:", error) // Debug log
      console.error("Error response data:", error.response?.data) // Debug log
      console.error("Error response status:", error.response?.status) // Debug log
      console.error("Error message:", error.message) // Debug log
      
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.message || 
                       "Failed to save task"
      
      toast.error(`Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-100">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-600" />
                {task ? "Edit Task" : "Create New Task"}
              </h3>
              {viewers.length > 1 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex -space-x-2 overflow-hidden">
                    {viewers.map((viewer, idx) => (
                      <img
                        key={idx}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src={viewer.avatar}
                        alt={viewer.name}
                        title={viewer.name}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Users size={12} /> {viewers.length} viewing
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about your task"
                rows="4"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📌 Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📊 Status
              </label>
              <div className="flex gap-3">
                {["completed", "pending", "in-progress"].map(status => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checklist Section */}
            <div className="space-y-4 pt-4 border-t border-purple-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <LayoutList size={18} className="text-purple-600" />
                  Checklist ({formData.todos.filter(t => t.isCompleted).length}/{formData.todos.length})
                </label>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                  {progress}% Done
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-fuchsia-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Add Todo Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTodo())}
                  placeholder="Add a sub-task..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTodo}
                  className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                >
                  <PlusCircle size={20} />
                </button>
              </div>

              {/* Todo List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {formData.todos.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-4">No sub-tasks yet. Break your task down!</p>
                ) : (
                  formData.todos.map(todo => (
                    <TodoItem
                      key={todo._id}
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={handleEditTodo}
                      onConvertToTask={handleConvertToTask}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 to-fuchsia-600 text-white py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle size={20} />
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default TaskModal