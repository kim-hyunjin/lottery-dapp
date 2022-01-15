const Lottery = artifacts.require("Lottery");
const { shouldThrow, expectEvent } = require("./utils");

// user1, user2, ... 에 ganache의 accounts가 순서대로 들어옴
contract("Lottery", function ([deployer, user1, user2]) {
    let lottery;
    const betAmount = 5 * 10 ** 15;
    const betBlockInterval = 3;
    beforeEach(async () => {
        lottery = await Lottery.new();
    });

    it("getPot should return current pod", async () => {
        let pot = await lottery.getPot();
        assert.equal(pot, 0);
    });

    describe("Bet", function () {
        it("should fail when the bet money is not 0.005 ETH", async () => {
            await shouldThrow(lottery.bet("0xab", { from: user1, value: 1 }));
        });

        it("1 bet test", async () => {
            const challenges = "0xab";
            const receipt = await lottery.bet(challenges, { from: user1, value: betAmount });

            const pot = await lottery.getPot();
            assert.equal(pot, 0);

            const contractBalance = await web3.eth.getBalance(lottery.address);
            assert.equal(contractBalance, betAmount);

            const currentBlockNumber = await web3.eth.getBlockNumber();
            const bet = await lottery.getBetInfo(0);
            assert.equal(bet.answerBlockNumber, currentBlockNumber + betBlockInterval);
            assert.equal(bet.gambler, user1);
            assert.equal(bet.challenges, challenges);

            await expectEvent(receipt.logs, "BET");
        });
    });
});
