import { AppActionTypes, AppLoading, AppSetSidebar, AppSetTerminal, SidebarActions, TerminalActions } from "./types";

export const setLoading = (loading: boolean): AppLoading => ({
  type: AppActionTypes.SET_LOADING,
  payload: loading,
});

export const setSidebar = (action: SidebarActions): AppSetSidebar => ({
  type: AppActionTypes.SET_SIDEBAR,
  payload: action
})

export const setTerminal = (action: TerminalActions): AppSetTerminal => ({
  type: AppActionTypes.SET_TERMINAL,
  payload: action
})

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
