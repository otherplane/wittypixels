module.exports = {
  "extends": ["../../.eslintrc.cjs"],
  "env": {
    "browser": false,
    "node": true,
    "jest": true,
    "mocha": true
  },
  "globals" : {
    "artifacts": false,
    "contract": false,
    "assert": false,
    "web3": false
  },
}
