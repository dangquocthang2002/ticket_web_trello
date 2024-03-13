export const labelColors = [
  "#C1FCBB",
  "#FFF8BD",
  "#FFE9BD",
  "#FFBDC0",
  "#FCBBE0",
  "#C0D2FA",
  "#DBFDBC",
  "#F7FFBD",
  "#FFE0BD",
  "#FDBCD1",
  "#E1BDFA",
  "#C3C4FA",
  "#BAFAD9",
  "#FFF3BD",
  "#FFD8BD",
  "#F1BBFA",
  "#D6BFFA",
  "#B9F9F0",
  "#FFEEBD",
  "#FFCDBD",
  "#CDC1FA",
  "#BCE5F9",
  "#FFFDBD",
  "#E8FEBC",
];

function LightenDarkenColor(col, amt) {
  var usePound = false;

  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export const boardColors = [
  "#C1FCBB",
  "#FFF8BD",
  "#FFE9BD",
  "#FFBDC0",
  "#FCBBE0",
  "#C0D2FA",
  "#DBFDBC",
  "#F7FFBD",
  "#FFE0BD",
  "#FDBCD1",
  "#E1BDFA",
  "#C3C4FA",
  "#BAFAD9",
  "#FFF3BD",
  "#FFD8BD",
  "#F1BBFA",
  "#D6BFFA",
  "#B9F9F0",
  "#FFEEBD",
  "#FFCDBD",
  "#CDC1FA",
  "#BCE5F9",
  "#FFFDBD",
  "#E8FEBC",
].map((c) => LightenDarkenColor(c, -60));
