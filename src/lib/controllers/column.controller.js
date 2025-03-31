import Column from "../models/column.model.js";
import Card from "../models/card.model.js";
export const getColumns = async (req, res) => {
  const { boardId } = req.params;
  const columns = await Column.find({ boardId });
  res.json(columns);
};

export const createColumn = async (req, res) => {
  const { title, boardId } = req.body;
  const column = await Column.create({ title, boardId });
  res.status(201).json(column);
};

export const deleteColumn = async (req, res) => {
  const { id } = req.params;

  try {
    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    await Card.deleteMany({ columnId: id });

    await Column.findByIdAndDelete(id);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
export const updateColumn = async (req, res) => {
  const { id } = req.params;
  const { title, order } = req.body;

  try {
    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    if (title !== undefined) column.title = title;
    if (order !== undefined) column.order = order;

    await column.save();

    res.json(column);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
