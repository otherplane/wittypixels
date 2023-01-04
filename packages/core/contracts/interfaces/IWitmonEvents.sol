// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWitmonDecorator.sol";

/// @title Witty Creatures 2.0 Token events.
/// @author Otherplane Labs, 2021.
interface IWitmonEvents {
    event BatchParameters(
        address signator,
        uint8[] percentileMarks,
        uint256 expirationBlocks
    );
    event DecoratorSet(IWitmonDecorator decorator);
    event WitnetResult(bytes32 randomness);
    event WitnetError(string reason);
    event NewCreature(uint256 eggIndex, uint256 tokenId);
}
