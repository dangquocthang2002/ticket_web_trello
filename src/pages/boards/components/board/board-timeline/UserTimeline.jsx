import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

import FullCalendar from '@fullcalendar/react'
import { Modal } from "antd"

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}

const UserTimeline = (props) => {
    return <Modal
        title="Title"
        open={true}
        // onOk={handleOk}
        onCancel={() => {
            props.handleCancel()
        }}
        width={1000}
        style={{ minHeight: 900 }}
        footer
    >
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={[
                { title: 'event 1', date: '2024-05-20' },
                { title: 'event 2', start: '2024-05-27', end: '2024-06-02' },
                { title: 'event 3', date: '2024-05-25' }
            ]}
            headerToolbar={
                {
                    start: 'today prev,next',
                    center: 'title',
                    end: "dayGridMonth,timeGridWeek,timeGridDay"
                }
            }
            eventContent={renderEventContent}
        />
    </Modal>
}
const mapStateToProps = (state) => ({
    isLoading: state.departments.isLoading,
    selectedDepartment: state.departments.selectedDepartment,
    boardActive: state.boards.boardActive,
    departmentsBoards: state.departments.departmentsBoards,
  });
  
  const mapDispatchToProps = {
    fetchBoardsByDepartment,
  };
export default connect(mapStateToProps, mapDispatchToProps)(UserTimeline)