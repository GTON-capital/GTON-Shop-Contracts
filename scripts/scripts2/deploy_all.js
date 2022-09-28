// to deploy locally
// run: npx hardhat node on a terminal
// then run: npx hardhat run --network localhost scripts/12_deploy_all.js
async function main(network) {

    console.log('network: ', network.name);

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log(`Deployer's address: `, deployerAddress);
  
    const { TREASURY_ADDRESS, PLATFORM_FEE, WRAPPED_GCD_MAINNET, WRAPPED_GCD_TESTNET } = require('../constants');
  
    ////////////
    const GTONShopNFT = await ethers.getContractFactory('GTONShopNFT');
    const gtonShopNFT = await GTONShopNFT.deploy(TREASURY_ADDRESS, '2000000000000000000');
  
    await gtonShopNFT.deployed();  
    console.log('GTONShopNFT deployed at', gtonShopNFT.address);
    ///////////

    //////////
    const ProxyAdmin = await ethers.getContractFactory('ProxyAdmin');
    const proxyAdmin = await ProxyAdmin.deploy();
    await proxyAdmin.deployed();

    const PROXY_ADDRESS = proxyAdmin.address;

    console.log('ProxyAdmin deployed to:', proxyAdmin.address);

    const AdminUpgradeabilityProxyFactory = await ethers.getContractFactory('AdminUpgradeabilityProxy');
    //////////

    /////////
    const Marketplace = await ethers.getContractFactory('GTONShopMarketplace');
    const marketplaceImpl = await Marketplace.deploy();
    await marketplaceImpl.deployed();

    console.log('GTONShopMarketplace deployed to:', marketplaceImpl.address);
    
    const marketplaceProxy = await AdminUpgradeabilityProxyFactory.deploy(
        marketplaceImpl.address,
        PROXY_ADDRESS,
        []
    );
    await marketplaceProxy.deployed();
    console.log('Marketplace Proxy deployed at ', marketplaceProxy.address);
    const MARKETPLACE_PROXY_ADDRESS = marketplaceProxy.address;
    const marketplace = await ethers.getContractAt('GTONShopMarketplace', marketplaceProxy.address);
    
    await marketplace.initialize(TREASURY_ADDRESS, PLATFORM_FEE);
    console.log('Marketplace Proxy initialized');
    
    /////////

    /////////
    const BundleMarketplace = await ethers.getContractFactory(
        'GTONShopBundleMarketplace'
      );
    const bundleMarketplaceImpl = await BundleMarketplace.deploy();
    await bundleMarketplaceImpl.deployed();
    console.log('GTONShopBundleMarketplace deployed to:', bundleMarketplaceImpl.address);
    
    const bundleMarketplaceProxy = await AdminUpgradeabilityProxyFactory.deploy(
        bundleMarketplaceImpl.address,
        PROXY_ADDRESS,
        []
      );
    await bundleMarketplaceProxy.deployed();
    console.log('Bundle Marketplace Proxy deployed at ', bundleMarketplaceProxy.address);  
    const BUNDLE_MARKETPLACE_PROXY_ADDRESS = bundleMarketplaceProxy.address;
    const bundleMarketplace = await ethers.getContractAt('GTONShopBundleMarketplace', bundleMarketplaceProxy.address);
    
    await bundleMarketplace.initialize(TREASURY_ADDRESS, PLATFORM_FEE);
    console.log('Bundle Marketplace Proxy initialized');
    
    ////////

    ////////
    const Auction = await ethers.getContractFactory('GTONShopAuction');
    const auctionImpl = await Auction.deploy();
    await auctionImpl.deployed();
    console.log('GTONShopAuction deployed to:', auctionImpl.address);

    const auctionProxy = await AdminUpgradeabilityProxyFactory.deploy(
        auctionImpl.address,
        PROXY_ADDRESS,
        []
      );

    await auctionProxy.deployed();
    console.log('Auction Proxy deployed at ', auctionProxy.address);
    const AUCTION_PROXY_ADDRESS = auctionProxy.address;
    const auction = await ethers.getContractAt('GTONShopAuction', auctionProxy.address);
    
    await auction.initialize(TREASURY_ADDRESS);
    console.log('Auction Proxy initialized');
   
    ////////

    ////////
    const Factory = await ethers.getContractFactory('GTONShopNFTFactory');
    const factory = await Factory.deploy(
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '10000000000000000000',
        TREASURY_ADDRESS,
        '50000000000000000000'
    );
    await factory.deployed();
    console.log('GTONShopNFTFactory deployed to:', factory.address);

    const PrivateFactory = await ethers.getContractFactory(
        'GTONShopNFTFactoryPrivate'
    );
    const privateFactory = await PrivateFactory.deploy(
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '10000000000000000000',
        TREASURY_ADDRESS,
        '50000000000000000000'
    );
    await privateFactory.deployed();
    console.log('GTONShopNFTFactoryPrivate deployed to:', privateFactory.address);
    ////////    

    ////////
    const NFTTradable = await ethers.getContractFactory('GTONShopNFTTradable');
    const nft = await NFTTradable.deploy(
        'GTONShopNFT',
        'GShop',
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '10000000000000000000',
        TREASURY_ADDRESS
    );
    await nft.deployed();
    console.log('GTONShopNFTTradable deployed to:', nft.address);

    const NFTTradablePrivate = await ethers.getContractFactory(
        'GTONShopNFTTradablePrivate'
    );
    const nftPrivate = await NFTTradablePrivate.deploy(
        'IGTONShopNFT',
        'IGShop',
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '10000000000000000000',
        TREASURY_ADDRESS
    );
    await nftPrivate.deployed();
    console.log('GTONShopNFTTradablePrivate deployed to:', nftPrivate.address);
    ////////

    ////////
    const TokenRegistry = await ethers.getContractFactory('GTONShopTokenRegistry');
    const tokenRegistry = await TokenRegistry.deploy();

    await tokenRegistry.deployed();

    console.log('GTONShopTokenRegistry deployed to', tokenRegistry.address);
    ////////

    ////////
    const AddressRegistry = await ethers.getContractFactory('GTONShopAddressRegistry');
    const addressRegistry = await AddressRegistry.deploy();

    await addressRegistry.deployed();

    console.log('GTONShopAddressRegistry deployed to', addressRegistry.address);
    const GTON_SHOP_ADDRESS_REGISTRY = addressRegistry.address;
    ////////

    ////////
    const PriceFeed = await ethers.getContractFactory('GTONShopPriceFeed');
    const WRAPPED_GCD = network.name === 'gtonMainnet' ? WRAPPED_GCD_MAINNET : WRAPPED_GCD_TESTNET;
    const priceFeed = await PriceFeed.deploy(
      GTON_SHOP_ADDRESS_REGISTRY,
      WRAPPED_GCD
    );
  
    await priceFeed.deployed();
  
    console.log('GTONShopPriceFeed deployed to', priceFeed.address);
    ////////

    ////////
    const ArtTradable = await ethers.getContractFactory('GTONShopArtTradable');
    const artTradable = await ArtTradable.deploy(
        'GTONShopArt',
        'FART',
        '20000000000000000000',
        TREASURY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS
    );
    await artTradable.deployed();
    console.log('GTONShopArtTradable deployed to:', artTradable.address);

    const ArtTradablePrivate = await ethers.getContractFactory(
        'GTONShopArtTradablePrivate'
    );
    const artTradablePrivate = await ArtTradablePrivate.deploy(
        'GTONShopArt',
        'FART',
        '20000000000000000000',
        TREASURY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS
    );
    await artTradablePrivate.deployed();
    console.log('GTONShopArtTradablePrivate deployed to:', artTradablePrivate.address);
    ////////

    ////////
    const ArtFactory = await ethers.getContractFactory('GTONShopArtFactory');
    const artFactory = await ArtFactory.deploy(
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '20000000000000000000',
        TREASURY_ADDRESS,
        '10000000000000000000'
     );
    await artFactory.deployed();
    console.log('GTONShopArtFactory deployed to:', artFactory.address);

    const ArtFactoryPrivate = await ethers.getContractFactory(
        'GTONShopArtFactoryPrivate'
    );
    const artFactoryPrivate = await ArtFactoryPrivate.deploy(
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '20000000000000000000',
        TREASURY_ADDRESS,
        '10000000000000000000'
    );
    await artFactoryPrivate.deployed();
    console.log('GTONShopArtFactoryPrivate deployed to:', artFactoryPrivate.address);
    ////////
    
    await marketplace.updateAddressRegistry(GTON_SHOP_ADDRESS_REGISTRY);   
    await bundleMarketplace.updateAddressRegistry(GTON_SHOP_ADDRESS_REGISTRY);
    
    await auction.updateAddressRegistry(GTON_SHOP_ADDRESS_REGISTRY);
    
    await addressRegistry.updateGTONShopNFT(gtonShopNFT.address);
    await addressRegistry.updateAuction(auction.address);
    await addressRegistry.updateMarketplace(marketplace.address);
    await addressRegistry.updateBundleMarketplace(bundleMarketplace.address);
    await addressRegistry.updateNFTFactory(factory.address);
    await addressRegistry.updateTokenRegistry(tokenRegistry.address);
    await addressRegistry.updatePriceFeed(priceFeed.address);
    await addressRegistry.updateArtFactory(artFactory.address);   

    await tokenRegistry.add(WRAPPED_GCD);

  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main(network)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

