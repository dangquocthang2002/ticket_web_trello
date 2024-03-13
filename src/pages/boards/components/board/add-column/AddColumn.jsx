import React, { useEffect, useState, useRef, useCallback } from "react";
import { GrFormAdd, GrClose } from "react-icons/gr"
import { connect } from "react-redux";
import { addColumn } from "modules/columns/columns.action"
import { getStates } from "modules/columns/columns.selectors";

import {
    Row,
    Col,
    Form,
} from "react-bootstrap";
import { useParams } from "react-router-dom";

const AddColumn = ({ addColumn, states }) => {
    const {id: boardId} = useParams()
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const [OpenNewColumnForm, setOpenNewColumnForm] = useState(false);
    const newColumnInputRef = useRef();

    const toggleOpenNewColumnForm = () => {
        setOpenNewColumnForm(!OpenNewColumnForm);
    };

    const onNewColumnTitleChange = useCallback(
        (e) => setNewColumnTitle(e.target.value),
        []
    );

    const onClickAddNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return
        }

        const positionIndex = (states[states.length - 1]?.positionIndex || 0) + 10;

        const newColumnToAdd = {
            board: boardId,
            name: newColumnTitle.trim(),
            positionIndex: positionIndex,
        };
        
        addColumn(newColumnToAdd)
        setNewColumnTitle("");
        toggleOpenNewColumnForm();
    }

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [OpenNewColumnForm]);

    return (
        <div className="add-list-wrapper">
            <div className="add-list-wrapper">
                {!OpenNewColumnForm && (
                    <Row>
                        <Col
                            className="add-new-column"
                            onClick={() => toggleOpenNewColumnForm(false)}
                        >
                            <GrFormAdd className="iconss-ss" size={18} />
                            Add another column
                        </Col>
                    </Row>
                )}
                {OpenNewColumnForm && (
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title..."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={e => (e.key === 'Enter') && onClickAddNewColumn()}
                            />
                            <button className="btn-1" onClick={onClickAddNewColumn}>
                                Add list
                            </button>
                            <span
                                className="cancel-new-column"
                                onClick={toggleOpenNewColumnForm}
                            >
                                <GrClose />
                            </span>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    states: getStates(state),
})

const mapDispatchToProps = {
    addColumn
};


export default connect(mapStateToProps, mapDispatchToProps)(AddColumn)