import css from "./File.module.scss";
import React from "react";
import iconsImp from "@icons";
import { FileI } from "@lib";

const EXTRA_MAPPINGS = [
  { before: /\.(tsx|ts)$/, after: "js" },
  { before: /\.(jpeg|jpg|png|tif|bmp|tif|gif|webp)$/, after: "image" },
  { before: /\.(xls)/, after: "xlsx" },
  { before: /\.(ppt)/, after: "pptx" },
  { before: /\.(doc)/, after: "docx" },
  { before: /\.(sh|ps1|ps2|bat)/, after: "shell" },
  { before: /\.(mp4|vlc|mov|mkv|amv|svi|mv4|flv|f4v|qt|webm)/, after: "video" },
  {
    before: /\.(m4a|mp3|wav|aac|3gp|aiff|flac|ogg|oga|mogg|opus|wma)/,
    after: "music",
  },
];

interface Props {
  file: FileI;
  className?: string;
}

function FileIcon({ file, className }: Props): JSX.Element {
  let imp = "empty";
  const icons = iconsImp as { [key: string]: string };
  if (file.type == "FOLDER") {
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
