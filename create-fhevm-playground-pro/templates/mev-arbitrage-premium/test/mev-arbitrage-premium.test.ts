/* Bridge test for mocha/ts-node runner
	 - Initializes `sym` at runtime (after Hardhat/ethers is available)
	 - Requires the existing CommonJS test so the TS runner executes it
*/
import hardhat from 'hardhat';
const hre = require('hardhat');
const { ethers } = hre;

let sym: string;
before(function () {
	// compute the symbol bytes used by the CJS tests (safe at runtime)
	sym = ethers.id('PAIRA').slice(0, 66);
});

// require the CommonJS test so mocha (configured for .ts) runs it
require('./mev-arbitrage-premium.test.cjs');
