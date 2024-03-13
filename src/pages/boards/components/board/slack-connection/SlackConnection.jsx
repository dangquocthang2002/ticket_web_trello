import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { connect } from "react-redux";
import withRouter from "hocs/withRouter";
import {
  fetchSlackDataByBoard,
  updateSlackData,
  changeSlackData,
} from "modules/slackConnection/slackConnection.action";
import { BsCheck } from "react-icons/bs";
import { GrClose } from "react-icons/gr";

const SlackConnection = (props) => {
  const {
    params,
    setShowSlackConnection,
    fetchSlackDataByBoard,
    slackData,
    updateSlackData,
    changeSlackData,
    states,
  } = props;
  const ref = useRef();
  const [channelValue, setChannelValue] = useState(null);
  const [botTokenValue, setBotTokenValue] = useState(null);
  const [openCheckboxMoving, setOpenCheckboxMoving] = useState(false);

  useOnClickOutside(ref, () => setShowSlackConnection(false));
  const { id } = params;

  const slackDataList = [
    {
      name: "Create",
      key: "create",
    },
    {
      name: "Update",
      key: "update",
    },
    {
      name: "Delete",
      key: "delete",
    },
    {
      name: "Archive",
      key: "archive",
    },
    {
      name: "Restore",
      key: "restore",
    },
    {
      name: "Assign members",
      key: "modifyUser",
    },
    {
      name: "Moving",
      key: "move",
    },
    {
      name: "Assign labels",
      key: "assignLabel",
    },
  ];
  const handleChangeSlackData = (data) => {
    const slack = slackData[id];
    if (
      Object.keys(data).includes("channel") ||
      Object.keys(data).includes("botToken")
    ) {
      const newData = { ...slack, ...data };
      changeSlackData(newData);
    } else if (Object.keys(data).includes("move")) {
      if (slackData[id].data.move.moveApplyFor) {
        const status = { status: data.move };
        const newData = {
          ...slack,
          data: {
            ...slack["data"],
            move: { ...slack["data"]["move"], ...status },
          },
        };
        changeSlackData(newData);
      } else {
        const status = { status: data.move, moveApplyFor: [] };
        const newData = {
          ...slack,
          data: {
            ...slack["data"],
            move: { ...slack["data"]["move"], ...status },
          },
        };
        changeSlackData(newData);
      }
      setOpenCheckboxMoving(data.move.status);
    } else {
      const newData = { ...slack, data: { ...slack["data"], ...data } };
      changeSlackData(newData);
    }
  };
  const handleCheckState = (state) => {
    const slack = slackData[id];

    const isChecked = slackData[id].data.move.moveApplyFor?.includes(state._id);
    if (isChecked) {
      const newData = {
        ...slack,
        data: {
          ...slack["data"],
          move: {
            ...slack["data"]["move"],
            ...{
              moveApplyFor: slack["data"]["move"]["moveApplyFor"].filter(
                (item) => item !== state._id
              ),
            },
          },
        },
      };
      changeSlackData(newData);
    } else {
      const newData = {
        ...slack,
        data: {
          ...slack["data"],
          move: {
            ...slack["data"]["move"],
            ...{
              moveApplyFor: [
                ...slack["data"]["move"]["moveApplyFor"],
                state._id,
              ],
            },
          },
        },
      };
      changeSlackData(newData);
    }
  };
  const handleCheckStateAll = () => {
    const slack = slackData[id];
    const isChecked = states
      .map((state) => state._id)
      .every((item) => slackData[id].data.move.moveApplyFor?.includes(item));
    if (isChecked) {
      const newData = {
        ...slack,
        data: {
          ...slack["data"],
          move: {
            ...slack["data"]["move"],
            ...{
              moveApplyFor: slack["data"]["move"]["moveApplyFor"].filter(
                (item) => !states.map((state) => state._id).includes(item)
              ),
            },
          },
        },
      };
      changeSlackData(newData);
    } else {
      const newData = {
        ...slack,
        data: {
          ...slack["data"],
          move: {
            ...slack["data"]["move"],
            ...{
              moveApplyFor: Array.from(
                new Set([
                  ...slack["data"]["move"]["moveApplyFor"],
                  ...states.map((state) => state._id),
                ])
              ),
            },
          },
        },
      };
      changeSlackData(newData);
    }
  };
  useEffect(() => {
    fetchSlackDataByBoard(id);
  }, []);
  return (
    <>
      <div className="slack-connection">
        <div ref={ref} className="slack-connection-wrapper">
          <div className="slack-connection-header">
            <h5>Slack Connection</h5>
            <button
              className="header-close-btn"
              onClick={() => setShowSlackConnection(false)}
            >
              <GrClose size={18} />
            </button>
          </div>
          <div className="slack-connection-channel">
            <div className="slack-connection-channel-wrapper">
              <h6>Enter Bot Token</h6>
              <div className="slack-connection-select">
                <input
                  className="inputBox"
                  type="text"
                  defaultValue={
                    slackData[id]?.botToken
                      ? slackData[id].botToken
                      : botTokenValue
                  }
                  onChange={(e) => {
                    setBotTokenValue(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== slackData[id]?.botToken) {
                      if (botTokenValue === "")
                        handleChangeSlackData({ botToken: null });
                      else handleChangeSlackData({ botToken: botTokenValue });
                    }
                  }}
                />
              </div>
            </div>
            <div className="slack-connection-channel-wrapper">
              <h6>Enter Channel</h6>
              <div className="slack-connection-select">
                <input
                  className="inputBox"
                  type="text"
                  defaultValue={
                    slackData[id]?.channel
                      ? slackData[id].channel
                      : channelValue
                  }
                  onChange={(e) => {
                    setChannelValue(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== slackData[id]?.channel) {
                      if (channelValue === "")
                        handleChangeSlackData({ channel: null });
                      else handleChangeSlackData({ channel: channelValue });
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="slack-connection-content">
            <h6>Notifications</h6>
            <div className="slack-connection-list">
              <ul>
                {slackData[id]
                  ? slackDataList.map((slack) =>
                      !slackData[id]?.data[slack.key] ||
                      slackData[id]?.data[slack.key]["status"] === false ? (
                        <li
                          key={slack.key}
                          className="slack-connection-item"
                          onClick={() => {
                            if (slack.key === "move") {
                              handleChangeSlackData({
                                [slack.key]:
                                  !slackData[id]?.data[slack.key].status,
                              });
                            } else {
                              handleChangeSlackData({
                                [slack.key]: !slackData[id]?.data[slack.key],
                              });
                            }
                          }}
                        >
                          <span>{slack.name}</span>
                        </li>
                      ) : (
                        <li
                          key={slack.key}
                          className="slack-connection-item active"
                          onClick={() => {
                            if (slack.key === "move") {
                              handleChangeSlackData({
                                [slack.key]:
                                  !slackData[id]?.data[slack.key].status,
                              });
                            } else {
                              handleChangeSlackData({
                                [slack.key]: !slackData[id]?.data[slack.key],
                              });
                            }
                          }}
                        >
                          <span>{slack.name}</span>
                          <span className="check-slack">
                            <BsCheck size={22} />
                          </span>
                        </li>
                      )
                    )
                  : ""}
              </ul>
              {openCheckboxMoving ||
                (slackData[id]?.data["move"].status && states.length !== 0 && (
                  <ul className="checkbox-moving">
                    <h6>Choose states to get nofications</h6>
                    {slackData[id] ? (
                      states
                        .map((state) => state._id)
                        .every((item) =>
                          slackData[id].data.move.moveApplyFor?.includes(item)
                        ) ? (
                        <li
                          className="state-selection active"
                          onClick={() => handleCheckStateAll()}
                        >
                          <span>ALL</span>
                          <span className="check-slack">
                            <BsCheck size={22} />
                          </span>
                        </li>
                      ) : (
                        <li
                          className="state-selection"
                          onClick={() => handleCheckStateAll()}
                        >
                          <span>ALL</span>
                        </li>
                      )
                    ) : (
                      ""
                    )}
                    {slackData[id]
                      ? states?.map((state) =>
                          slackData[id].data.move.moveApplyFor?.includes(
                            state._id
                          ) ? (
                            <li
                              key={state._id}
                              className="state-selection active"
                              onClick={() => handleCheckState(state)}
                            >
                              <span>{state.name}</span>
                              <span className="check-slack">
                                <BsCheck size={22} />
                              </span>
                            </li>
                          ) : (
                            <li
                              key={state._id}
                              className="state-selection"
                              onClick={() => handleCheckState(state)}
                            >
                              <span>{state.name}</span>
                            </li>
                          )
                        )
                      : ""}
                  </ul>
                ))}
            </div>
          </div>
          <div className="slack-connection-submit">
            <button
              type="button"
              className="submit-btn"
              onClick={() => {
                updateSlackData(slackData[id]);
                setShowSlackConnection(false);
              }}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  slackData: state.slackConnection.slackData,
  states: state.states.states,
});
const mapDispatchToProps = {
  fetchSlackDataByBoard,
  updateSlackData,
  changeSlackData,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SlackConnection));
