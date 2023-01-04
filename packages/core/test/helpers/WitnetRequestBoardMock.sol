// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "witnet-solidity-bridge/contracts/libs/Witnet.sol";
import "witnet-solidity-bridge/contracts/libs/WitnetBuffer.sol";

contract WitnetRequestBoardMock {

    using WitnetBuffer for Witnet.Buffer;

    uint32 constant internal _UINT32_MAX = type(uint32).max;
    uint64 constant internal _UINT64_MAX = type(uint64).max;

    uint256 queryId;

    function estimateReward(uint256)
        public pure
        returns (uint256)
    {
        return 10 ** 10; // 10 gwei
    }

    function getQueryStatus(uint256 _queryId)
        public view
        returns (Witnet.QueryStatus)
    {
        return (_queryId <= queryId
            ? Witnet.QueryStatus.Reported
            : Witnet.QueryStatus.Unknown
        );
    }

    function postRequest(IWitnetRequest)
        public payable
        returns (uint256)
    {
        return ++ queryId;
    }

        function isOk(Witnet.Result memory _result)
        external pure
        returns (bool)
    {
        return _result.success;
    }

    function asBytes(Witnet.Result memory _result)
        external pure
        returns (bytes memory)
    {
        return _decodeBytes(_result.value);
    }

    function asErrorMessage(Witnet.Result memory)
        external pure
        returns (string memory)
    {
        return "WitnetRequestBoardMock: mocking error message";
    }

    function readResponseResult(uint256)
        external pure
        returns (Witnet.Result memory _result)
    {
        return Witnet.Result({
            success: true,
            value: Witnet.CBOR({
                buffer: Witnet.Buffer({
                    data: hex"58207eadcf3ba9a9a860b4421ee18caa6dca4738fef266aa7b3668a2ff97304cfcab",
                        // [88,32,126,173,207,73,169,169,168,96,180,66,30,225,140,170,109,202,71,56,254,242,102,170,123,54,104,162,255,151,48,76,252,171] 
                    cursor: 1
                }),
                initialByte: 88,
                majorType: 2,
                additionalInformation: 24,
                len: 0,
                tag: 18446744073709551615
            })           
        });
    }

    function _decodeBytes(Witnet.CBOR memory _cborValue)
        internal pure
        returns (bytes memory)
    {
        _cborValue.len = _readBufferLength(_cborValue.buffer, _cborValue.additionalInformation);
        assert(_cborValue.buffer.data.length == 34);
        assert(_cborValue.buffer.cursor == 2);
        // TODO: assert(_cborValue.len == 32);
        return _cborValue.buffer.read(uint32(_cborValue.len));
    }

    function _readBufferLength(Witnet.Buffer memory _buffer, uint8 _additionalInformation)
        private pure
        returns(uint64)
    {
        if (_additionalInformation < 24) {
            return _additionalInformation;
        }
        if (_additionalInformation == 24) {
            return _buffer.readUint8();
        } else {
            revert("WitnetRequestBoardMock: not supported");
        }
    }
}
