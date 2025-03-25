import Board from "../models/board.model.js";

export const getBoards = async (req, res) => {
  const boards = await Board.find({ owner: req.user.id });
  res.json(boards);
};
export const createBoard = async (req, res) => {
  const { title, background, icon } = req.body;
  const board = await Board.create({
    title,
    background,
    icon,
    owner: req.user.id,
  });
  res.status(201).json(board);
};

export const deleteBoard = async (req, res) => {
  const { id } = req.params;
  await Board.deleteOne({ _id: id, owner: req.user.id });
  res.status(204).end();
};

export const updateBoard = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!board) {
    return res.status(404).json({ message: "Board not found or unauthorized" });
  }
  res.json(board);
};
