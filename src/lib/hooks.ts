import { useState } from "react";

/**
 * forcefully updates a functional component
 * @returns a hook function with no parameters
 */
export function useForceUpdate(): () => void {
	const [, setValue] = useState(0); // integer state
	return () => setValue((value) => value + 1); // update the state to force render
}
