import { BubbleI } from "@models";
import { AppActions, AppStateI, AppActionTypes } from "./types";

const Acts = AppActionTypes;

const initState: AppStateI = {
	appLoading: false,
	sidebarOpen: false,
	terminalOpen: false,
	bubbles: new Map(),
	prompt: undefined,
	search: {
		searchText: "",
		shouldFocus: false,
		searching: false,
		searchingAll: false,
	},
	suggestions: []
};

export const appReducer = (
	state: AppStateI = initState,
	action: AppActions
): AppStateI => {
	switch (action.type) {
		case Acts.SET_LOADING:
			return {
				...state,
				appLoading: action.payload
			}
		case Acts.SET_SIDEBAR: {
			let sidebar = state.sidebarOpen;
			if (action.payload === "TOGGLE") sidebar = !sidebar;
			return {
				...state,
				sidebarOpen: sidebar,
			};
		}
		case Acts.SET_TERMINAL: {
			let terminal = state.terminalOpen;
			if (action.payload === "TOGGLE") terminal = !terminal;
			return {
				...state,
				terminalOpen: terminal,
			};
		}
		case AppActionTypes.ADD_BUBBLE: {
			if (state.bubbles.get(action.payload.key)) {
				console.error(
					`bubble with "${action.payload.key}" already exists, so it was not created`
				);
			}
			const nMap = new Map<string, BubbleI>(state.bubbles);
			nMap.set(action.payload.key, action.payload.bubble);
			return {
				...state,
				bubbles: nMap,
			};
		}
		case AppActionTypes.REMOVE_BUBBLE: {
			const copy = new Map<string, BubbleI>(state.bubbles);
			copy.delete(action.payload);
			return { ...state, bubbles: copy };
			// return state;
		}
		case AppActionTypes.SET_PROMPT:
			return {
				...state,
				prompt: action.payload,
			};
		case AppActionTypes.SET_SEARCH:
			return {
				...state,
				search: {
					...state.search,
					...action.payload,
				},
			};
		case AppActionTypes.FETCH_SUGGESTIONS:
			return {
				...state,
				suggestions: action.payload
			}
		default:
			return { ...state };
	}
};

export default appReducer;
