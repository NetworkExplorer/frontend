import { UserStateI, UserActionTypes, UserActions } from "./types";

const Acts = UserActionTypes;

const initState: UserStateI = {
	users: [],
	usersLoading: false
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
		default:
			return state;
	}
};

export default userReducer;
