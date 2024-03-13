import { useRef, useState } from "react";
import { BsJustifyLeft } from "react-icons/bs";
import { connect } from "react-redux";
import { updateTicket } from "modules/tickets/tickets.action";
import { useEffect } from "react";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
// import LinkTool from "@editorjs/link";

const TicketDescription = (props) => {
  const { ticket, updateTicket, boardViewOnly } = props;
  const [readOnly, setReadOnly] = useState(true);

  const onSaveClick = async () => {
    await ejInstance.current.saver.save().then((res) => {
      if (res.blocks?.length > 0) {
        updateTicket({
          _id: ticket._id,
          state: ticket.state,
          content: {
            description: res,
          },
        });
      } else {
        updateTicket({
          _id: ticket._id,
          state: ticket.state,
          content: {
            description: "",
          },
        });
      }
    });
    setReadOnly(true);
    ejInstance.current.readOnly.toggle();
  };

  const onEditClick = () => {
    setReadOnly(false);
    ejInstance.current.readOnly.toggle().then(() => {
      if (!changeDescriptionData(ticket.description).time) {
        ejInstance.current.blocks.clear();
      }
    });
  };
  const onCancelClick = () => {
    setReadOnly(true);
    ejInstance.current.readOnly.toggle();
  };

  const changeDescriptionData = (data) => {
    if (typeof data === "string" && data !== "") {
      return {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: {
              text: data,
            },
          },
        ],
      };
    } else if (data === "" || data === undefined) {
      return {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: "Add a more detailed description…",
            },
          },
        ],
      };
    } else {
      return data;
    }
  };
  const setSizeTextarea = () => {
    const text = Array.from(document.getElementsByTagName("textarea"));
    text.forEach((element) => {
      element.style.height = "inherit";
      element.style.height = element.scrollHeight + 8 + "px";
      element.classList.add("textarea_readonly");
    });
  };
  const ejInstance = useRef();
  useEffect(() => {
    if (readOnly) {
      setTimeout(() => {
        setSizeTextarea();
      }, 50);
    }
  }, [readOnly]);
  useEffect(() => {
    if (!ticket?._id) {
      return;
    }

    ejInstance.current = new EditorJS({
      holder: `${ticket._id}_editor`,
      data: changeDescriptionData(ticket.description),

      readOnly: true,
      placeholder: "Add a more detailed description…",
      logLevel: "ERROR",

      // autofocus: true,
      onReady: () => {
        setSizeTextarea();
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+H",
        },
        code: CodeTool,
        list: {
          class: List,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+L",
        },
        inlineCode: {
          class: InlineCode,
          shortcut: "CMD+SHIFT+C`",
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
            },
          },
        },
        image: SimpleImage,
        table: Table,
        marker: Marker,
      },
    });
    return () => {
      if (ejInstance.current && ejInstance.current.destroy) {
        ejInstance.current.destroy();
      }
    };
  }, [ticket?._id]);
  return (
    <>
      <div className="card-detail_description">
        <span>
          <BsJustifyLeft size={22} />
        </span>
        <div className="card-detail_description_title card-module-title">
          <h3>Description</h3>
        </div>
      </div>
      <div className="ticket-description">
        <div className="des-edit">
          <div
            className={readOnly ? "des-unedit" : "des-editable"}
            id={`${ticket._id}_editor`}
          ></div>
          {boardViewOnly ? (
            <></>
          ) : (
            <button hidden={!readOnly} onClick={onEditClick}>
              {"Edit"}
            </button>
          )}
        </div>
        <div className="des-control" hidden={readOnly}>
          <div>
            <button onClick={onSaveClick} className="des-button des-save">
              Save
            </button>
            <button onClick={onCancelClick} className="des-button des-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  boardViewOnly: boardViewOnlySelector(state),
});
const mapDispatchToProps = {
  updateTicket,
};
export default connect(mapStateToProps, mapDispatchToProps)(TicketDescription);
