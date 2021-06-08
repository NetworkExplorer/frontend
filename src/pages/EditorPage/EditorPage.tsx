import React, { useEffect, useState } from "react";
import css from "./EditorPage.module.scss";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as Monaco from "monaco-editor";
import { Layout } from "@components";
import { options } from "./EditorOptions";
import { useAppDispatch } from "@store";
import { setEditor, setEditorReady } from "@store/editor";
import { Endpoints, normalizeURL, ROUTES } from "@lib";
import { addBubble } from "@store/app";
import FileIcon from "@components/Files/File/FileIcon";

export const EditorPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setEditorReady(false));
  }, []);
  const fileURL = normalizeURL(
    window.location.pathname.replaceAll(ROUTES.EDITOR, ""),
    false,
    false
  );
  const name = fileURL.split("/").reverse()[0];
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    return () => {
      dispatch(setEditor(undefined));
    };
  }, []);

  async function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) {
    dispatch(setEditorReady(true));
    dispatch(setEditor(editor));
    let t = "";
    let b: Blob;
    const res = await Endpoints.getInstance().getFileBlob(fileURL);
    const reader = res.body?.getReader();
    if (reader == null) {
      // when reader is not available
      b = await res.blob();
      t = await res.text();
    } else {
      // get total length
      const contentLength = Number.parseInt(
        res.headers.get("Content-Length") || "0"
      );

      // read the data
      let receivedLength = 0; // received that many bytes at the moment
      const chunks = []; // array of received binary chunks (comprises the body)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        if (value) chunks.push(value);
        receivedLength += value?.length || 0;

        setLoaded((receivedLength / contentLength) * 100);
      }

      // concatenate chunks into single Uint8Array
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      // decode into a string and blob
      t = new TextDecoder("utf-8").decode(chunksAll);
      b = new Blob([chunksAll], { type: "text/plain" });
    }
    editor.setModel(
      monaco.editor.createModel(t, undefined, monaco.Uri.file(fileURL))
    );
    setLoaded(100);
    const saveAction: Monaco.editor.IActionDescriptor = {
      id: "save",
      label: "Save file",
      keybindings: [
        Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KEY_S, // Ctrl + Enter or Cmd + Enter
      ],
      contextMenuOrder: 0, // choose the order
      contextMenuGroupId: "operation", // create a new grouping
      run: () => {
        const val = editor.getValue();
        const uri = editor.getModel()?.uri;
        if (uri) {
          const name = uri.path.split("/").reverse()[0];
          const file = new File([new Blob([val], { type: b.type })], name, {
            type: b.type,
            lastModified: new Date().getTime(),
          });
          const req = Endpoints.getInstance().uploadFile(
            file,
            fileURL.replace(name, "")
          );
          // upload progress event
          req.upload.addEventListener("progress", function (e) {
            // upload progress as percentage
            const percent_completed = (e.loaded / e.total) * 100;
            console.log(percent_completed);
          });

          // req finished event
          req.addEventListener("load", function () {
            dispatch(
              addBubble("save-success", {
                type: "SUCCESS",
                title: `Successfully saved ${name}`,
              })
            );
          });

          req.addEventListener("error", function () {
            dispatch(
              addBubble(`upload-error-${file.name}`, {
                title: `Could not upload ${file.name}`,
                type: "ERROR",
              })
            );
          });
        }
      },
    };
    editor.addAction(saveAction);
    editor.getAction("editor.action.quickCommand").run();
  }

  function handleEditorWillMount(monaco: typeof Monaco) {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      colors: { "editor.background": "#282c34" },
      inherit: true,
      // rules: [{ token: "test", background: "282c34" }],
      rules: [],
    });
    monaco.editor.setTheme("custom-dark");
  }

  return (
    <Layout id={css.editorPage} mainClass={css.editorWrapper}>
      <Editor
        height="100%"
        defaultValue="Loading"
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        // onValidate={handleEditorValidation}
        theme="custom-dark"
        options={options}
      />
      <div
        className={`${css.loading} ${
          (loaded >= 100 && css.loadingHidden) || ""
        }`}
      >
        <FileIcon
          file={{ name, owner: "", size: 0, type: "FILE" }}
          className={css.fileIcon}
        ></FileIcon>
        <span>DOWNLOADING</span>
        <span>{name}</span>
        <div className={css.progress}>
          <div style={{ width: `${Math.floor(loaded)}%` }}>.</div>
        </div>
      </div>
    </Layout>
  );
};

// export const saveEditorFile = (
//   editor?: editor.IStandaloneCodeEditor,
// ): (() => void) => {
//   return () => {};
// };

export default EditorPage;
