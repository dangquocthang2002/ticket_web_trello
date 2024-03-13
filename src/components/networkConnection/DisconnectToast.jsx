import WavesLoading from "components/waves-loading/WavesLoading";

const DisconnectToast = () => {
  function reload() {
    window.location.reload();
  }
  return (
    <>
      <div
        class="toast show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          {/* <img src="..." class="rounded mr-2" alt="..."> */}
          <strong class="mr-auto">Connection lost&ensp;</strong>
          <WavesLoading waveNumbers={4} />
        </div>
        <div class="toast-body">Something went wrong!</div>
        <button onClick={reload} className="p-btn">
          <span>Reload</span>
        </button>
      </div>
    </>
  );
};

export default DisconnectToast;
