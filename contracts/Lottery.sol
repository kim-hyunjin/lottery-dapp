// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
  address public owner;

  constructor() {
      owner = msg.sender;
  }

  function getSomeValue() public pure returns (uint value) {
      return 123;
  }


}
