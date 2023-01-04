// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "witnet-solidity-bridge/contracts/UsingWitnet.sol";
import "witnet-solidity-bridge/contracts/requests/WitnetRequest.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IWitmonAdmin.sol";
import "./interfaces/IWitmonEvents.sol";
import "./interfaces/IWitmonSurrogates.sol";
import "./interfaces/IWitmonView.sol";

/// @title Witty Creatures 2.0 - ERC721 Token contract
/// @author Otherplane Labs, 2021.
contract WitmonERC721
    is
        ERC721,
        Ownable,
        ReentrancyGuard,
        UsingWitnet,
        IWitmonAdmin,
        IWitmonEvents,
        IWitmonSurrogates,
        IWitmonView
{
    using Counters for Counters.Counter;
    using Strings for bytes32;
    using Strings for uint256;
    using Witmons for Witmons.State;

    Witmons.State internal _state;

    modifier inStatus(Witmons.Status _status) {
        require(
            _state.status() == _status,
            Witmons.statusRevertMessage(_status)
        );
        _;
    }

    modifier tokenExists(uint256 _tokenId) {
        require(
            _exists(_tokenId),
            "WitmonERC721: inexistent token"
        );
        _;
    }

    constructor(
            WitnetRequestBoard _witnet,
            IWitmonDecorator _decorator,
            string memory _name,
            string memory _symbol,
            address _signator,
            uint8[] memory _percentileMarks,
            uint256 _expirationBlocks
        )
        UsingWitnet(_witnet)
        ERC721(_name, _symbol)
    {
        setDecorator(_decorator);
        setParameters(
            _signator,
            _percentileMarks,
            _expirationBlocks
        );
        _state.witnetRNG = new WitnetRequest(hex"0a0f120508021a01801a0210022202100b10e807180a200a2833308094ebdc03");
    }

    // ========================================================================
    // --- 'ERC721Metadata' overriden functions -------------------------------

    
    function baseURI()
        public view
        virtual
        returns (string memory)
    {
        return IWitmonDecorator(_state.decorator).baseURI();
    }
    
    function metadata(uint256 _tokenId)
        external
        virtual view
        tokenExists(_tokenId)
        returns (string memory)
    {
        uint256 _eggIndex = _state.eggIndex_[_tokenId];
        Witmons.Creature memory _creature = _state.creatures[_eggIndex];
        assert(_tokenId == _creature.tokenId);
        return IWitmonDecorator(_state.decorator).getCreatureMetadata(_creature);
    }

    function tokenURI(uint256 _tokenId)
        public view
        virtual override
        tokenExists(_tokenId)
        returns (string memory)
    {
        return string(abi.encodePacked(
            baseURI(),
            _tokenId.toString()
        ));
    }

    // ========================================================================
    // --- Implementation of 'IWitmonAdmin' -----------------------------------

    /// Change token/creature decorator.
    /// @param _decorator Decorating logic contract producing a creature's metadata, and picture.
    function setDecorator(IWitmonDecorator _decorator)
        public
        virtual override
        onlyOwner
        // inState(Witmons.Status.Batching)
    {
        require(address(_decorator) != address(0), "WitmonERC721: no decorator");
        _state.decorator = address(_decorator);
        emit DecoratorSet(_decorator);
    }

    /// Change batch parameters. Only possible while in 'Batching' status.
    /// @param _signator Externally-owned account authorize to sign egg's info before minting.
    /// @param _percentileMarks Creature-category ordered percentile marks (Legendary first).
    /// @param _expirationBlocks Number of blocks after Witnet randomness is generated, 
    /// during which creatures may be minted.
    function setParameters(
            address _signator,
            uint8[] memory _percentileMarks,
            uint256 _expirationBlocks
        )
        public
        virtual override
        onlyOwner
        inStatus(Witmons.Status.Batching)
    {
        require(_signator != address(0), "WitmonERC721: no signator");
        require(_percentileMarks.length == uint8(Witmons.CreatureCategory.Common) + 1, "WitmonERC721: bad percentile marks");
        _state.params.percentileMarks = new uint8[](_percentileMarks.length);
        uint8 _checkSum; 
        for (uint8 _i = 0; _i < _percentileMarks.length; _i ++) {
            uint8 _mark = _percentileMarks[_i];
            _state.params.percentileMarks[_i] = _mark;
            _checkSum += _mark;
        }
        require(_checkSum == 100, "WitmonERC721: bad percentile checksum");
        
        _state.params.signator = _signator;
        _state.params.expirationBlocks = _expirationBlocks;
        
        emit BatchParameters(
            _signator,
            _percentileMarks,
            _expirationBlocks
        );
    }

    /// Stops batching, which means: (a) parameters cannot change anymore, and (b) a 
    /// random number will requested to the Witnet Decentralized Oracle Network.
    /// @dev While request is being attended, tender will remain in 'Randomizing' status.
    function stopBatching()
        external payable
        virtual override
        nonReentrant
        onlyOwner
        inStatus(Witmons.Status.Batching)
    {   
        // Send the request to Witnet and store the ID for later retrieval of the result:
        uint256 _witnetReward;
        (_state.witnetQueryId, _witnetReward) = _witnetPostRequest(_state.witnetRNG);

        // Transfers back unused funds:
        if (msg.value > _witnetReward) {
            payable(msg.sender).transfer(msg.value - _witnetReward);
        }
    }

    /// Starts hatching, which means that minting of creatures will start to be possible,
    /// until the hatching period expires (see `_state.expirationBlocks`).
    /// @dev During the hatching period the tender will remain in 'Hatching status'. Once the
    /// @dev hatching period expires, tender status will automatically change to 'Freezed'.
    function startHatching()
        external
        virtual override
        onlyOwner
        inStatus(Witmons.Status.Randomizing)
    {
        uint _queryId = _state.witnetQueryId;
        require(
            _witnetCheckResultAvailability(_queryId),
            "WitmonERC721: randomness not yet solved"
        );
        Witnet.Result memory _result = witnet.readResponseResult(_queryId);
        if (_result.success) {
            bytes32 _randomness = _bytesToBytes32(witnet.asBytes(_result));
            _state.hatchingBlock = block.number;
            _state.witnetRandomness = _randomness;
            emit WitnetResult(_randomness);
        } else {
            _state.witnetQueryId = 0;
            string memory _errorMessage;
            // Try to read the value as an error message, catch error bytes if read fails
            try witnet.asErrorMessage(_result)
                returns (Witnet.ErrorCodes, string memory e)
            {
                _errorMessage = e;
            }
            catch (bytes memory _errorBytes) {
                _errorMessage = string(_errorBytes);
            }
            emit WitnetError(_errorMessage);
        }
    }

    // ========================================================================
    // --- Implementation of 'IWitmonSurrogates' -------------------------------

    function mintCreature(
            address _eggOwner,
            uint256 _eggIndex,            
            uint256 _eggRanking,
            uint256 _eggScore,
            uint256 _totalClaimedEggs,
            bytes calldata _signature
        )
        external
        virtual override
        nonReentrant
        inStatus(Witmons.Status.Hatching)
    {
        _verifySignatorSignature(
            _eggOwner,
            _eggIndex,
            _eggRanking,
            _eggScore,
            _totalClaimedEggs,
            _signature
        );

        // Verify not already minted:
        require(
            _state.creatures[_eggIndex].tokenId == 0,
            "WitmonERC721: already minted"
        );

        // Increment token supply:
        _state.totalSupply.increment();
        uint256 _tokenId = _state.totalSupply.current();

        // Fulfill creature data:
        Witmons.Creature memory _creature = _mintCreature(
            _tokenId,
            block.timestamp, // solhint-disable not-rely-on-time
            _eggIndex,
            _eggRanking,
            _eggScore,
            _totalClaimedEggs,
            _signature
        );

        // Write to storage:
        _state.creatures[_eggIndex] = _creature;		
        _state.eggIndex_[_tokenId] = _eggIndex;

        // Mint the token:
        _safeMint(_eggOwner, _tokenId);
        emit NewCreature(_eggIndex, _tokenId);
    }

    function previewCreatureImage(
            address _eggOwner,
            uint256 _eggIndex,
            uint256 _eggRanking,
            uint256 _eggScore,
            uint256 _totalClaimedEggs,
            bytes calldata _signature
        )
        external view
        virtual override
        inStatus(Witmons.Status.Hatching)
        returns (string memory)
    {
        _verifySignatorSignature(
            _eggOwner,
            _eggIndex,
            _eggRanking,
            _eggScore,
            _totalClaimedEggs,
            _signature
        );

        // Preview creature image:
        return IWitmonDecorator(_state.decorator).getCreatureImage(
            _mintCreature(
                0,
                0,
                _eggIndex,                
                _eggRanking,
                _eggScore,
                _totalClaimedEggs,
                _signature
            )
        );
    }

    // ========================================================================
    // --- Implementation of 'IWitmonView' ------------------------------------

    function getCreatureData(uint256 _eggIndex)
        public view
        override
        returns (Witmons.Creature memory)
    {
        return _state.creatures[_eggIndex];
    }

    function getCreatureImage(uint256 _eggIndex)
        public view
        override
        returns (string memory)
    {
        require(
            getCreatureStatus(_eggIndex) == Witmons.CreatureStatus.Alive,
            "WitmonERC721: not alive yet"
        );
        Witmons.Creature memory _creature = _state.creatures[_eggIndex];
        return IWitmonDecorator(_state.decorator).getCreatureImage(_creature);
    }

    function getCreatureStatus(uint256 _eggIndex)
        public view
        virtual override
        returns (Witmons.CreatureStatus)
    {
        Witmons.Creature storage _creature = _state.creatures[_eggIndex];
        if (_creature.eggPhenotype != bytes32(0)) {
            return Witmons.CreatureStatus.Alive;
        } else {
            Witmons.Status _tenderStatus = _state.status();
            if (_tenderStatus == Witmons.Status.Hatching) {
                return Witmons.CreatureStatus.Hatching;
            } else if (_tenderStatus == Witmons.Status.Freezed) {
                return Witmons.CreatureStatus.Freezed;
            } else {
                return Witmons.CreatureStatus.Incubating;
            }
        }
    }

    function getDecorator()
        external view
        override
        returns (IWitmonDecorator)
    {
        return IWitmonDecorator(_state.decorator);
    }

    function getParameters()
        external view
        override
        returns (Witmons.Parameters memory)
    {
        return _state.params;
    }

    function getTokenEggIndex(uint256 _tokenId)
        external view
        override
        returns (uint256)
    {
        return _state.eggIndex_[_tokenId];
    }

    function totalSupply()
        public view
        override
        returns (
            uint256 _totalSupply
        )
    {
        return (
            _state.totalSupply.current()
        );
    }

    function getStatus()
        public view
        override
        returns (Witmons.Status)
    {
        return _state.status();
    }

    // ------------------------------------------------------------------------
    // --- INTERNAL VIRTUAL METHODS -------------------------------------------
    // ------------------------------------------------------------------------

    function _mintCreature(
            uint256 _tokenId,
            uint256 _tokenInception,
            uint256 _eggIndex,
            uint256 _eggRanking,
            uint256 _eggScore,
            uint256 _totalClaimedEggs,
            bytes memory _signature
        )
        internal view
        virtual
        returns (Witmons.Creature memory)
    {
        uint8 _percentile100 = _eggRanking > _totalClaimedEggs
            ? 100 
            : uint8((_eggRanking * 100) / _totalClaimedEggs)
        ;
        return Witmons.Creature({
            tokenId: _tokenId,
            eggBirth: _tokenInception,
            eggCategory: _state.creatureCategory(_percentile100),
            eggIndex: _eggIndex,
            eggScore: _eggScore,
            eggRanking: _eggRanking,
            eggPhenotype: keccak256(abi.encodePacked(
                _signature,
                _state.witnetRandomness
            ))
        });
    }

    function _verifySignatorSignature(
            address _eggOwner,
            uint256 _eggIndex,
            uint256 _eggRanking,
            uint256 _eggScore,
            uint256 _totalClaimedEggs,
            bytes memory _signature
        )
        internal view
        virtual
    {
        // Verify signator:
        bytes32 _eggHash = keccak256(abi.encodePacked(
            _eggOwner,
            _eggIndex,
            _eggRanking,
            _eggScore,
            _totalClaimedEggs
        ));
        require(
            Witmons.recoverAddr(_eggHash, _signature) == _state.params.signator,
            "WitmonERC721: bad signature"
        );
    }
    
    // ------------------------------------------------------------------------
    // --- PRIVATE METHODS ----------------------------------------------------
    // ------------------------------------------------------------------------

    function _bytesToBytes32(bytes memory _bb)
        private pure
        returns (bytes32 _r)
    {
        uint _len = _bb.length > 32 ? 32 : _bb.length;
        for (uint _i = 0; _i < _len; _i ++) {
            _r |= bytes32(_bb[_i] & 0xff) >> (_i * 8);
        }
    }
}
