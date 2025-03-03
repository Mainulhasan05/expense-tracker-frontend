import TaskList from "@/components/tasks/task-list";
import AddTaskButton from "@/components/tasks/add-task-button";

export default function TasksPage() {
  return (
    <div className="space-y-6 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <AddTaskButton />
      </div>

      <TaskList />
    </div>
  );
}
