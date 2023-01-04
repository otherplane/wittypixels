const fs = require("fs")
const witmonAddresses = require("./witmon.addresses.json")
const witnetAddresses = require("witnet-solidity-bridge/migrations/witnet.addresses")
const WitmonERC721 = artifacts.require("WitmonERC721");
const WitmonLiscon21 = artifacts.require("WitmonLiscon21");
const WitnetRequestBoard = artifacts.require("WitnetRequestBoard")
module.exports = async function (deployer, network, accounts) {  
  network = network.split("-")[0]
  if (network !== "test" && network !== "develop") {
    if (!witmonAddresses[network]) {
      witmonAddresses[network] = {}
    }
    if (!witmonAddresses[network].WitmonERC721) {
      witmonAddresses[network].WitmonERC721 = ""
    }
    WitnetRequestBoard.address = witnetAddresses.default[network].WitnetRequestBoard
    console.info("   > Using WitnetRequestBoard at", WitnetRequestBoard.address)
  } else {
    const WitnetRequestBoardMock = artifacts.require("WitnetRequestBoardMock")
    if (!WitnetRequestBoardMock.isDeployed()) {
      await deployer.deploy(WitnetRequestBoardMock)
    }
    WitnetRequestBoard.address = WitnetRequestBoardMock.address;
    console.info("   > Using WitnetRequestBoardMock at", WitnetRequestBoard.address)
  }
  if (network === "test" || network === "develop" || witmonAddresses[network].WitmonERC721 === "") {
    await deployer.deploy(
      WitmonERC721,
      WitnetRequestBoard.address,       // Witnet Bridge entry-point
      WitmonLiscon21.address,           // IWitmonDecorator implementation
      "Witty Creatures 2.0 - Liscon 2021 Special Edition", // ERC721 Token Name
      "WITTY2021",                      // ERC721 Token Symbol
      "0x8d86Bc475bEDCB08179c5e6a4d494EbD3b44Ea8B",  // signator
      [10, 30, 60],                     // percentile marks
      192000                            // expirationDays (~ 30 days)
    )
    if (network !== "test" && network !== "develop") {
      witmonAddresses[network].WitmonERC721 = WitmonERC721.address
      fs.writeFileSync("./migrations/witmon.addresses.json", JSON.stringify(witmonAddresses, null, 4), { flag: 'w+' })
    }
    console.info("   >> Deployed at", WitmonERC721.address)
  } else {
    WitmonERC721.address = witmonAddresses[network].WitmonERC721
    console.info("   > Skipped: presumably deployed at", WitmonERC721.address)
  }  
};
