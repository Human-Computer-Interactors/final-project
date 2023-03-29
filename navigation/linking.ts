const linking = {
  prefixes: ["https://human-computer-interactors.web.app", "https://human-computer-interactors.firebaseapp.com", "http://localhost:19006/"],
  config: {
    screens: {
      Home: {
        path: "/",
      },
      Mix: {
        path: "mixes/:mixId",
        parse: {
          mixId: (id) => parseInt(id),
        },
      },
      EditTrackSegment: {
        path: "mixes/:mixId/:trackIndex",
        parse: {
          mixId: (id) => parseInt(id),
          trackIndex: (index) => parseInt(index)
        }
      }
    }
  }
};

export default linking;