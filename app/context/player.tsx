"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from "react";

type PlayerType = { role: "admin" | "player"; _id: string } | null;
type PlayerContextType = {
  player?: PlayerType;
  setPlayer?: Dispatch<SetStateAction<PlayerType>>;
  clearPlayer?: () => void;
};

const getPlayerData = async () => {
  try {
    const res = await fetch("/player/api");
    const player = await res.json();
    if (Object.keys(player).length === 0) return;

    if (!player.createNew) return player;
    const newRes = await fetch("player/api", { method: "PUT" });
    return newRes.json();
  } catch (error) {
    console.error(error);
  }
};

const PlayerContext = createContext<PlayerContextType>({});
export default function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerType>(null);

  const clearPlayer = () => {
    setPlayer(null);
  };

  const playerGetRef = useRef(false);
  useEffect(() => {
    if (playerGetRef.current) return;
    playerGetRef.current = true;
    const getPlayer = async () => {
      try {
        const player = await getPlayerData();
        setPlayer(player);
      } catch (error) {
        console.error(error);
      }
    };
    getPlayer();
  }, []);

  return (
    <PlayerContext.Provider value={{ player, setPlayer, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
