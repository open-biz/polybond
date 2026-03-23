// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PolyBondPool
 * @dev A vault where users deposit USDC and receive proportional pool shares.
 * An authorized AI Agent executes trades for Polymarket arbitrage.
 * When trades resolve profitably, the pool's USDC balance increases, making each share worth more.
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// Interface to receive Polymarket ERC1155 Conditional Tokens
interface IERC1155Receiver {
    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data) external returns (bytes4);
    function onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external returns (bytes4);
}

contract PolyBondPool is IERC1155Receiver {
    address public owner;
    address public aiAgent;
    address public usdcToken; 

    // Share-based accounting (like ERC4626)
    uint256 public totalShares;
    mapping(address => uint256) public shares;

    // Track how much USDC is currently deployed in active trades
    uint256 public activeTradeValue;

    event Deposited(address indexed user, uint256 usdcAmount, uint256 sharesMinted);
    event Withdrawn(address indexed user, uint256 usdcAmount, uint256 sharesBurned);
    event TradeExecuted(string marketId, bytes32 conditionId, uint256 assetId, uint256 usdcSpent);
    event TradeResolved(string marketId, uint256 usdcReturned, uint256 profit);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAgent() {
        require(msg.sender == aiAgent || msg.sender == owner, "Not authorized agent");
        _;
    }

    constructor(address _aiAgent, address _usdcToken) {
        owner = msg.sender;
        aiAgent = _aiAgent;
        usdcToken = _usdcToken;
    }

    /**
     * @dev Calculates the total estimated value of the pool (Idle USDC + Deployed USDC)
     */
    function totalPoolValue() public view returns (uint256) {
        return IERC20(usdcToken).balanceOf(address(this)) + activeTradeValue;
    }

    function deposit(uint256 usdcAmount) external {
        uint256 currentPoolValue = totalPoolValue();
        
        require(IERC20(usdcToken).transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        uint256 sharesToMint = 0;
        if (totalShares == 0 || currentPoolValue == 0) {
            sharesToMint = usdcAmount; // 1:1 initial ratio
        } else {
            sharesToMint = (usdcAmount * totalShares) / currentPoolValue;
        }

        shares[msg.sender] += sharesToMint;
        totalShares += sharesToMint;

        emit Deposited(msg.sender, usdcAmount, sharesToMint);
    }

    function withdraw(uint256 shareAmount) external {
        require(shares[msg.sender] >= shareAmount, "Insufficient shares");
        
        uint256 currentPoolValue = totalPoolValue();
        uint256 usdcToReturn = (shareAmount * currentPoolValue) / totalShares;

        require(IERC20(usdcToken).balanceOf(address(this)) >= usdcToReturn, "Not enough idle USDC in pool");

        shares[msg.sender] -= shareAmount;
        totalShares -= shareAmount;

        require(IERC20(usdcToken).transfer(msg.sender, usdcToReturn), "USDC transfer failed");

        emit Withdrawn(msg.sender, usdcToReturn, shareAmount);
    }

    /**
     * @dev AI executes a trade using target Polymarket details.
     */
    function executeArbitrage(
        string memory marketId, 
        bytes32 conditionId,
        uint256 assetId,
        uint256 amountToSpend,
        address ctfExchange
    ) external onlyAgent {
        require(IERC20(usdcToken).balanceOf(address(this)) >= amountToSpend, "Insufficient idle USDC");
        
        // In production: Appprove CTF Exchange and execute swap using Polymarket CTF contracts
        // IERC20(usdcToken).approve(ctfExchange, amountToSpend);
        // CTFExchange(ctfExchange).buyMarket(conditionId, assetId, amountToSpend);
        
        // Track the deployed capital
        activeTradeValue += amountToSpend;

        emit TradeExecuted(marketId, conditionId, assetId, amountToSpend);
    }

    /**
     * @dev AI reports the resolution and deposits the winnings back to the pool.
     */
    function resolveTrade(
        string memory marketId, 
        uint256 initialInvestment, 
        uint256 returnAmount
    ) external onlyAgent {
        require(activeTradeValue >= initialInvestment, "Invalid investment amount");
        
        // Decrease deployed capital tracker
        activeTradeValue -= initialInvestment;
        
        // The AI or CTF router would have sent the returnAmount (USDC) to this contract
        uint256 profit = 0;
        if (returnAmount > initialInvestment) {
            profit = returnAmount - initialInvestment;
        }

        emit TradeResolved(marketId, returnAmount, profit);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = IERC20(usdcToken).balanceOf(address(this));
        IERC20(usdcToken).transfer(owner, balance);
    }

    // Required to receive ERC1155 CTF Tokens from Polymarket
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}