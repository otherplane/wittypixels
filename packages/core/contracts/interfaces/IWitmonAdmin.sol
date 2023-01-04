// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWitmonDecorator.sol";

/// @title Witty Creatures 2.0 Token only-owner interface.
/// @author Otherplane Labs, 2021.
interface IWitmonAdmin {
    /// Change token/creature decorator.
    /// @param _decorator Decorating logic contract producing a creature's metadata, and picture.
    function setDecorator(IWitmonDecorator _decorator) external;

    /// Change batch parameters. Only possible while in 'Batching' status.
    /// @param _signator Externally-owned account authorize to sign egg's info before minting.
    /// @param _percentileMarks Creature-category ordered percentile marks (Legendary first).
    /// @param _expirationBlocks Number of blocks after Witnet randomness is generated, 
    /// during which creatures may be minted.
    function setParameters(
        address _signator,
        uint8[] calldata _percentileMarks,
        uint256 _expirationBlocks
    ) external;

    /// Stops batching, which means: (a) parameters cannot change anymore, and (b) a 
    /// random number will requested to the Witnet Decentralized Oracle Network.
    /// @dev While request is being attended, tender will remain in 'Randomizing' status.
    function stopBatching() external payable;

    /// Starts hatching, which means that minting of creatures will start to be possible,
    /// until the hatching period expires (see `_hatchingExpirationBlocks`).
    /// @dev During the hatching period the tender will remain in 'Hatching status'. Once the
    /// @dev hatching period expires, tender status will automatically change to 'Freezed'.
    function startHatching() external;
}
