import React from 'react';
import { useState } from 'react';

// import TreeTest from './core/tree/TreeTest'

import RedBlackTree from './views/pages/RedBlackTree';
import DijkstraVisualize from './DijkstraVisualize';

const App = () => {
  // var test = new TreeTest()
  // test.run();

  const [index, setIndex] = useState(0);
  const onBackClick = () => {
    setIndex(0);
  };
  const onRedClick = () => {
    setIndex(1);
  };
  const onDijkstraClick = () => {
    setIndex(2);
  };

  if (index === 0)
    return (
      <div>
        <button onClick={onRedClick}>Redblack tree</button>
        <button onClick={onDijkstraClick}>Dijkstra algo</button>
      </div>
    );
  if (index === 1)
    return (
      <div>
        <button onClick={onBackClick}>Back</button>
        <div>
          <RedBlackTree />
        </div>
      </div>
    );
  return (
    <div>
      <button onClick={onBackClick}>Back</button>
      <DijkstraVisualize />
    </div>
  );
};

export default App;
