'use client';

import { Ref } from 'react';
import style from './style.module.css';

export default function Input({ inputRef, label, type }: { inputRef: Ref<HTMLInputElement>, label: string, type?: string }) {
    
    return (
        <div className={style.container}>
            <input ref={inputRef} type={type || "text"} className={style.input} />
            <label className={style.label} >{label}</label>
        </div>
    )
}