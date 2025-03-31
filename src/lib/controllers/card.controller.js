import Card from "../models/card.model.js";

export const getCards = async (req, res) => {
  const { columnId } = req.params;
  const { priority } = req.query;

  const query = { columnId };

  if (priority === "none") {
    query.priority = { $exists: false };
  } else if (["low", "medium", "high"].includes(priority)) {
    query.priority = priority;
  }

  try {
    const cards = await Card.find(query);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
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
