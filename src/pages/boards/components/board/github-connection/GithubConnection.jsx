import withRouter from "hocs/withRouter";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";
import { connect } from "react-redux";
import {
  fetchGithubDataByBoard,
  updateGithubData,
  changeGithubData,
  createGithubDataByBoard,
} from "modules/githubConnection/githubConnection.action";
import { BsTrash } from "react-icons/bs";
import { toastError } from "utils/toastHelper";

const GithubConnection = (props) => {
  const {
    params,
    setShowGitHubConnection,
    fetchGithubDataByBoard,
    updateGithubData,
    changeGithubData,
    createGithubDataByBoard,
    githubByBoard,
  } = props;
  const { id } = params;
  const ref = useRef();
  const [openAddRepo, setOpenAddRepo] = useState(false);
  const [usernameValue, setUsernameValue] = useState(null);
  const [accessTokenValue, setAccessTokenValue] = useState(null);
  const [textAddRepository, setTextAddRepository] = useState("");
  const [textAreaContent, setTextAreaContent] = useState("");
  useOnClickOutside(ref, () => setShowGitHubConnection(false));

  const handleChangeGithubData = (data) => {
    const github = githubByBoard[id];
    if (
      Object.keys(data).includes("username") ||
      Object.keys(data).includes("accessToken")
    ) {
      const newData = { ...github, ...data };
      changeGithubData(newData);
    } else {
      const repositories = github["data"]["repositories"];
      const newData = {
        ...github,
        data: {
          ...github["data"],
          repositories: repositories.map((item, index) =>
            index === data.index ? data.repository : item
          ),
        },
      };
      changeGithubData(newData);
    }
  };
  const onCloseAddRepositoryForm = () => {
    setOpenAddRepo(false);
    setTextAddRepository("");
  };
  const onAddNewRepository = () => {
    const github = githubByBoard[id];
    const repositories = github["data"]["repositories"];
    if (textAddRepository === "") {
      toastError("Invalid value!");
      return;
    }
    if (repositories.find((repo) => textAddRepository === repo)) {
      toastError("Duplicate repositories");
      return;
    }
    onCloseAddRepositoryForm();
    const newData = {
      ...github,
      data: {
        ...github["data"],
        repositories: [...repositories, textAddRepository],
      },
    };
    changeGithubData(newData);
  };

  const onBlurRepoInput = (e, repository, index) => {
    if (e.target.value !== repository) {
      if (textAreaContent === "") {
        setTextAreaContent(repository);
        toastError("Invalid value!");
        return;
      }
      if (
        githubByBoard[id]?.data.repositories.find((repo) =>
          repo === textAreaContent
        )
      ) {
        setTextAreaContent(repository);
        toastError("Duplicate repositories");
        return;
      } else
        handleChangeGithubData({
          repository: textAreaContent,
          index: index,
        });
    }
  };

  useEffect(() => {
    fetchGithubDataByBoard(id).then((res) => {
      console.log(res);
      if (!res.data) {
        createGithubDataByBoard(id);
      }
    });
  }, []);
  return (
    <>
      <div className="github-connection">
        <div ref={ref} className="github-connection-wrapper">
          <div className="github-connection-header">
            <h5>Github Connection</h5>
            <button
              className="header-close-btn"
              onClick={() => setShowGitHubConnection(false)}
            >
              <GrClose size={18} />
            </button>
          </div>
          <div className="github-connection-content">
            <div className="github-connection-content-wrapper">
              <h6>Enter Access Token</h6>
              <div className="github-connection-input">
                <input
                  className="inputBox"
                  type="text"
                  defaultValue={
                    githubByBoard[id]?.accessToken
                      ? githubByBoard[id].accessToken
                      : accessTokenValue
                  }
                  onChange={(e) => {
                    setAccessTokenValue(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== githubByBoard[id]?.accessToken) {
                      if (accessTokenValue === "")
                        handleChangeGithubData({ accessToken: null });
                      else
                        handleChangeGithubData({
                          accessToken: accessTokenValue,
                        });
                    }
                  }}
                />
              </div>
            </div>
            <div className="github-connection-content-wrapper">
              <h6>Enter Username</h6>
              <div className="github-connection-input">
                <input
                  className="inputBox"
                  type="text"
                  defaultValue={
                    githubByBoard[id]?.username
                      ? githubByBoard[id].username
                      : usernameValue
                  }
                  onChange={(e) => {
                    setUsernameValue(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== githubByBoard[id]?.username) {
                      if (usernameValue === "")
                        handleChangeGithubData({ username: null });
                      else
                        handleChangeGithubData({
                          username: usernameValue,
                        });
                    }
                  }}
                />
              </div>
            </div>
            <div className="github-connection-content-wrapper">
              <h6>Repositories</h6>
              {githubByBoard[id]?.data?.repositories.length > 0 && (
                <div className="github-connection-list">
                  {githubByBoard[id]?.data.repositories.map(
                    (repository, index) => (
                      <div
                        className="github-connection-repository"
                        key={repository}
                      >
                        <input
                          className="inputBox"
                          type="text"
                          defaultValue={repository}
                          onChange={(e) => setTextAreaContent(e.target.value)}
                          onBlur={(e) => onBlurRepoInput(e, repository, index)}
                        />
                        <button
                          className="btn"
                          onClick={() => {
                            const isConfirmed = window.confirm("Are you sure?");
                            if (isConfirmed) {
                              const github = githubByBoard[id];
                              const newData = {
                                ...github,
                                data: {
                                  ...github["data"],
                                  repositories: github["data"][
                                    "repositories"
                                  ].filter((repo) => repo !== repository),
                                },
                              };
                              changeGithubData(newData);
                            }
                          }}
                        >
                          <span>
                            <BsTrash size={16} />
                          </span>
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
              <div className="github-connection-input">
                {openAddRepo ? (
                  <>
                    <input
                      className="inputBox"
                      type="text"
                      autoFocus
                      placeholder="Enter new repository"
                      onChange={(e) => {
                        setTextAddRepository(e.target.value);
                      }}
                    />
                    <button className="btn add" onClick={onAddNewRepository}>
                      <span>Add</span>
                    </button>
                    <button
                      className="btn cancel"
                      onClick={onCloseAddRepositoryForm}
                    >
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-new-item btn"
                    onClick={() => {
                      setOpenAddRepo(true);
                    }}
                  >
                    <span>Add an item</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="github-connection-submit">
            <button
              type="button"
              className="submit-btn"
              onClick={() => {
                updateGithubData(githubByBoard[id]);
                setShowGitHubConnection(false);
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
  githubByBoard: state.githubConnection.githubByBoard,
});
const mapDispatchToProps = {
  fetchGithubDataByBoard,
  updateGithubData,
  changeGithubData,
  createGithubDataByBoard,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GithubConnection));
