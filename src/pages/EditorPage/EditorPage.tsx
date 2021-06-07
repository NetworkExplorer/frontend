import React, { useEffect } from "react";
import css from "./EditorPage.module.scss";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as Monaco from "monaco-editor";
import { Layout } from "@components";
import { options } from "./EditorOptions";
import { useAppDispatch } from "@store";
import { setEditorReady } from "@store/editor";
import { Endpoints, normalizeURL, ROUTES } from "@lib";
import { addBubble } from "@store/app";

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

  function handleEditorChange(
    value: string | undefined,
    event: editor.IModelContentChangedEvent
  ) {
    // here is the current value
  }

  async function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) {
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
    dispatch(setEditorReady(true));
    const b = await Endpoints.getInstance().getFileBlob(fileURL);
    const t = await b.text();
    // editor.setValue(t);
    // console.log("text", t);
    editor.setModel(
      monaco.editor.createModel(t, undefined, monaco.Uri.file(fileURL))
    );
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      const val = editor.getValue();
      const file = new File([new Blob([val], { type: b.type })], name, {
        type: b.type,
        lastModified: new Date().getTime(),
      });
      const req = Endpoints.getInstance().uploadFile(file, fileURL);
      // upload progress event
      req.upload.addEventListener("progress", function (e) {
        // upload progress as percentage
        const percent_completed = (e.loaded / e.total) * 100;
        console.log(percent_completed);
      });

      // req finished event
      req.addEventListener("load", function () {
        // HTTP status message (200, 404 etc)
        console.log(req.status);

        // req.response holds response from the server
        console.log(req.response);
        // getFolder(undefined, false);
      });

      req.addEventListener("error", function () {
        dispatch(
          addBubble(`upload-error-${file.name}`, {
            title: `Could not upload ${file.name}`,
            type: "ERROR",
          })
        );
      });
      console.log("SAVE pressed!");
    });
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      colors: { "editor.background": "#282c34" },
      inherit: true,
      // rules: [{ token: "test", background: "282c34" }],
      rules: [],
    });
    monaco.editor.setTheme("custom-dark");
  }

  function handleEditorWillMount(monaco: typeof Monaco) {
    console.log("beforeMount: the monaco instance:", monaco);
  }

  return (
    <Layout id={css.editorPage} mainClass={css.editorWrapper}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="Loading"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        // onValidate={handleEditorValidation}
        theme="custom-dark"
        options={options}
      />
    </Layout>
  );
};

export default EditorPage;
