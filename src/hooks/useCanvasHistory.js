import { useState } from 'react';

const useCanvasHistory = (shapes, setShapes) => {
  const [history, setHistory] = useState([[]]);
  const [index, setIndex] = useState(0);

  const addHistory = (newShapes) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (index > 0) {
      setIndex(index - 1);
      setShapes(history[index - 1]);
    }
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      setShapes(history[index + 1]);
    }
  };

  return { addHistory, undo, redo };
};

export default useCanvasHistory;