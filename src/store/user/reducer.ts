import { UserStateI, UserActionTypes, UserActions } from "./types";

const Acts = UserActionTypes;

const initState: UserStateI = {
	users: [],
	usersLoading: false,
	userPromptOpen: false
};

export const userReducer = (
	state: UserStateI = initState,
	action: UserActions
): UserStateI => {
	switch (action.type) {
		case Acts.SET_USER:
			return {
				...state,
				user: action.payload
			}
		case Acts.SIGNOUT: {
			const newState = { ...state };
			delete newState.user;
			return newState;
		}
		case Acts.SET_USERS_LOADING:
			return {
				...state,
				usersLoading: action.payload
			}
		case Acts.UPDATE_USERS:
			return {
				...state,
				users: action.payload
			}
		case Acts.SET_USER_PROMPT:
			return {
				...state,
				userPromptOpen: action.payload
			}
		case Acts.CREATE_USER:
			return {
				...state,
				users: [...state.users, action.payload]
			}
		case Acts.CHANGE_USER: {
			const i = state.users.findIndex((u) => u.username === action.payload.username);
			const newUsers = [...state.users];
			if (i !== -1) newUsers[i] = action.payload
			return {
				...state,
				users: newUsers
			}
		}
		default:
			return state;
	}
};

export default userReducer;
