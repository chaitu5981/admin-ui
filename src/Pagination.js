import React from "react";
import { RxTrackPrevious } from "react-icons/rx";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { RxTrackNext } from "react-icons/rx";
const Pagination = ({ page, noOfPages, setPage, deleteSelected }) => {
  return (
    <div className="bottom">
      <button className="del-btn" onClick={deleteSelected}>
        Delete Selected
      </button>
      <div className="pagination-btns">
        <button
          className="pagination-btn first-page"
          onClick={() => {
            setPage(1);
          }}
        >
          <RxTrackPrevious />
        </button>
        <button
          className="pagination-btn previous-page"
          onClick={() => setPage(page - 1 < 1 ? 1 : page - 1)}
        >
          <GrFormPrevious />
        </button>
        {[...Array(noOfPages)].map((e, i) => (
          <button
            className={i + 1 <= page ? "pagination-btn" : "pagination-btn blue"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pagination-btn blue next-page"
          onClick={() => setPage(page + 1 > noOfPages ? noOfPages : page + 1)}
        >
          <GrFormNext />
        </button>
        <button
          className="pagination-btn blue last-page"
          onClick={() => setPage(noOfPages)}
        >
          <RxTrackNext />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
