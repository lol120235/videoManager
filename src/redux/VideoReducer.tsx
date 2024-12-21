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
    case "UPDATE_EMBEDDINGS":
      return {
        ...state,
        videos: state.videos.map((video: any) =>
          video.name === action.payload.name
            ? {
                ...video,
                content: [
                  ...video.content.filter(
                    (c: any) => c.content !== action.payload.content
                  ),
                  {
                    content: action.payload.content,
                    embeddings: action.payload.embeddings,
                  },
                ].toSorted((a: any, b: any) =>
                  a.content.localeCompare(b.content)
                ),
              }
            : video
        ),
      };
    case "CLEAR_VIDEOS_WITH_NO_EMBEDDINGS":
      return {
        ...state,
        videos: state.videos.map((video: any) => ({
          ...video,
          content: video.content.filter((c: any) => c.embeddings !== null),
        })),
      };
    default:
      return state;
  }
};

export default VideoReducer;
