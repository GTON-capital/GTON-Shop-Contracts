const {
  GTON_SHOP_ADDRESS_REGISTRY,
  WRAPPED_GCD_MAINNET,
  WRAPPED_GCD_TESTNET
} = require('./constants');

async function main() {
  const Contract = await ethers.getContractFactory('GTONShopPriceFeed');
  const contract = await Contract.deploy(
    GTON_SHOP_ADDRESS_REGISTRY,
    WRAPPED_GCD_MAINNET
  );

  await contract.deployed();

  console.log('GTONShopPriceFeed deployed to', contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
