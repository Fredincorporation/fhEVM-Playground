import('hardhat').then(async (hh) => {
  const env = hh.default;
  console.log('ethers type:', typeof env.ethers);
  console.log('env keys:', Object.getOwnPropertyNames(env).slice(0, 15));
  if (env.ethers) {
    console.log('ethers.getSigners:', typeof env.ethers.getSigners);
  } else {
    console.log('ethers not found in env');
  }
}).catch(e => console.error(e.message));
