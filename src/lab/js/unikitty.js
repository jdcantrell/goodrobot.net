/* exported getColor, getBackgroundColor */

// some nice colors
const ctable = [
  [216, 19, 127],
  [214, 84, 7],
  [220, 138, 14],
  [23, 173, 152],
  [20, 155, 218],
  [121, 106, 245],
  [187, 96, 234],
  [199, 32, 202],
];

const getColor = idx => ctable[idx % ctable.length];

const getBackgroundColor = () => [46, 42, 49];
