const initialState = {
  videos: [],
};

const VideoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "ADD_VIDEO":
      return {
        ...state,
        videos: [...state.videos, action.payload],
      };
    case "REMOVE_VIDEO":
      return {
        ...state,
        videos: state.videos.filter(
          (video: { name: string }) => video.name !== action.payload.name
        ),
      };
    case "UPDATE_VIDEO":
      return {
        ...state,
        videos: state.videos.map((video: any) =>
          video.name === action.payload.name
            ? { ...video, content: action.payload.content }
            : video
        ),
      };
    default:
      return state;
  }
};

export default VideoReducer;
