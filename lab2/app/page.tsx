"use client"
import { useEffect, useState } from 'react'
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firebase.config';

const initialUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    edad: 0,
    esAdmin: false,
}

export default function Home() {

    const [usuarioForm, setUsuarioForm] = useState(initialUsuario);
    const [usuarios, setUsuarios] = useState<any>([]);

    async function fetchUsuarios() {
        const snapshot = await getDocs(collection(db, 'usuarios'))
        setUsuarios(
            snapshot.docs.map((doc) => ({
                    id: doc.id,
                    nombre: doc.data().nombre,
                    apellido: doc.data().apellido,
                    email: doc.data().email,
                    edad: doc.data().edad,
                    esAdmin: doc.data().esAdmin,
            }))
        )
    }

    useEffect(() => {
        void fetchUsuarios()
    }, [])

    const handleAdd = async () => {
        await addDoc(collection(db, 'usuarios'), usuarioForm)
        setUsuarioForm(initialUsuario);
        fetchUsuarios();
    }

    const handleDelete = async (id: string) => {
        if (!id) return;
        await deleteDoc(doc(db, 'usuarios', id));
        fetchUsuarios();
    }

    const handleEdit = async (id: string) => {
        const nombre = prompt("Nuevo nombre");

        const apellido = prompt("Nuevo apellido1");

        const email = prompt("Nuevo email");

        const edad = prompt("Nueva edad");

        const esAdminInput = prompt("Es admin? (si/no)");
        const esAdmin = esAdminInput === 'si';

        await updateDoc(doc(db, 'usuarios', id), { nombre, apellido, email, edad, esAdmin })
        fetchUsuarios();
    }

    return (
        <div className="font-sans min-h-screen p-8 pb-20 sm:p-20" >
            <h1>NextJS Firebase</h1>
            <input
                type="text"
                className="border-2 p-1 mr-2"
                placeholder="Nombre"
                value={usuarioForm.nombre}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
            />
            <input
                type="text"
                className="border-2 p-1 mr-2"
                placeholder="Apellido"
                value={usuarioForm.apellido}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, apellido: e.target.value })}
            />
            <input
                type="email"
                className="border-2 p-1 mr-2"
                placeholder="Email"
                value={usuarioForm.email}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
            />
            <input
                type="number"
                className="border-2 p-1 mr-2"
                placeholder="Edad"
                value={usuarioForm.edad}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, edad: Number(e.target.value) })}
            />
            <label className="mr-2">
                <input
                    type="checkbox"
                    checked={usuarioForm.esAdmin}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, esAdmin: e.target.checked })}
                />
                Es admin
            </label>
            <button className="border p-2" onClick={(handleAdd)}>Agregar</button>
            <ul>
                {usuarios.map((user: any) => <li key={user.id}>
                    {user.nombre}, {user.apellido},  {user.email},  {user.edad} años,  {user.esAdmin ? 'Es Admin' : 'No es admin'}
                    <button className="p-2 border bg-yellow-500 text-white cursor-pointer"
                        onClick={() => { handleEdit(user.id) }}>Edit</button>
                    <button className="p-2 border bg-red-500 text-white cursor-pointer"
                        onClick={() => { handleDelete(user.id ?? '') }}>Delete</button>
                </li>)}
            </ul>
        </div>
    );
}