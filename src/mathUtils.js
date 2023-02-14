export const Point = (x, y) => ({ x, y });

export const sum = (s, f) => ({ x: f.x + s.x, y: f.y + s.y });
export const diff = (s, f) => ({ x: f.x - s.x, y: f.y - s.y });
export const Vec = diff;

export const length = (vec) => {
  const { x, y } = vec;
  return Math.sqrt(x * x + y * y);
}

export const normalized = (vec) => {
  const len = length(vec);
  return {
    x: vec.x / len,
    y: vec.y / len
  };
};

export const scaled = (vec, k) => {
  return {
    x: vec.x * k,
    y: vec.y * k
  };
};

export const scaledTo = (vec, len) => {
  const vecLen = length(vec);
  return {
    x: vec.x / vecLen * len,
    y: vec.y / vecLen * len
  };
};

export const rotated = (vec, angle) => {
  return {
    x: vec.x * Math.cos(angle) - vec.y * Math.sin(angle),
    y: vec.x * Math.sin(angle) + vec.y * Math.cos(angle)
  };
};
