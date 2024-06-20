import React from 'react';

const ColorSquare = ({ color, name }) => {
  const style = {
    paddingInline: '10px',
    width: 'auto',
    height: '20px',
    backgroundColor: color,
    color: getContrastColor(color),
    borderRadius: '4px',
    fontSize: '13px',
  };

  function getContrastColor(color) {
    const rgb = hexToRgb(color);
    const brightness = (rgb.r + rgb.g + rgb.b) / 3;

    return brightness > 128 ? '#000000' : '#ffffff';
  }

  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  }

  return (
    <div style={style}>
      <span>{name}</span>
    </div>
  );
};

export default ColorSquare;
