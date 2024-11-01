const PredictionMarket = artifacts.require('PredictionMarket.sol');

const SIDE = {
    BIDEN: 0,
    TRUMP: 1
};
contract('PredictionMarket', addresses => {
    const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

    it('should work', async () => {
        const predictionMarket = await PredictionMarket.new(oracle);

        await predictionMarket.placeBet(
              SIDE.BIDEN,
              {from: gambler1, value: web3.utils.toWei('1')}
        );
        await predictionMarket.placeBet(
              SIDE.BIDEN,
              {from: gambler2, value: web3.utils.toWei('1')}
        );
        await predictionMarket.placeBet(
              SIDE.BIDEN,
              {from: gambler3, value: web3.utils.toWei('2')}
        );
        await predictionMarket.placeBet(
              SIDE.TRUMP,
              {from: gambler4, value: web3.utils.toWei('4')}
        );


        await predictionMarket.reportResult(
            SIDE.BIDEN,
            SIDE.TRUMP,
            {from: oracle}
        );

        const balancesBefore = (await Promise.all(
            [gambler1, gambler2, gambler3,gambler4].map(gambler =>(
                web3.eth.getBalance(gambler)
            ))
        ))
        .map(balance => web3.utils.toBN(balance));
        await Promise.all(
            [gambler1, gambler2, gambler3].map(gambler => (
                predictionMarket.withdrawGain({from: gambler})
            ))
        )
        const balancesAfter = (await Promise.all(
            [gambler1, gambler2, gambler3,gambler4].map(gambler =>(
                web3.eth.getBalance(gambler)
            ))
        ))
        .map(balance => web3.utils.toBN(balance));

        assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === '199'); // === because of gas fee
        assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === '199'); // === because of gas fee
        assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === '399'); // === because of gas fee
        assert(balancesAfter[3].sub(balancesBefore[3]).isZero()); // === because of gas fee

    });
}); 