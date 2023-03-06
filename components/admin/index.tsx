'use client'

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "../button";
import AddGameForm from "./add-game-form";

import style from './style.module.css';

const Admin = () => {
    const [adminData, setAdminData] = useState({});
    const router = useRouter();

    const getAdminDataRef = useRef(false);
    useEffect(() => {
        if (getAdminDataRef.current) return;
        const getAdminData = async () => {
            const res = await fetch('/admin/data/api');
            const data = await res.json();
            if (data.unauthorized) router.push('/');
            setAdminData(data);
        }
        getAdminData();
    }, [])
    console.log(adminData);
    
    const [isAddEvent, setIsAddEvent] = useState(false);
    return (
        <>
            <div className={style.adminContainer}>
                <h2>Admin</h2>
                <Button onClick={() => setIsAddEvent(true)} text="Add Game" />
            </div>
            {isAddEvent && (
                <AddGameForm onClose={() => { setIsAddEvent(false) }} />
            )}
        </>
    )
}

export default Admin;