
import { useRef } from "react";

import Button from "../button";
import Input from "../input";
import Modal from "../modal";

import style from './style.module.css';


type ModalInputRefType = HTMLInputElement & HTMLTextAreaElement;
const AddGameForm = ({ onClose }: { onClose: () => void }) => {
    const keyRef = useRef<ModalInputRefType>(null);
    const titleRef = useRef<ModalInputRefType>(null);
    const descRef = useRef<ModalInputRefType>(null);
    const narratorRef = useRef<ModalInputRefType>(null);
    const speakerRef = useRef<ModalInputRefType>(null);
    const backstoryRef = useRef<ModalInputRefType>(null);

    const handleSubmit = async () => {
        const gameKey = keyRef.current?.value;
        const title = titleRef.current?.value;
        const description = descRef.current?.value;
        const narrator = narratorRef.current?.value;
        const speaker = speakerRef.current?.value;
        const backstory = backstoryRef.current?.value;
        // if (!gameKey || !title || !description || !narrator || !speaker || !backstory) return;
        
        await fetch('/admin/add-game/api', { 
            method: "PUT", 
            body: JSON.stringify({
                gameKey,
                title,
                description,
                narrator,
                speaker,
                backstory
            }) 
        });
        onClose()
    }

    return (
        <Modal>
            <>
                <div className={style.modalContainer}>
                    <h2>Create a new game!</h2>
                    <Input label="Game Key" inputRef={keyRef} />
                    <Input label="Title" inputRef={titleRef} />
                    <Input label="Description" inputRef={descRef} textArea />
                    <Input label="Narrator" inputRef={narratorRef} />
                    <Input label="Speaker" inputRef={speakerRef} />
                    <Input label="Backstory" inputRef={backstoryRef} textArea />
                </div>
                <div className={style.modalButtons}>
                    <Button text="Submit" onClick={handleSubmit}/>     
                    <Button text="Close" onClick={onClose} />           
                </div>
            </>
        </Modal>
    )
}

export default AddGameForm;
