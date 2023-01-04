// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IWitmonDecorator.sol";

abstract contract WitmonDecoratorBase
    is
        IWitmonDecorator
{
    string public override baseURI;

    constructor(string memory _baseURI) {
        bytes memory _rawURI = bytes(_baseURI);
        require(
            _rawURI.length > 0,
            "WitmonDecoratorBase: empty URI"
        );
        require(
            _rawURI[_rawURI.length - 1] == "/",
            "WitmonDecoratorBase: no trailing slash"
        );
        baseURI = _baseURI;
    }

}
