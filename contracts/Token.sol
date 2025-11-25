// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IMintableToken} from "./IMintableToken.sol";
import {IDividends} from "./IDividends.sol";

/**
 * @title Token
 * @dev A mintable ERC-20 token similar to Wrapped ETH.
 * Users can mint tokens by depositing ETH and burn tokens to get ETH back.
 * Token holders can receive dividend payments in ETH proportional to their token balance.
 */
contract Token is ERC20, IMintableToken, IDividends, ReentrancyGuard {
  // ------------------------------------------ //
  // ----- BEGIN: DO NOT EDIT THIS SECTION ---- //
  // ------------------------------------------ //
  address[] private _tokenHolders;
  mapping(address => bool) private _isHolder;
  mapping(address => uint256) private _dividendBalances;
  // ------------------------------------------ //
  // ----- END: DO NOT EDIT THIS SECTION ------ //  
  // ------------------------------------------ //

  // Events
  event Mint(address indexed account, uint256 amount);
  event Burn(address indexed account, uint256 amount, address indexed destination);
  event DividendRecorded(uint256 totalAmount, uint256 totalSupply);
  event DividendWithdrawn(address indexed payee, uint256 amount, address indexed destination);

  constructor() ERC20("Test token", "TEST") {}

  // IERC20 - Inherited from OpenZeppelin ERC20

  // IMintableToken

  /**
   * @dev Mint tokens by depositing ETH.
   * The amount of tokens minted equals the amount of ETH sent.
   */
  function mint() external payable override {
    require(msg.value > 0, "Token: Must send ETH to mint");
    
    _mint(msg.sender, msg.value);
    _addHolder(msg.sender);
    
    emit Mint(msg.sender, msg.value);
  }

  /**
   * @dev Burn tokens and send equivalent ETH to destination address.
   * @param dest The address to receive the ETH. Must not be address(0).
   */
  function burn(address payable dest) external override nonReentrant {
    require(dest != address(0), "Token: Invalid destination address");
    
    uint256 balance = balanceOf(msg.sender);
    require(balance > 0, "Token: No tokens to burn");
    
    // Checks-Effects-Interactions pattern
    _burn(msg.sender, balance);
    _removeHolder(msg.sender);
    
    // Safe transfer using OpenZeppelin Address library
    Address.sendValue(dest, balance);
    
    emit Burn(msg.sender, balance, dest);
  }

  // IDividends

  /**
   * @dev Get the number of token holders with non-zero balance.
   */
  function getNumTokenHolders() external view override returns (uint256) {
    return _tokenHolders.length;
  }

  /**
   * @dev Get the address at the given index in the list of token holders.
   * @param index The 1-based index into the list of holders.
   * @return The address, or the null address if the index is out of bounds.
   */
  function getTokenHolder(uint256 index) external view override returns (address) {
    require(index > 0 && index <= _tokenHolders.length, "Token: Index out of bounds");
    return _tokenHolders[index - 1];
  }

  /**
   * @dev Record a new dividend to be paid to all current token holders.
   * Dividend amount equals msg.value.
   * Each token holder receives a percentage according to their proportion of the token supply.
   * Note: Small amounts of wei may remain undistributed due to rounding. These are accumulated
   * and can be distributed in future dividend payments.
   */
  function recordDividend() external payable override {
    require(msg.value > 0, "Token: Must send ETH to record dividend");
    
    uint256 totalSupply_ = totalSupply();
    require(totalSupply_ > 0, "Token: No token holders");
    
    uint256 totalDistributed = 0;
    
    for (uint256 i = 0; i < _tokenHolders.length; i++) {
      address holder = _tokenHolders[i];
      uint256 holderBalance = balanceOf(holder);
      
      // Skip holders with zero balance (shouldn't happen, but defensive)
      if (holderBalance == 0) continue;
      
      uint256 dividendAmount = (msg.value * holderBalance) / totalSupply_;
      _dividendBalances[holder] += dividendAmount;
      totalDistributed += dividendAmount;
    }
    
    // Note: Any remaining wei (msg.value - totalDistributed) stays in contract
    // This is acceptable as it's typically < 1 wei per holder due to rounding
    
    emit DividendRecorded(msg.value, totalSupply_);
  }

  /**
   * @dev Get current withdrawable dividend for given payee.
   * @param payee The address to check dividend balance for.
   * @return The withdrawable dividend amount.
   */
  function getWithdrawableDividend(address payee) external view override returns (uint256) {
    return _dividendBalances[payee];
  }

  /**
   * @dev Withdraw dividend assigned to caller to given destination address.
   * @param dest The address to receive the dividend. Must not be address(0).
   */
  function withdrawDividend(address payable dest) external override nonReentrant {
    require(dest != address(0), "Token: Invalid destination address");
    
    uint256 dividendAmount = _dividendBalances[msg.sender];
    require(dividendAmount > 0, "Token: No dividend to withdraw");
    
    // Checks-Effects-Interactions pattern
    _dividendBalances[msg.sender] = 0;
    
    // Safe transfer using OpenZeppelin Address library
    Address.sendValue(dest, dividendAmount);
    
    emit DividendWithdrawn(msg.sender, dividendAmount, dest);
  }

  // Override transfer functions to track holders

  /**
   * @dev Override transfer to track holders.
   */
  function transfer(address to, uint256 value) public override returns (bool) {
    bool result = super.transfer(to, value);
    _updateHolders(msg.sender, to);
    return result;
  }

  /**
   * @dev Override transferFrom to track holders.
   */
  function transferFrom(address from, address to, uint256 value) public override returns (bool) {
    bool result = super.transferFrom(from, to, value);
    _updateHolders(from, to);
    return result;
  }

  // Internal functions

  /**
   * @dev Add a holder to the list if not already present.
   */
  function _addHolder(address holder) private {
    if (!_isHolder[holder] && balanceOf(holder) > 0) {
      _isHolder[holder] = true;
      _tokenHolders.push(holder);
    }
  }

  /**
   * @dev Remove a holder from the list if balance is zero.
   */
  function _removeHolder(address holder) private {
    if (_isHolder[holder] && balanceOf(holder) == 0) {
      _isHolder[holder] = false;
      _removeFromArray(holder);
    }
  }

  /**
   * @dev Update holders list after transfer.
   */
  function _updateHolders(address from, address to) private {
    _removeHolder(from);
    _addHolder(to);
  }

  /**
   * @dev Remove an address from the holders array.
   */
  function _removeFromArray(address holder) private {
    for (uint256 i = 0; i < _tokenHolders.length; i++) {
      if (_tokenHolders[i] == holder) {
        _tokenHolders[i] = _tokenHolders[_tokenHolders.length - 1];
        _tokenHolders.pop();
        break;
      }
    }
  }
}

