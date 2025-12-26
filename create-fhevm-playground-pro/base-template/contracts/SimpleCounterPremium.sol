// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleCounterPremium {
    uint256 private count;

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
