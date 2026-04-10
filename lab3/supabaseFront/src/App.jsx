import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";
function App() {
  const [todoList, setTodoList] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    edad: "",
    esAdmin: false,
  });

  async function consulta() {
    const { data, error } = await supabase.from("usuarios").select("*");
    console.log(data);
    if (error) {
      console.log("Error de conexion en consulta: ", error);
    } else {
      setTodoList(data);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    consulta();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addTodo = async () => {
    if (!formData.nombre.trim()) return;

    const newTodoData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim(),
      edad: Number(formData.edad) || 0,
      esAdmin: formData.esAdmin,
    };
    console.log([newTodoData]);
    const { data, error } = await supabase
      .from("usuarios")
      .insert([newTodoData])
      .select(); // Esto hace que retorne los datos insertados
    if (error) {
      console.log("Error en el insert: ", error);
    } else {
      // data será un array, toma el primer elemento
      if (data?.[0]) {
        setTodoList((prev) => [...prev, data[0]]);
      }
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        edad: "",
        esAdmin: false,
      });
    }
  };

  const completeTask = async (id, esAdmin) => {
    const { error } = await supabase
      .from("usuarios")
      .update({ esAdmin: !esAdmin })
      .eq("id", id);
    if (error) {
      console.log("error en el update task: ", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, esAdmin: !esAdmin } : todo,
      );
      setTodoList(updatedTodoList);
    }
  };
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id);
    if (error) {
      console.log("error deleting task: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      {" "}
      <h1>Usuarios</h1>
      <div>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
        />
        <label>
          <input
            type="checkbox"
            name="esAdmin"
            checked={formData.esAdmin}
            onChange={handleChange}
          />
          Es Admin
        </label>
        <button onClick={addTodo}>Añadir Usuario</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li key={todo.id}>
            <p>
              {todo.nombre} {todo.apellido}
            </p>
            <p>{todo.email}</p>
            <p>Edad: {todo.edad}</p>
            <button onClick={() => completeTask(todo.id, todo.esAdmin)}>
              {" "}
              {todo.esAdmin ? "Es Admin" : "No es Admin"}
            </button>
            <button onClick={() => deleteTask(todo.id)}> Borrar Usuario</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
