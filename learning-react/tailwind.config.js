module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {
        backgroundColor:{
          'black-t-35': 'rgba(0, 0, 0, 0.35)',
        },
        width: {
          "18": "72px",
          "192": "calc(192px*4)",
          "192/7": "calc(192px*4/7)",
          "max--75": "calc(100vw - 75px)",
        },
        height: {
          "192": "calc(192px*4)",
          "max--48": "calc(100vh - 48px)",
          "120": "calc(120px*4)"
        },
        textColor: {
          "grid-gray-180-17": "rgba(180, 180, 180, 0.17)",
          "main-gray": "#8D8D8D",
          "green-apple": "#62C554",
          "orange-apple": "#F5C150",
        },
        backgroundColor: {
          "main-gray": "#404040",
          "green-apple": "#62C554",
        },
        borderColor: {
          "grid-gray-180-17": "rgba(180, 180, 180, 0.17)",
        },
      },
    },
    plugins: [],
  }