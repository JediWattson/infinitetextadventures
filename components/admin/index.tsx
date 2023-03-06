'use client'

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Admin = () => {
    const [adminData, setAdminData] = useState({});
    const router = useRouter();

    const getAdminDataRef = useRef(false);
    useEffect(() => {
        if (getAdminDataRef.current) return;
        const getAdminData = async () => {
            const res = await fetch('/admin/api');
            const data = await res.json();
            if (data.unauthorized) router.push('/');
            setAdminData(data);
        }
        getAdminData();
    }, [])

    return (
        <div>
            Admin PAge
        </div>
    )
}

export default Admin;