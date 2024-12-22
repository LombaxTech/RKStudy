import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { deleteDoc, doc, query, where } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { Todo } from "@/lib/types";
import { getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { formatDateForDisplay } from "@/helperFunctions";

type CompletionStatus = "completed" | "incomplete";

export default function TodoHome() {
  const { user } = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState<
    CompletionStatus | ""
  >("");
  //   FETCH TODOS
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);

        let q = query(
          collection(db, "todos"),
          where("createdBy", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);

        let todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...(doc.data() as Todo),
          });
        });

        // SORT TODOS BY DUE DATE
        todos.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime();
        });

        setTodos(todos);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTodos();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  if (todos.length === 0) return <NoTodos />;

  return (
    <div className="p-4 flex-1 flex flex-col gap-4 md:px-16 md:pt-10">
      {/* <button className="btn btn-primary" onClick={() => console.log(todos)}>
        log todos
      </button> */}
      <h1 className="text-2xl font-bold">My Todo List</h1>

      {/* FILTER */}
      <div className="flex flex-col items-start justify-start gap-2 md:gap-4 md:flex-row md:items-center md:justify-between">
        {/* SEARCH */}
        <div className="flex-1 w-full items-center gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search your todos"
            className="w-full outline-none p-2 rounded-md border-2 border-gray-300"
          />
        </div>
        {/* FILTER BY COMPLETION STATUS */}
        <div className="flex items-center self-end md:self-center gap-2">
          <span className="text-sm font-medium">
            Filter Todos By Completion:
          </span>

          <select
            className="outline-none p-2 rounded-md border-2 border-gray-300"
            value={selectedCompletionStatus}
            onChange={(e) =>
              setSelectedCompletionStatus(e.target.value as CompletionStatus)
            }
          >
            <option value="">All</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* TODOS */}
      <div className="flex flex-col gap-8">
        {todos.map((todo) => (
          <ToDoCard key={todo.id} todo={todo} setTodos={setTodos} />
        ))}
      </div>
    </div>
  );
}

const ToDoCard = ({ todo, setTodos }: { todo: Todo; setTodos: any }) => {
  const deleteTodo = async () => {
    await deleteDoc(doc(db, "todos", todo.id as string));
    setTodos((prevTodos: Todo[]) => prevTodos.filter((t) => t.id !== todo.id));
  };

  return (
    <div className="flex flex-col gap-2">
      {todo.dueDate && (
        <p className="text-sm text-gray-500">
          {formatDateForDisplay(todo.dueDate.toDate())}
        </p>
      )}
      <div className="p-4 bg-white rounded-md shadow-md flex justify-between items-center">
        <h2 className="text-lg font-medium">{todo.title}</h2>
        {/* DROPDOWN ACTIONS */}
        <div className="dropdown dropdown-left">
          <div tabIndex={0} role="button" className="btn m-1">
            <BiDotsVertical className="w-4 h-4" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <span className="" onClick={deleteTodo}>
                Delete
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const NoTodos = () => {
  return (
    <div className="flex-1 flex flex-col items-center pt-10">
      <h1 className="text-2xl font-bold">No todos yet</h1>
      <img src="/lightbulb.svg" alt="No todos" className="w-[200px]" />
      {/* TODO: ADD BUTTON TO ADD TODO */}
      <p className="text-sm text-gray-500">
        Add todos to your list by clicking the + button on the syllabus page.
      </p>
    </div>
  );
};
