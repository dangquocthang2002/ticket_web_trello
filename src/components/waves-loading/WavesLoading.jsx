const WavesLoading = (props) => {
  const { waveNumbers } = props;
  const rows = [];
  for (let index = 0; index < waveNumbers; index++) {
    rows.push(<div key={index} className="wave"></div>);
  }
  return rows;
};

export default WavesLoading;
