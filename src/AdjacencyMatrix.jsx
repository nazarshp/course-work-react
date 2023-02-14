import React from 'react';
import Table from './Table';

const AdjacencyMatrix = (props) => {
  const { matrix, activeCell } = props;
  return (
    <Table matrix={matrix} activeCell={activeCell}
           showRowsNumbers showColsNumbers />
  );
};

export default AdjacencyMatrix;
