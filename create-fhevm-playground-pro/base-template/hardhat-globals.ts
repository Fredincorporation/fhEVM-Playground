// This file is required by ts-node to inject hardhat globals into tests
import('hardhat').then((hre) => {
  Object.assign(global, {
    ethers: hre.ethers,
    expect: require('chai').expect,
  });
});
