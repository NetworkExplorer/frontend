import { convertFiles, Endpoints } from "@lib";
import { FilesActionTypes, FilesThunk } from "./types";

export const getFolder: FilesThunk = (path: string) => async (
  dispatch
) => {
  try {
    const res = await Endpoints.getInstance().getFolder(path);
    res.files = convertFiles(res.files);

    return dispatch({
      type: FilesActionTypes.LOAD_FOLDER,
      payload: res
    })
  } catch (e) {
    console.error(e);
    return dispatch({
      type: FilesActionTypes.SET_ERROR,
      payload: "could not fetch files"
    })
  }
}

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
