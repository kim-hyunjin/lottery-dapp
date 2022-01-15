// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
    struct BetInfo {
        uint answerBlockNumber;
        address payable gambler;
        bytes challenges;
    }

    address public owner;

    uint constant internal BLOCK_LIMIT = 256;
    uint constant internal BET_BLOCK_INTERVAL = 3;
    uint constant internal BET_AMOUNT = 0.005 ether;

    mapping(uint => BetInfo) private _bets;
    uint private _tail;
    uint private _head;
    uint private _pot;

    event BET(uint index, address gambler, uint amount, bytes challenges, uint answerBlockNumber);

    constructor() {
        owner = msg.sender;
    }

    function getPot() public view returns(uint pot) {
        return _pot;
    }

    /**
     * @dev 베팅을 한다. 유저는 0.005 ETH를 보내야하고, 다음 세번째 블록의 해시값 앞 네 자리 예측 글자를 보낸다.
     * @param challenges 예측값
     * @return 함수가 잘 수행되었는지 확인 
     */
    function bet(bytes calldata challenges) public payable returns (bool) {
        require(msg.value == BET_AMOUNT, "Not enough ETH");

        require(pushBet(challenges), "Fail to ad new Bet Info");

        emit BET(_tail - 1, msg.sender, msg.value, challenges, block.number + BET_BLOCK_INTERVAL);

        return true;
    }

    function getBetInfo(uint index) public view returns (uint answerBlockNumber, address gambler, bytes memory challenges) {
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        gambler = b.gambler;
        challenges = b.challenges;
    }

    function pushBet(bytes memory challenges) internal returns (bool) {
        BetInfo memory b;
        b.gambler = payable(msg.sender);
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL;
        b.challenges = challenges;

        _bets[_tail] = b;
        _tail++;

        return true;
    }

    function popBet(uint index) internal returns (bool) {
        delete _bets[index];
        return true;
    }

    // Distribute
        // check the answer


}
