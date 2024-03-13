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

export const colorsList = [
  "#61bd4f",
  "#CCA42B",
  "#ff9f1a",
  "#eb5a46",
  "#c377e0",
  "#0079bf",
  "#00c2e0",
  "#4ED583",
  "#ff78cb",
  "#344563",
  ...[
    "#C0C0C0",
    "#808080",
    "#000000",
    "#FF0000",
    "#800000",
    "#FFFF00",
    "#808000",
    "#00FF00",
    "#008000",
    "#00FFFF",
    "#008080",
    "#0000FF",
    "#000080",
    "#FF00FF",
    "#800080",
  ],
  ...[
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
  ].map((t) => LightenDarkenColor(t, -20)),
];
