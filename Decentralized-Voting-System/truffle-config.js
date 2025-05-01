module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache port
      network_id: "*",    // MATCH GANACHE NETWORK ID (not 1337)
    }
  },
  compilers: {
    solc: {
      version: "0.8.20",     // Solidity compiler version
    }
  }
};
