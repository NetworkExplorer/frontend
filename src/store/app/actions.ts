import { BubbleI } from "@models";
import { AppActionTypes, AppAddBubble, AppRemoveBubble, AppSetSidebar, AppSetTerminal, SidebarActions, TerminalActions } from "./types";

export const setSidebar = (action: SidebarActions): AppSetSidebar => ({
  type: AppActionTypes.SET_SIDEBAR,
  payload: action
})

export const setTerminal = (action: TerminalActions): AppSetTerminal => ({
  type: AppActionTypes.SET_TERMINAL,
  payload: action
})

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

export const removeBubble = (key: string): AppRemoveBubble => {
  return {
    type: AppActionTypes.REMOVE_BUBBLE,
    payload: key,
  };
};

// export const GetPokemon = () => async (
//   dispatch: Dispatch<AppDispatchTypes>
// ) => {
//   try {
//     dispatch({
//       type: AppActionTypes.SET_LOADING,
//       payload: true,
//     });

//     // async stuff here
//   } catch (e) {
//     console.log('error')
//   }
// };
