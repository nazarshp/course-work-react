import React from 'react';
import Table from './Table';

const DistanceMatrix = (props) => {
  const { matrix, activeCell } = props;
  return (
    <Table matrix={matrix}
           activeCell={activeCell}
           showColsNumbers />
  );
};

export default DistanceMatrix;
