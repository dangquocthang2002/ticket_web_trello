import React, { useState, createContext } from "react";

export const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [ticketLabels, setTicketLabels] = useState([]);
  const [boardLabels, setBoardLabels] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [labelUpdate, setLabelUpdate] = useState({});
  const [isOpenLabelsModal, setIsOpenLabelsModal] = useState(false);

  const toggleModal = () => {
    setIsOpenLabelsModal(!isOpenLabelsModal);
  };

  const addTicketLabel = (label) => {
    const labels = [...boardLabels, label];
    setBoardLabels(labels);

    // call api here
  };
  
  const onSelectLabelOfTicket = (label) => {
    const newTicket = ticketLabels.find((i) => i.ticketId === selectedTicket._id);
    if (newTicket) {
      const oldLabels = newTicket.labels;
      if (oldLabels && oldLabels.filter((l) => l === label.id).length > 0) {
        setTicketLabels([
          ...ticketLabels.filter((i) => i.ticketId !== selectedTicket._id),
          {
            ticketId: selectedTicket._id,
            labels: (newTicket.labels || []).filter((i) => i !== label.id),
          },
        ]);
      } else {
        setTicketLabels([
          ...ticketLabels.filter((i) => i.ticketId !== selectedTicket._id),
          {
            ticketId: selectedTicket._id,
            labels: (newTicket.labels || []).concat(label.id),
          },
        ]);
      }
    } else {
      setTicketLabels([
        ...ticketLabels,
        { ticketId: selectedTicket._id, labels: [].concat(label.id) },
      ]);
    }
    // call api here
  }

  const onUpdateTicketLabel = (newLabelToUpdate) => {
    const newLabel = boardLabels.map((l) =>
      l.id === newLabelToUpdate.id
        ? {
            ...newLabelToUpdate,
          }
        : l
    );
    setBoardLabels(newLabel);
  };

  const onDeleteTicketLabel = (newLabel) => {
    const newTicketsLabel = boardLabels.filter(
      (item) => item.id !== newLabel.id
      );
      setBoardLabels(newTicketsLabel);
  };

  // contextdata
  const ticketContextData = {
    ticketLabels,
    selectedTicket,
    setSelectedTicket,
    setTicketLabels,
    boardLabels,
    labelUpdate,
    addTicketLabel,
    setLabelUpdate,
    onUpdateTicketLabel,
    onDeleteTicketLabel,
    setSelectedColor,
    selectedColor,
    isOpenLabelsModal,
    setIsOpenLabelsModal,
    toggleModal,
    onSelectLabelOfTicket
    
  };
  return (
    <TicketsContext.Provider value={ticketContextData}>
      {children}
    </TicketsContext.Provider>
  );
};
