import React from 'react';

import './Table.css';
import { infinityChar } from './infinityChar';

const Table = (props) => {
  const { activeCell } = props;
  let { matrix } = props;
  matrix = Array.isArray(matrix[0]) ? matrix : [matrix];
  const { showRowsNumbers, showColsNumbers } = props;
  const activeRow = activeCell && activeCell.row;
  const activeCol = activeCell && activeCell.col;
  const rows = matrix.map((row, rowNum) => {
    const cols = row.map((col, colNum) => {
      const active = activeRow === rowNum && activeCol === colNum;
      const tdClass = active ? 'active-cell' : '';
      return (
        <td key={colNum} className={tdClass}>{col >= 0 ? col : infinityChar}</td>
      );
    });
    return (
      <tr key={rowNum}>
        {
          showRowsNumbers &&
          <td className="row-col-num">{rowNum + 1}</td>
        }
        {cols}
      </tr>
    );
  });
  const colCount = matrix[0].length;
  const colsNumbers = Array.from({ length: colCount }, (_, i) => i + 1);
  const header = colsNumbers.map(colNum => (
    <td key={colNum} className="row-col-num">{colNum}</td>
  ));
  return (
    <table>
      <tbody>
        {
          showColsNumbers &&
          <tr>
          {
            showRowsNumbers && <td></td>
          }
          {header}
          </tr>
        }
        {rows}
      </tbody>
    </table>
  );
};

export default Table;
