const {
  TREASURY_ADDRESS,
  MARKETPLACE,
  BUNDLE_MARKETPLACE
} = require('./constants');

async function main() {
  const ArtTradable = await ethers.getContractFactory('GTONShopArtTradable');
  const nft = await ArtTradable.deploy(
    'GTONShopArt',
    'FART',
    '20000000000000000000',
    TREASURY_ADDRESS,
    MARKETPLACE,
    BUNDLE_MARKETPLACE
  );
  await nft.deployed();
  console.log('GTONShopArtTradable deployed to:', nft.address);

  const ArtTradablePrivate = await ethers.getContractFactory(
    'GTONShopArtTradablePrivate'
  );
  const nftPrivate = await ArtTradablePrivate.deploy(
    'GTONShopArt',
    'FART',
    '20000000000000000000',
    TREASURY_ADDRESS,
    MARKETPLACE,
    BUNDLE_MARKETPLACE
  );
  await nftPrivate.deployed();
  console.log('GTONShopArtTradablePrivate deployed to:', nftPrivate.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
