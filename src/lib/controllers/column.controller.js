import Column from "../models/column.model.js";

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
  await Column.findByIdAndDelete(id);
  res.status(204).end();
};
