import React, { useEffect, useRef, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import Pagination from "./Pagination";
import Search from "./Search";

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(1);
  const [isEditing, setIsEditing] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [ischecked, setIsChecked] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState();
  const [searchString, setSearchString] = useState("");

  const inputRef = useRef(null);

  const getData = () => {
    const url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        initialize();
      })
      .catch((err) => console.log(err));
  };
  const initialize = () => {
    const noOfUsers = filteredUsers.length;
    if (noOfUsers % 10 === 0) setNoOfPages(Math.floor(noOfUsers / 10));
    else setNoOfPages(Math.floor(noOfUsers / 10) + 1);
    const arr = Array.from({ length: noOfUsers }).fill(false);
    setIsEditing(arr);
    setIsChecked([...arr]);
    setIsCheckAll(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    changeCheckAll(false);
  }, [page]);

  useEffect(() => {
    initialize();
  }, [filteredUsers]);

  useEffect(() => {
    filter();
  }, [users]);

  const filter = () => {
    const newUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchString.toLowerCase()) ||
        user.email.toLowerCase().includes(searchString.toLowerCase()) ||
        user.role.toLowerCase().includes(searchString.toLowerCase())
    );
    setFilteredUsers(newUsers);
  };

  const changeChecked = (e, i) => {
    let prevIsChecked = ischecked;
    prevIsChecked[i] = e.target.checked;
    setIsChecked([...prevIsChecked]);
  };

  const changeCheckAll = (c) => {
    setIsCheckAll(c);
    let prevIsChecked = ischecked;
    for (let i = (page - 1) * 10; i < page * 10; i++) {
      prevIsChecked[i] = c;
    }
    setIsChecked([...prevIsChecked]);
  };

  const changeToEditing = (i) => {
    if (name !== "") return;
    let prevIsEditing = isEditing;
    prevIsEditing[i] = true;
    setIsEditing([...prevIsEditing]);
    setName(filteredUsers[i].name);
    setEmail(filteredUsers[i].email);
    setRole(filteredUsers[i].role);
    inputRef.current.focus();
  };

  const saveChanges = (id, i) => {
    if (name === "" || email === "" || role === "") return;
    let prevUsers = users;
    let prevIsEditing = isEditing;
    prevUsers = prevUsers.map((user) => {
      if (user.id === id) return { ...user, name, email, role };
      else return user;
    });
    setUsers([...prevUsers]);
    prevIsEditing[i] = false;
    setIsEditing([...prevIsEditing]);
    setName("");
    setEmail("");
    setRole("");
  };

  const deleteUser = (id) => {
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers);
  };

  const deleteSelected = () => {
    let newUsers = users;
    filteredUsers.forEach((fUser, j) => {
      if (ischecked[j])
        newUsers = newUsers.filter((user) => user.id !== fUser.id);
    });
    setUsers(newUsers);
  };

  return (
    <div className="users-container">
      <Search
        searchString={searchString}
        setSearchString={setSearchString}
        filter={filter}
      />
      <div className="titles row">
        <input
          className="item"
          type="checkbox"
          name=""
          id=""
          checked={isCheckAll}
          onChange={(e) => changeCheckAll(e.target.checked)}
        />
        <p className="title item">Name</p>
        <p className="title item">Email</p>
        <p className="title item">Role</p>
        <p className="title item">Actions</p>
      </div>
      {filteredUsers.map((user, index) => (
        <>
          {index >= (page - 1) * 10 && index < page * 10 ? (
            <div
              className={
                ischecked[index] === true ? "user row checked" : "user row"
              }
            >
              <input
                type="checkbox"
                name=""
                id=""
                className="item"
                checked={ischecked[index]}
                onChange={(e) => changeChecked(e, index)}
              />
              {isEditing[index] === true ? (
                <>
                  <input
                    type="text"
                    className="item input"
                    name=""
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="item input"
                    name=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    className="item input"
                    name=""
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <p className="item">{user?.name}</p>
                  <p className="item">{user?.email}</p>
                  <p className="item">{user?.role}</p>
                </>
              )}
              <div className="actions item">
                <button
                  className="action-btn edit"
                  onClick={() => changeToEditing(index)}
                >
                  <BiSolidEdit />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => deleteUser(user.id)}
                >
                  <MdOutlineDelete />
                </button>
                <button
                  className={
                    isEditing[index] === true
                      ? "action-btn save"
                      : "action-btn hide save"
                  }
                  onClick={() => saveChanges(user.id, index)}
                >
                  <IoSaveOutline />
                </button>
              </div>
            </div>
          ) : null}
        </>
      ))}
      <Pagination
        page={page}
        noOfPages={noOfPages}
        setPage={setPage}
        changeCheckAll={changeCheckAll}
        deleteSelected={deleteSelected}
      />
    </div>
  );
};

export default App;
