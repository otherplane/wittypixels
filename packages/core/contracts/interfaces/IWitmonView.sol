// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWitmonDecorator.sol";

/// @title Witty Creatures 2.0 Token viewing interface.
/// @author Otherplane Labs, 2021.
interface IWitmonView {
    function getCreatureData(uint256 _eggIndex) external view returns (Witmons.Creature memory);
    function getCreatureImage(uint256 _eggIndex) external view returns (string memory);
    function getCreatureStatus(uint256 _eggIndex) external view returns (Witmons.CreatureStatus);  
    function getDecorator() external view returns (IWitmonDecorator);
    function getParameters() external view returns (Witmons.Parameters memory);
    function getTokenEggIndex(uint256 _tokenId) external view returns (uint256);
    function totalSupply() external view returns (uint256 _totalSupply);
    function getStatus() external view returns (Witmons.Status);
}