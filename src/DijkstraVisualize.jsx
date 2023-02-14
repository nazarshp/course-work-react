import React from 'react'
import { useState, useEffect, useRef } from 'react';

import { Point, Vec, sum, length,
         scaled, scaledTo, rotated } from './mathUtils';
import AdjacencyMatrix from './AdjacencyMatrix';
import DistanceMatrix from './DistanceMatrix';
import { infinityChar } from './infinityChar';
import './DijkstraVisualize.css';

const WIDTH = 500;
const HEIGHT = 500;
const BLACK = '#000000';
const BLUE = '#0000FF';
const GREEN = '#00FF00';

const drawLine = (context, a, b, color = BLACK) => {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.stroke();
};

const R = 20;

const drawCircle = (context, point, radius, color = BLACK) => {
  const { x, y } = point;
  context.strokeStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();
};

const drawVertice = (context, center, id = 1, color = BLACK) => {
  context.lineWidth = 1;
  context.strokeStyle = color;
  drawCircle(context, center, R);
  context.font = "20px serif";
  context.fillText(id, center.x - 5, center.y + 5);
}

const drawEdge = (context, start, finish, weight = 0, color = BLACK) => {
  context.lineWidth = 1;
  context.strokeStyle = color;
  const vec = Vec(start, finish);
  start = sum(start, scaledTo(vec, R));
  finish = sum(finish, scaledTo(vec, -R));
  const norm = scaledTo(Point(-vec.y, vec.x), +10);
  const mid = {
    x: (start.x + finish.x) / 2,
    y: (start.y + finish.y) / 2,
  };
  context.font = "15px serif";
  context.fillText(weight, mid.x + norm.x, mid.y + norm.y);
  context.lineWidth = 1;
  drawLine(context, start, finish);
}

const drawEdgeMarker = (context, start, finish, color = BLUE) => {
  let vec = Vec(start, finish);
  start = sum(start, scaledTo(vec, R));
  finish = sum(finish, scaledTo(vec, -R));
  const l = length(Vec(start, finish));
  // making smaller
  start = sum(start, scaledTo(vec, +l * 0.05));
  finish = sum(finish, scaledTo(vec, -l * 0.05));
  context.lineWidth = 3;
  drawLine(context, start, finish, color);
  const arrowLen = 15;
  // arrow 1 (on finish)
  let arrowVec = scaledTo(rotated(vec, Math.PI / 15), -arrowLen);
  drawLine(context, sum(finish, arrowVec), finish, color);
  arrowVec = scaledTo(rotated(vec, -Math.PI / 15), -arrowLen);
  drawLine(context, sum(finish, arrowVec), finish, color);
  vec = scaled(vec, -1);
  // arrow 2 (on start)
  arrowVec = scaledTo(rotated(vec, Math.PI / 15), -arrowLen);
  drawLine(context, sum(start, arrowVec), start, color);
  arrowVec = scaledTo(rotated(vec, -Math.PI / 15), -arrowLen);
  drawLine(context, sum(start, arrowVec), start, color);
}

const drawVerticeMarker = (context, center, color = BLUE) => {
  context.lineWidth = 3;
  drawCircle(context, center, R + 1, color);
}

const clearAndDrawGraph = (context, verticesCoords, matrix) => {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  for (let i = 0; i < verticesCoords.length; i++) {
    drawVertice(context, verticesCoords[i], i + 1);
  }
  for (let i = 0; i < matrix.length; i++)
    for (let j = 0; j < i; j++)
      if (matrix[i][j] > 0) {
        drawEdge(context, verticesCoords[i], verticesCoords[j], matrix[i][j]);
        // drawEdgeMarker(context, verticesCoords[i], verticesCoords[j]);
      }
  // drawVerticeMarker(context, vertices[0]);
};

const vertices = [
  Point(30, 30),
  Point(40, 190),
  Point(350, 140),
  Point(259, 198),
  Point(267, 379),
  Point(330, 450)
];

const matrix = [
  [ 0, 21, 15, 30, 29, -1],
  [21,  0, -1, -1, 35, -1],
  [15, -1,  0, 10, -1, 50],
  [30, -1, 10,  0, -1, 20],
  [29, 35, -1, -1,  0, -1],
  [-1, -1, 50, 20, -1,  0]
];

const defaultDistances = Array(matrix.length).fill(-1);

const draw = (context) => {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  clearAndDrawGraph(context, vertices, matrix);
  clearAndDrawGraph(context, vertices, matrix);
  clearAndDrawGraph(context, vertices, matrix);
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const arraySet = (a, i, e) => a.map((elem, ind) => i === ind ? e : elem);
const arrayAdd = (a, e) => [...a, e];

const dijkstraVisualize = async (context, start, setDistances, setActiveCell1, setActiveCell2, setMessages) => {
  const DELAY = 2500;
  const n = matrix.length;
  // clearAndDrawGraph(context, vertices, matrix);
  let distances = defaultDistances.map((_, i) => i === start ? 0 : -1);
  setDistances(distances);
  await sleep(DELAY);
  let visited = matrix.map(() => false);
  for (let i = 0; i < n; i++) {
    clearAndDrawGraph(context, vertices, matrix);
    let v = -1;
    for (let j = 0; j < n; j++) {
      if (distances[j] < 0 || visited[j])
        continue;
      if (v < 0 || distances[j] < distances[v])
        v = j;
    }
    visited[v] = true;
    setActiveCell2({ row: 0, col: v });
    for (let j = 0; j < n; j++) {
      let messages = [`The nearest(not visited) vertice is ${v+1}`];
      setMessages(messages);
      await sleep(j === 0 ? DELAY : DELAY * 2);
      clearAndDrawGraph(context, vertices, matrix);
      drawVerticeMarker(context, vertices[v]);
      if (j == v) {
        continue;
      }
      messages = arrayAdd(messages, `Try to reduce distance to ${j+1} using ${v+1}`);
      setActiveCell1({ row: v, col: j });
      if (matrix[v][j] <= 0) {
        messages = arrayAdd(messages, `There is no edge from ${v+1} to ${j+1}`);
        setMessages(messages);
        continue;
      }
      drawEdgeMarker(context, vertices[start], vertices[v]);
      drawEdgeMarker(context, vertices[v], vertices[j]);
      const currentDist = distances[j] < 0 ? infinityChar : distances[j];
      messages = arrayAdd(messages, `Current distance is: ${currentDist}`);
      messages = arrayAdd(messages, `New distance is: (current minimal) distance to ${v+1} + distance ${v+1}-${j+1}`);
      setMessages(messages);
      await sleep(DELAY * 0.5);
      const newDistance = distances[v] + matrix[v][j];
      if (distances[j] < 0 || newDistance < distances[j]) {
        distances = arraySet(distances, j, newDistance);
        setDistances(distances);
        messages = arrayAdd(messages, `New distance ${newDistance} is better than ${currentDist}`);
        setMessages(messages);
        await sleep(DELAY * 0.5);
      }
      else {
        messages = arrayAdd(messages, `New distance ${newDistance} is not better than ${currentDist}`);
        setMessages(messages);
        await sleep(DELAY * 0.5);
      }
      setActiveCell1({ row: -1, col: -1 });
      setActiveCell2({ row: -1, col: -1 });
    }
    setMessages(['Algorithm completed']);
    setActiveCell1({ row: -1, col: -1 });
    setActiveCell2({ row: -1, col: -1 });
    clearAndDrawGraph(context, vertices, matrix);
  }
};

const DijkstraVisualize = () => {
  const canvasRef = useRef(null);
  const [startVertice, setStartVertice] = useState(-1);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [distances, setDistances] = useState(defaultDistances);
  const [messages, setMessages] = useState([]);
  const [activeCell1, setActiveCell1] = useState({ row: -1, cell: -1 });
  const [activeCell2, setActiveCell2] = useState({ row: -1, cell: -1 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!animationStarted || startVertice < 0) {
      clearAndDrawGraph(context, vertices, matrix);
      return;
    }
    dijkstraVisualize(context, startVertice, setDistances, setActiveCell1, setActiveCell2, setMessages)
      .then(() => setAnimationStarted(false));
  }, [startVertice, animationStarted]);
  const [inputText, setInputText] = useState('');
  const onInputChange = (e) => setInputText(e.target.value);
  const onButtonClick = () => {
    const num = Number(inputText)
    if (isNaN(num))
      return;
    const v = num - 1;
    if (!(0 <= v && v < matrix.length))
      return;
    setStartVertice(v);
    setAnimationStarted(true);
  };
  return (
    <div className="columns">
      <div className="column">
        <canvas ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                className="dijkstra-canvas" />
        <div className="input">
          <input type="text" onChange={onInputChange} />
          <button disabled={animationStarted}
                  onClick={onButtonClick}>Start algorithm</button>
        </div>
      </div>
      <div className="column">
        <AdjacencyMatrix matrix={matrix} activeCell={activeCell1} />
        <DistanceMatrix matrix={distances} activeCell={activeCell2} />
      </div>
      <div className="column">
        <div>
        {
          messages.map(message => (
            <p className="message-text">{message}</p>
          ))
        }
        </div>
      </div>
    </div>
  );
};

export default DijkstraVisualize;
