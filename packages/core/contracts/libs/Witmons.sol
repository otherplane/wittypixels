// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "witnet-solidity-bridge/contracts/interfaces/IWitnetRequest.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Witmons Library: data model and helper functions
/// @author Otherplane Labs, 2021.
library Witmons {

    struct State {
        Parameters params;
        address decorator;
        IWitnetRequest witnetRNG;
        uint256 witnetQueryId;
        bytes32 witnetRandomness;
        uint256 hatchingBlock;        
        Counters.Counter totalSupply;
        mapping (/* eggIndex => Creature */ uint256 => Creature) creatures;
        mapping (/* tokenId  => eggIndex */ uint256 => uint256) eggIndex_;
    }

    struct Parameters {
        address signator;
        uint8[] percentileMarks;      
        uint256 expirationBlocks;
    }

    enum Status {
        Batching,
        Randomizing,
        Hatching,
        Freezed
    }

    struct Creature {
        uint256 tokenId;   
        uint256 eggBirth;
        uint256 eggIndex;
        uint256 eggScore;
        uint256 eggRanking;
        bytes32 eggPhenotype;
        CreatureCategory eggCategory;
    }

    enum CreatureCategory {
        Legendary,  // 0
        Rare,       // 1
        Common      // 2
    }

    enum CreatureStatus {
        Inexistent, // 0
        Incubating, // 1
        Hatching,   // 2
        Alive,      // 3
        Freezed     // 4
    }

    /// Calculate creature category.
    function creatureCategory(State storage _self, uint8 _percentile100)  
        internal view
        returns (CreatureCategory)
    {
        uint8 _i; uint8 _cumuled;
        for (; _i < _self.params.percentileMarks.length; _i ++) {
            _cumuled += _self.params.percentileMarks[_i];
            if (_percentile100 <= _cumuled) {
                break;
            }
        }
        return CreatureCategory(_i);
    }

    /// Gets tender's current status.
    function status(State storage self)
        internal view
        returns (Status)
    {
        if (self.witnetRandomness != bytes32(0)) {
            return (block.number > self.hatchingBlock + self.params.expirationBlocks)
                ? Status.Freezed
                : Status.Hatching;
        } else if (self.witnetQueryId > 0) {
            return Status.Randomizing;
        } else {
            return Status.Batching;
        }
    }

    /// @dev Produces revert message when tender is not in expected status.
    function statusRevertMessage(Status _status)
        internal pure
        returns (string memory)
    {
        if (_status == Status.Freezed) {
            return "Witmons: not in Freezed status";
        } else if (_status == Status.Batching) {
            return "Witmons: not in Batching status";
        } else if (_status == Status.Randomizing) {
            return "Witmons: not in Randomizing status";
        } else if (_status == Status.Hatching) {
            return "Witmons: not in Hatching status";
        } else {
            return "Witmons: bad mood";
        }
    }

    /// Returns index of Most Significant Bit of given number, applying De Bruijn O(1) algorithm.
    function msbDeBruijn32(uint32 _v)
        internal pure
        returns (uint8)
    {
        uint8[32] memory _bitPosition = [
                0, 9, 1, 10, 13, 21, 2, 29, 11, 14, 16, 18, 22, 25, 3, 30,
                8, 12, 20, 28, 15, 17, 24, 7, 19, 27, 23, 6, 26, 5, 4, 31
            ];
        _v |= _v >> 1;
        _v |= _v >> 2;
        _v |= _v >> 4;
        _v |= _v >> 8;
        _v |= _v >> 16;
        return _bitPosition[
            uint32(_v * uint256(0x07c4acdd)) >> 27
        ];
    }

    /// Generates pseudo-random number uniformly distributed in range [0 .. _range).
    function randomUint8(bytes32 _seed, uint256 _index, uint8 _range)
        internal pure
        returns (uint8)
    {
        assert(_range > 0);
        uint8 _flagBits = uint8(255 - msbDeBruijn32(uint32(_range)));
        uint256 _number = uint256(keccak256(abi.encode(_seed, _index))) & uint256(2 ** _flagBits - 1);
        return uint8((_number * _range) >> _flagBits); 
    }

    /// Recovers address from hash and signature.
    function recoverAddr(bytes32 _hash, bytes memory _signature)
        internal pure
        returns (address)
    {
        if (_signature.length != 65) {
            return (address(0));
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return address(0);
        }
        if (v != 27 && v != 28) {
            return address(0);
        }
        return ecrecover(_hash, v, r, s);
    }    
}
