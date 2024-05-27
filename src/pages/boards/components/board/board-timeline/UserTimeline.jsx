import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

import FullCalendar from '@fullcalendar/react'
import { Modal } from "antd"
import { getTicketsDoneOfBoard } from 'api/boards.api'
import WavesLoading from 'components/waves-loading/WavesLoading'
import withRouter from 'hocs/withRouter'
import { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { boardColors } from 'utils/colors'

function renderEventContent(eventInfo) {
    return (
        <>
            {/* <b>{eventInfo.timeText}</b> */}
            <i>{eventInfo.event.title}</i>
        </>
    )
}

const UserTimeline = (props) => {
    const param = props.params;
    const navigate = props.navigate;
    const [dataSource, setDataSource] = useState([]);
    const getData = useCallback(async (id) => {
        const res = await getTicketsDoneOfBoard(id);
        setDataSource(res.data.map(item => ({
            ...item,
            title: item.name,
            start: item.createdAt,
            end: item.movedAt,
            backgroundColor: boardColors[Math.floor(Math.random() * boardColors.length)],
            borderColor: "green",
            id: item?._id,
            allDay: true,
            overlap: true,
        })))

    }, [param?.id]);
    const handleEventClick = (ticket) => {
        navigate(`ticket/${ticket.event?.id}`);
        props.handleCancel();
    }
    useEffect(() => {
        if (param?.id) {
            getData(param?.id)
        }
    }, [param?.id])
    return <Modal
        title="User timeline"
        open={true}
        // onOk={handleOk}
        onCancel={() => {
            props.handleCancel()
        }}
        width={1000}
        style={{ minHeight: 900 }}
        footer
    >
        {
            dataSource?.length !== 0 ?
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={[
                        // { title: 'event 1',overlap, date: '2024-05-20', backgroundColor: boardColors[Math.floor(Math.random() * boardColors.length)], borderColor: "green", overlap: true },
                        // { title: 'event 4', start: '2024-05-27', backgroundColor: boardColors[Math.floor(Math.random() * boardColors.length)], end: '2024-05-29' },

                        // { title: 'event 2', start: '2024-05-27', end: '2024-06-02', backgroundColor: boardColors[Math.floor(Math.random() * boardColors.length)] },
                        // { title: 'event 3', date: '2024-05-25', backgroundColor: boardColors[Math.floor(Math.random() * boardColors.length)] },
                        ...dataSource]}
                    headerToolbar={
                        {
                            start: 'today prev,next',
                            center: 'title',
                            end: "dayGridMonth,timeGridWeek,timeGridDay"
                        }
                    }
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                />
                :
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>

                    <WavesLoading waveNumbers={10} />
                </div>
        }
    </Modal>
}
const mapStateToProps = (state) => ({
    isLoading: state.departments.isLoading,
    selectedDepartment: state.departments.selectedDepartment,
    boardActive: state.boards.boardActive,
    departmentsBoards: state.departments.departmentsBoards,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserTimeline))