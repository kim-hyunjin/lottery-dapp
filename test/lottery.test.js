const Lottery = artifacts.require("Lottery");

// user1, user2, ... 에 ganache의 accounts가 순서대로 들어옴
contract("Lottery", function ([deployer, user1, user2]) {
    let lottery;
    beforeEach(async () => {
        lottery = await Lottery.new();
    });

    it("Basic test", async () => {
        let owner = await lottery.owner();
        let value = await lottery.getSomeValue();

        console.log(owner);
        console.log(value);
        assert.equal(value, 123);
    });
});
