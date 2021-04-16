import css from "./File.module.scss";
import React from "react";
import iconsImp from "../../../assets/icons";
import { FileI } from "@lib";

const EXTRA_MAPPINGS = [
  { before: /\.(tsx|ts)$/, after: "js" },
  { before: /\.(jpeg)$/, after: "jpg" },
];

interface Props {
  file: FileI;
  className?: string;
}

function FileIcon({ file, className }: Props): JSX.Element {
  let imp = "empty";
  const icons = iconsImp as { [key: string]: string };
  if (file.type == "dir") {
    imp = "folder";
  } else {
    for (const m of EXTRA_MAPPINGS) {
      const name = file.name.replace(m.before, m.after);
      if (name != file.name) {
        imp = m.after.toLowerCase();
        break;
      }
    }
    if (imp === "empty") {
      for (const i in icons) {
        if (file.name.endsWith(`.${i}`)) {
          imp = i;
          break;
        }
      }
    }
  }
  return (
    <div className={className || css.fileIcon}>
      <img src={icons[imp]}></img>
    </div>
  );
}

export default FileIcon;
