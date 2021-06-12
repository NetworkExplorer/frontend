import React, { useState } from "react";
import settings from "../Settings.module.scss";
import css from "./ChangePassword.module.scss";

export function ChangePassword(): JSX.Element {
  const [prevPassword, setPrevPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(password);
  };
  const canChange =
    prevPassword && password && passwordAgain && password === passwordAgain;
  return (
    <div className={`${settings.settingsMenu} ${css.changePassword}`}>
      <h1>Change your password</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="prevPassword">
          Previous Password
          <input
            type="password"
            name="prevPassword"
            id="prevPassword"
            value={prevPassword}
            placeholder="********"
            onChange={(e) => setPrevPassword(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          New Password
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label htmlFor="passwordAgain">
          Enter your password again
          <input
            type="password"
            name="passwordAgain"
            id="passwordAgain"
            value={passwordAgain}
            placeholder="********"
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
        </label>
        <input type="submit" value="Change password" disabled={!canChange} />
      </form>
    </div>
  );
}

export default ChangePassword;
