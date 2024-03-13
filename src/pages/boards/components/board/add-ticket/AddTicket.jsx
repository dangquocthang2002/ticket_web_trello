import React, { useEffect, useState, useRef, useCallback } from "react";
import { BsThreeDots } from "react-icons/bs";
import { GrFormAdd, GrClose } from "react-icons/gr";
import { CgCreditCard } from "react-icons/cg";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { addTicket } from "modules/tickets/tickets.action";
import { getSortTicket } from "modules/tickets/ticket.selectors";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const AddNewTicket = (props) => {
  const { column, addTicket, ticketsByState, isAdmin, boardViewOnly } = props;
  const stateId = column._id;

  const tickets = ticketsByState(stateId);

  const [OpenNewTicketForm, setOpenNewTicketForm] = useState(false);
  const [newTicketname, setNewTicketname] = useState("");
  const newTicketTextareRef = useRef();
  const [checkboxPrivate, setCheckboxPrivate] = useState(false);
  const toggleOpenNewTicketForm = () => {
    if (boardViewOnly) {
      return;
    }
    setOpenNewTicketForm(!OpenNewTicketForm);
  };

  const onClickAddNewTicket = () => {
    if (!newTicketname) {
      newTicketTextareRef.current.focus();
      return;
    }

    const positionIndex =
      (tickets[tickets.length - 1]?.positionIndex || 0) + 1000;
    const newTicketToAdd = {
      positionIndex: positionIndex,
      state: stateId,
      name: newTicketname.trim(),
      private: checkboxPrivate,
    };

    addTicket(newTicketToAdd, column);
    setNewTicketname("");
    setCheckboxPrivate(false);
    toggleOpenNewTicketForm();
  };

  const onNewCardName = useCallback(
    (e) => setNewTicketname(e.target.value),
    []
  );
  useEffect(() => {
    if (newTicketTextareRef && newTicketTextareRef.current) {
      newTicketTextareRef.current.focus();
      newTicketTextareRef.current.select();
    }
  }, [OpenNewTicketForm]);

  return (
    <>
      {OpenNewTicketForm && (
        <div className="CartComposer">
          <div className="CartComposer-flex">
            <div className="CartComposer-flex_bd">
              <textarea
                placeholder="Enter a tiltle for this cart ..."
                className="cart-composer"
                onChange={onNewCardName}
                value={newTicketname}
                ref={newTicketTextareRef}
                onKeyDown={(e) => e.key === "Enter" && onClickAddNewTicket()}
              ></textarea>
              {isAdmin && (
                <div className="ticket-private">
                  <input
                    type="checkbox"
                    checked={checkboxPrivate}
                    onChange={() => setCheckboxPrivate(!checkboxPrivate)}
                  />
                  <span>Private</span>
                </div>
              )}
            </div>
            <div className="CartComposer-flex_save">
              <div className="control-cc">
                <button className="btn" onClick={onClickAddNewTicket}>
                  Add cart
                </button>
                <span onClick={toggleOpenNewTicketForm}>
                  <GrClose />
                </span>
              </div>
              <div className="control-section">
                <div className="control-section_icon">
                  <Dropdown>
                    <Dropdown.Toggle
                      size="sm"
                      variant="seconrian"
                      className="dropdown-btn"
                    >
                      <BsThreeDots size={20} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-1">
                      <div className="dropdown-menu-title">
                        <span class="pop-over-header-title">Options</span>
                      </div>
                      <Dropdown.Item>Members...</Dropdown.Item>
                      <Dropdown.Item>Lables...</Dropdown.Item>
                      <Dropdown.Item>Position...</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!OpenNewTicketForm && (
        <div className="list-addcart">
          <div className="list-addcart_b">
            <div
              className="list-addcart_b_button"
              onClick={() => toggleOpenNewTicketForm(false)}
            >
              <button>
                <span>
                  <GrFormAdd size={18} />
                </span>
                <span>Add a card</span>
              </button>
            </div>
            <div className="list-addcart_b_file">
              <CgCreditCard />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  ticketsByState: (stateId) => getSortTicket(state, stateId),
  isAdmin: state.users.isAdmin,
  boardViewOnly: boardViewOnlySelector(state),
});
const mapDispatchToProps = {
  addTicket,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewTicket);
