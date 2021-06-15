import { PromptProps } from "@components";
import { Endpoints } from "@lib";
import { BubbleI, SearchI } from "@models";
import {
	AppActionTypes,
	AppAddBubble,
	AppRemoveBubble,
	AppSetPrompt,
	AppSetSearch,
	AppSetSidebar,
	AppSetTerminal,
	SidebarActions,
	TerminalActions,
	AppThunk,
	AppFetchSuggestions,
	AppSetLoading,
	AppSetTransition,
	TransitionState
} from "./types";

export const setAppLoading = (loading: boolean): AppSetLoading => ({
	type: AppActionTypes.SET_LOADING,
	payload: loading
})

export const setSidebar = (action: SidebarActions): AppSetSidebar => ({
	type: AppActionTypes.SET_SIDEBAR,
	payload: action,
});

export const setTerminal = (action: TerminalActions): AppSetTerminal => ({
	type: AppActionTypes.SET_TERMINAL,
	payload: action,
});

export const addBubble = (key: string, bubble: BubbleI): AppAddBubble => {
	bubble.when = new Date();
	return {
		type: AppActionTypes.ADD_BUBBLE,
		payload: {
			key,
			bubble,
		},
	};
};

export const removeBubble = (key: string): AppRemoveBubble => ({
	type: AppActionTypes.REMOVE_BUBBLE,
	payload: key,
});

export const setPrompt = (prompt?: PromptProps): AppSetPrompt => ({
	type: AppActionTypes.SET_PROMPT,
	payload: prompt,
});

export const setSearch = (search: SearchI): AppSetSearch => ({
	type: AppActionTypes.SET_SEARCH,
	payload: search,
});

export const fetchSuggestions: AppThunk = (path: string, max = 5) => async (dispatch) => {
	try {
		const res = await Endpoints.getInstance().fetchSuggestions(path, max);
		dispatch({
			type: AppActionTypes.FETCH_SUGGESTIONS,
			payload: res.data,
		})
	} catch (e) {
		return dispatch(addBubble("suggestions-error", {
			title: "could not fetch suggestions",
			type: "ERROR"
		}))
	}
}

export const clearSuggestions = (): AppFetchSuggestions => ({
	type: AppActionTypes.FETCH_SUGGESTIONS,
	payload: [],
});

export const setTransition = (transition: TransitionState): AppSetTransition => ({
	type: AppActionTypes.SET_TRANSITION,
	payload: transition
})
