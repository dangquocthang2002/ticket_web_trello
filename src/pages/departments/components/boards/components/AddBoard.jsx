import React from "react";
import { Si1Password } from "react-icons/si";
class AddBoard extends React.Component {
  render() {
    return (
      <>
        {this.props.canAddMoreBoard ? (
          <div className="add-board" onClick={(e) => this.props.addBoard(e)}>
            <p>
              <span>Create new board</span>
            </p>
            <p className="remaining">
              <span>{this.props.countBoardCanAdd} remaining</span>
            </p>
            <div className="question-icon">
              <span className="icon-sm icon-help">
                <Si1Password></Si1Password>
              </span>
            </div>
          </div>
        ) : (
          <div className="add-board disabled">
            <p className="remaining-active">
              <span>0 boards remaining</span>
            </p>
            <p className="remaining-active">
              <span> Get unlimited boards</span>
            </p>
            <div className="question-icon">
              <span className="icon-sm icon-help">
                <Si1Password></Si1Password>
              </span>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default AddBoard;
