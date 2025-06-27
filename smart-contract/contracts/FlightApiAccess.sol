// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FlightApiAccess
 * @dev This contract manages access to a service by requiring a one-time USDT payment.
 * The payment is transferred directly to the contract owner.
 */
contract FlightApiAccess is Ownable {
    IERC20 public usdtToken;
    uint256 public paymentAmount; // Amount in USDT smallest unit (e.g., 6 decimals for USDT)

    // Mapping to track which users have paid for access.
    mapping(address => bool) public hasPaidForAccess;

    // Event emitted when a user successfully pays for access.
    event AccessPaymentReceived(address indexed user, uint256 amount);

    /**
     * @dev Sets the initial USDT token address and payment amount.
     * @param _usdtTokenAddress The address of the USDT contract on the chosen blockchain.
     * @param _paymentAmount The required payment amount in the token's smallest unit.
     */
    constructor(address _usdtTokenAddress, uint256 _paymentAmount) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtTokenAddress);
        paymentAmount = _paymentAmount; // e.g., 100000 for 0.1 USDT if USDT has 6 decimals
    }

    /**
     * @dev Allows a user to pay for access.
     * Requires the user to have approved the contract to spend their USDT first.
     */
    function payForAccess() external {
        require(!hasPaidForAccess[msg.sender], "FlightApiAccess: Access already paid for.");
        require(usdtToken.allowance(msg.sender, address(this)) >= paymentAmount, "FlightApiAccess: USDT allowance too low. Please approve the contract first.");

        // Transfer USDT from the user directly to the contract owner.
        bool success = usdtToken.transferFrom(msg.sender, owner(), paymentAmount);
        require(success, "FlightApiAccess: USDT transfer failed.");

        hasPaidForAccess[msg.sender] = true;
        emit AccessPaymentReceived(msg.sender, paymentAmount);
    }

    /**
     * @dev Public view function to check if a user has paid.
     * Can be called by the backend to verify access.
     * @param _user The address of the user to check.
     * @return bool True if the user has paid, false otherwise.
     */
    function checkAccess(address _user) external view returns (bool) {
        return hasPaidForAccess[_user];
    }

    /**
     * @dev Allows the owner to update the payment amount.
     * @param _newAmount The new payment amount.
     */
    function setPaymentAmount(uint256 _newAmount) external onlyOwner {
        paymentAmount = _newAmount;
    }

    /**
     * @dev Allows the owner to update the USDT token address.
     * @param _newUsdtTokenAddress The new USDT token contract address.
     */
    function setUsdtToken(address _newUsdtTokenAddress) external onlyOwner {
        usdtToken = IERC20(_newUsdtTokenAddress);
    }
}
