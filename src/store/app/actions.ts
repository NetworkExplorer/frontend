import { AppActionTypes, AppLoading, AppSetSidebar, SidebarActions } from "./types";

export const setLoading = (loading: boolean): AppLoading => ({
  type: AppActionTypes.SET_LOADING,
  payload: loading,
});

export const setSidebar = (action: SidebarActions): AppSetSidebar => ({
  type: AppActionTypes.SET_SIDEBAR,
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
