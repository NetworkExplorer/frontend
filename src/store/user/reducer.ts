import { UserStateI, UserActionTypes, UserActions } from "./types";

const Acts = UserActionTypes;

const initState: UserStateI = {

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
		default:
			return state;
	}
};

export default userReducer;
