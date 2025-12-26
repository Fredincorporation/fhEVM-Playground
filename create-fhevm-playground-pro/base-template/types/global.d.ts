declare const ethers: any;
declare const hre: any;
declare const network: any;
declare const expect: any;
declare function describe(name: string, fn: (...args: any[]) => any): any;
declare function it(name: string, fn: (...args: any[]) => any): any;

declare module 'hardhat' {
  const anything: any;
  export = anything;
}
