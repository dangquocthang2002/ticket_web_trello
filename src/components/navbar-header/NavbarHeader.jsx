import { Avatar, Badge, List, Popover, message } from "antd";
import { getListNotification } from "api/notification.api";
import ProfilePopup from "components/profile-popup/ProfilePopup";
import { getListNotificationsUnSeen } from "modules/notifications/notifications.action";
import VirtualList from "rc-virtual-list";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import {
  IoIosBody,
  IoIosCalendar,
  IoIosNotificationsOutline,
} from "react-icons/io";
import { IoArchive } from "react-icons/io5";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "utils/formatDate";
const ContainerHeight = 400;
const NavbarHeader = (props) => {
  const { isAdmin } = props;
  const [showProfilePopup, setshowProfilePopup] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [pageCount, setPageCount] = useState(1)
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const hide = () => {
    setOpenNotification(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpenNotification(newOpen);
  };
  const onScroll = (e) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
      fetchData();
    }
  };
  const listNotification = () => {
    return (
      data.length !== 0 && (
        <List>
          <VirtualList
            data={data}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="email"
            onScroll={onScroll}
            style={{
              width: "280px"
            }}
          >
            {(item) => (
              <List.Item key={item?.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        item.type === "START"
                          ? "/assets/start-icon-png.jpg"
                          : item.type === "LATE"
                            ? "/assets/late-icon-png.jpg"
                            : "/assets/normal-icon.webp"
                      }
                    />
                  }
                  title={<a href={`/#/boards/${item?.fromId}`}>{item?.type}</a>}
                  description={<div><div>{item?.content}</div><span>{formatDate(item?.createdAt)}</span></div>}
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      )
    );
  };
  const fetchData = async () => {
    await getListNotification(pageCount, 10).then(res => {
      setData(data.concat(res.data));
      setPageCount((prev) => prev + 1);
      message.success(`${res.data.length} more items loaded!`);
    })
  }
  useEffect(() => {
    if (openNotification) {
      dispatch(getListNotificationsUnSeen(true))
      fetchData()
    } else {
      setData([])
      setPageCount(1)
    }
  }, [openNotification]);
  return (
    <div className="navbar-menu">
      <div className="navbar-menu_logo">
        <img
          className="navbar-menu_logo_img"
          src={"/assets/khoawin-single.png"}
          alt=""
        />
        <Link to={"/"}>KhoaWinTicket</Link>
      </div>
      <div className="navbar-menu_l">
        {isAdmin && (
          <div className="navbar-menu_l_userDepartment">
            <Link to="/archived/boards">
              <IoArchive size={30} />
              <span>Archives</span>
            </Link>
          </div>
        )}
        {isAdmin && (
          <div className="navbar-menu_l_userDepartment">
            <Link to="/users">
              <IoIosBody size={30} />
              <span>Users</span>
            </Link>
          </div>
        )}
        <div className="navbar-menu_l_userDepartment">
          <Link to="/departments">
            <IoIosCalendar size={30} />
            <span>Departments</span>
          </Link>
        </div>
        <div className="navbar-menu_l_search">
          <span className="search-icon">
            <BsSearch className="bs" />
          </span>
          <span>
            <input type="" placeholder="Search" />
          </span>
        </div>
        <Badge count={openNotification ? 0 : props.unSeen} showZero>
          <Popover
            content={listNotification}
            title="Ticket status"
            trigger="click"
            open={openNotification}
            onOpenChange={handleOpenChange}
            className="navbar-menu_l_notification"
            placement="bottomRight"
          >

            <button type="primary">
              <IoIosNotificationsOutline size={20} />
            </button>
          </Popover>
        </Badge>
        <div className="navbar-menu_l_profileview">
          <button onClick={() => setshowProfilePopup(!showProfilePopup)}>
            <CgProfile size={20} />
          </button>
          {/* <button>
            <CgProfile size={20} />
          </button> */}
        </div>
        {showProfilePopup && (
          <ProfilePopup setshowProfilePopup={setshowProfilePopup} />
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,
  notifications: state.notifications.notifications,
  unSeen: state.notifications.unSeen,
});
export default connect(mapStateToProps)(NavbarHeader);
