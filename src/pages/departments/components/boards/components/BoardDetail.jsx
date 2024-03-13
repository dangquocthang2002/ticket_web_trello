import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import withRouter from "hocs/withRouter";
import { connect } from "react-redux";
import { IoArchive } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";

class BoardDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.board?.name || this.props.board?.content.name,
    };
  }
  handleBoardTitleBlur = () => {
    if (this.state.title === "") {
      this.setState({
        title: this.props.board?.name || this.props.board?.content.name,
      });

      return;
    }
    this.props.editBoardTitle({
      _id: this.props.board?._id,
      content: {
        name: this.state.title,
      },
    });
  };
  handleBoardViewOnlyCb = () => {
    this.props.editBoardTitle({
      _id: this.props.board?._id,
      content: {
        viewOnly: !this.props.board?.viewOnly,
      },
    });
  };
  onBoardTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };
  handleClickDeleteBoard = () => {
    this.props.deleteBoard(this.props.board);
  };
  setBgColor = () =>
    this.props.board?.content
      ? this.props.board?.content.description
      : this.props.board?.description;

  clickOnBoard = () => {
    if (this.props.board?._id) {
      this.props.navigate("/boards/" + this.props.board?._id);
    }
  };

  render() {
    return (
      <div
        className="board-tile"
        href="a"
        style={{
          backgroundColor: this.setBgColor(),
        }}
      >
        {!this.props.invitedBoard && this.props.isAdmin ? (
          <input
            value={this.state.title}
            placeholder={"Enter board title..."}
            className="board-tile-details-name ignore-elements"
            onFocus={(e) => e.preventDefault()}
            onChange={this.onBoardTitleChange}
            onBlur={this.handleBoardTitleBlur}
          />
        ) : (
          <input
            value={this.state.title}
            className="board-tile-details-name ignore-elements"
            readOnly={true}
          />
        )}
        {this.props.isAdmin && (
          <div className="delete-icon-display ignore-elements">
            {!this.props.invitedBoard && (
              <IoArchive
                size={16}
                onClick={this.handleClickDeleteBoard}
              ></IoArchive>
            )}
          </div>
        )}
        <button
          className="view-board-icon ignore-elements"
          onClick={this.clickOnBoard}
        >
          <AiOutlineArrowRight />
        </button>
        <div className="board-view-only">
          {this.props.isAdmin && (
            <input
              id={`view-mode-checkbox_${this.props.board?._id}`}
              className={`${
                this.props.board?.viewOnly ? "checked" : ""
              } ignore-elements`}
              type="checkbox"
              checked={this.props.board?.viewOnly ? true : false}
              onChange={this.handleBoardViewOnlyCb}
            />
          )}
          {(this.props.isAdmin
            ? true
            : this.props.board?.viewOnly
            ? true
            : false) && (
            <span>
              <label htmlFor={`view-mode-checkbox_${this.props.board?._id}`}>
                <AiOutlineEye size={18} /> mode
              </label>
            </span>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,
});

export default connect(mapStateToProps)(withRouter(BoardDetail));
