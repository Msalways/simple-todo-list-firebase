"use client";
import { db } from "@/utils/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { useEffect, useState } from "react";

export default function FireStore() {
  const [todoList, setTodoList] = useState([]);
  const [todo, setTodo] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [msg, setMsg] = useState("Add");

  const getAllTodoList = async () => {
    const response = await getDocs(collection(db, "items"));
    const constructedTodo = response.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTodoList(constructedTodo);
  };

  useEffect(() => {
    getAllTodoList();
  }, []);

  const addTodoList = async (e) => {
    try {
      if (msg === "Add") {
        const response = await addDoc(collection(db, "items"), {
          todo,
        });

        console.log(response.id);
        setTodoList((prev) => [...prev, { id: response.id, todo }]);
      } else {
        const docRef = doc(db, "items", selectedItem.id);
        await updateDoc(docRef, {
          todo,
        });
        setTodoList((prev) => {
          return prev.map((item) => {
            if (item.id === selectedItem.id) {
              return { ...item, todo };
            }
            return item;
          });
        });
        setSelectedItem({});
        setMsg("Add");
      }
      setTodo("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodoList = async (value) => {
    try {
      // setTodoList((prev) => prev.filter((val, index) => value != val));
      const itemRef = doc(db, "items", value);
      await deleteDoc(itemRef);
      setTodoList((prev) => prev.filter((val) => val.id !== value));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClicked = async (value) => {
    console.log(value);
    setSelectedItem(value);
    setTodo(value.todo);
    setMsg("Edit");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Todo List</h1>
        <div className=" flex flex-row justify-center">
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
          ></input>
          <button
            onClick={addTodoList}
            className="inline-flex items-center justify-center rounded-md border border-transparent"
          >
            {" "}
            {msg} Todo
          </button>
        </div>
        <div>
          {todoList.map((val, index) => (
            <div
              className=" flex flex-row justify-center align-middle p-5 w-full m-3 "
              key={val.id}
            >
              <p className="text-lg p-5">{val.todo}</p>
              <button
                onClick={(e) => handleEditClicked(val)}
                className="bg-red-500 hover:bg-red-700 p-5 space-x-4 text-white font-bold"
              >
                edit
              </button>
              <button
                onClick={(e) => deleteTodoList(val.id)}
                className="bg-red-500 hover:bg-red-700 p-3 text-white font-bold"
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
