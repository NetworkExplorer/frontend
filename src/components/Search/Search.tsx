import css from "./Search.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@store";
import { setSearch } from "@store/app";

export function Search(): JSX.Element {
  const { search } = useSelector(({ appReducer: { search } }: RootState) => ({
    search,
  }));
  const dispatch = useAppDispatch();
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const keyUp = (ev: KeyboardEvent | React.KeyboardEvent) => {
    if (search.searching && ev.key === "Escape") {
      ev.preventDefault();
      ev.stopPropagation();
      dispatch(
        setSearch({ searching: false, shouldFocus: false, searchText: "" })
      );
      document.removeEventListener("keyup", keyUp);
    }
  };

  // useEffect(() => {
  //   if (!listening && search.searching) {
  //     document.addEventListener("keyup", keyUp);
  //     setListening(true);
  //   } else {
  //     dispatch(
  //       setSearch({ searching: false, shouldFocus: false, searchText: "" })
  //     );
  //     setListening(false);
  //     document.removeEventListener("keyup", keyUp);
  //   }
  // }, [search.searching]);

  useEffect(() => {
    if (search.shouldFocus) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [search.shouldFocus]);

  return (
    <div className={`${css.search} ${search.searching ? css.shown : ""}`}>
      <input
        type="text"
        placeholder="Search files..."
        value={search.searchText}
        onChange={(e) =>
          dispatch(
            setSearch({
              searching: true,
              shouldFocus: true,
              searchText: e.target.value,
            })
          )
        }
        ref={inputRef}
        // onKeyUp={(e) => keyUp(e)}
      />
    </div>
  );
}
