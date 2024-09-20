"use client";
import { realtimeDB } from "@/utils/firebaseConfig";
import { set, ref, get, update, remove } from "@firebase/database";
import { useEffect, useState } from "react";

export default function Home() {
  const [todoList, setTodoList] = useState({});
  const [todo, setTodo] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [msg, setMsg] = useState("Add");

  const getAllTodoList = async () => {
    const response = (await get(ref(realtimeDB, "todo"))).toJSON();
    console.log(response);
    setTodoList(response ?? {});
  };

  useEffect(() => {
    getAllTodoList();
  }, []);

  const addTodoList = async (e) => {
    try {
      if (msg === "Add") {
        const id =
          Object.keys(todoList).length !== 0
            ? Math.max(...Object.keys(todoList)) + 1
            : 1;
        await set(ref(realtimeDB, `todo/${id}`), {
          todo,
        });

        console.log("Added Successfully");
        setTodoList((prev) => ({
          ...prev,
          [id]: { todo },
        }));
      } else {
        console.log(selectedItem);
        await update(ref(realtimeDB, `todo/${selectedItem}`), {
          todo: todo,
        });
        setTodoList((prev) => ({
          ...prev,
          [selectedItem]: { todo },
        }));
        setSelectedItem(null);
        setMsg("Add");
      }
      setTodo("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteTodoList = async (value) => {
    try {
      await remove(ref(realtimeDB, `todo/${value}`));
      console.log(`${value} Deleted`);
      setTodoList((prev) => {
        const newTodoList = { ...prev };
        delete newTodoList[value];
        console.log(newTodoList);
        return newTodoList;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClicked = (value) => {
    console.log(value, todoList[value]?.todo);
    setSelectedItem(value);
    setTodo(todoList[value]?.todo);
    setMsg("Edit");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Todo List</h1>
        <div className="flex flex-row justify-center">
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
          />
          <button
            onClick={addTodoList}
            className="inline-flex items-center justify-center rounded-md border border-transparent"
          >
            {msg} Todo
          </button>
        </div>
        <div>
          {Object.keys(todoList).length !== 0 &&
            Object.keys(todoList).map((val, index) => (
              <div
                className="flex flex-row justify-center align-middle p-5 w-full m-3"
                key={index}
              >
                <p className="text-lg p-5">{todoList[val].todo}</p>
                <button
                  onClick={() => handleEditClicked(val)}
                  className="bg-red-500 hover:bg-red-700 p-5 space-x-4 text-white font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodoList(val)}
                  className="bg-red-500 hover:bg-red-700 p-3 text-white font-bold"
                  disabled={msg === "Edit"}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
