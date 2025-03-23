import Card from "../models/card.model.js";

export const getCards = async (req, res) => {
  const { columnId } = req.params;
  const cards = await Card.find({ columnId });
  res.json(cards);
};

export const createCard = async (req, res) => {
  const card = await Card.create({ ...req.body });
  res.status(201).json(card);
};

export const updateCard = async (req, res) => {
  const { id } = req.params;
  const updated = await Card.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;
  await Card.findByIdAndDelete(id);
  res.status(204).end();
};
