'use client';

import { useSession } from "next-auth/react";
import { useRef } from "react";
import Button from "../button";
import Input from "../input";

import style from './style.module.css';

export default function NewUserComponent () {
    const { data: session } = useSession();  
    const inputRef = useRef<HTMLInputElement>(null);  
    const handleClick = () => {
        if (!inputRef.current) return;
        const { value } = inputRef.current;
        inputRef.current.value = "";
        
    };
    return (
        <div className={style.container}>
            <div className={style.actions}>
                <Input inputRef={inputRef} label="Username" />
                <Button small text="Submit" onClick={handleClick} />
            </div>
            <h2>Add the name for which you would like to be known as around here!</h2>
        </div>
    )
}