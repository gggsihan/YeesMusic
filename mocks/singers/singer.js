module.exports = {
  "/artist/list": {
    "singer": {
      "name": 'jay'
    }
  },
  "/banner": [{
    "name": 'dddddd'
  }],
  "/personalized": (body) => {
    if (body.params) {
      return {
        "person|3": /\d{3}/
      }
    }
  }
}