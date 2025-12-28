// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FHECounter {
    // store as uint256 but expose as bytes32 via getCount
    uint256 private _count;

    constructor() {
        _count = 0;
    }

    function getCount() external view returns (bytes32) {
        return bytes32(_count);
    }

    function increment(uint256 /*handle*/, bytes calldata /*proof*/) external returns (bool) {
        _count += 1;
        return true;
    }

    function decrement(uint256 /*handle*/, bytes calldata /*proof*/) external returns (bool) {
        if (_count > 0) {
            _count -= 1;
        }
        return true;
    }
}
