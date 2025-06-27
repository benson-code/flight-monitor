const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// Address for (PoS) USDT on the Amoy Testnet
const USDT_TOKEN_ADDRESS_AMOY = "0x9eb60dc4bda4275032e1779741cff9ae2abee5e5";
// For Polygon Mainnet, the address is: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"

// Set the payment amount to 0.1 USDT.
// USDT on Polygon has 6 decimals, so we need to represent 0.1 as 100000.
const PAYMENT_AMOUNT = "100000"; // 0.1 * 10^6

module.exports = buildModule("FlightApiAccessModule", (m) => {
  // Get the constructor arguments for the contract
    const usdtTokenAddress = m.getParameter("_usdtTokenAddress", USDT_TOKEN_ADDRESS_AMOY);
  const paymentAmount = m.getParameter("_paymentAmount", PAYMENT_AMOUNT);

  // Deploy the FlightApiAccess contract
  const flightApiAccess = m.contract("FlightApiAccess", [usdtTokenAddress, paymentAmount]);

  // Log the deployed address for easy access
  m.call(flightApiAccess, "target", []).then((address) => {
      console.log(`FlightApiAccess deployed to: ${address}`)
  });

  return { flightApiAccess };
});
