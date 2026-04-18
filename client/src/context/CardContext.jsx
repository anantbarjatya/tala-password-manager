import { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);

  const fetchCards = async () => {
    try {
      const { data } = await api.get("/api/cards");
      setCards(data);
    } catch {
      setCards([]);
    }
  };

  const addCard = async (cardData) => {
    const { data } = await api.post("/api/cards", cardData);
    setCards((prev) => [data, ...prev]);
    return data;
  };

  const deleteCard = async (id) => {
    await api.delete(`/api/cards/${id}`);
    setCards((prev) => prev.filter((c) => c._id !== id));
  };

  const revealCard = async (id) => {
    const { data } = await api.get(`/api/cards/${id}/reveal`);
    return data;
  };

  return (
    <CardContext.Provider value={{ cards, fetchCards, addCard, deleteCard, revealCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => useContext(CardContext);