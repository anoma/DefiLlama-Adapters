const { sumTokens2 } = require('../helper/unwrapLPs')

// AnomaPay shields ERC-20s by locking them in a per-chain forwarder contract.
// Forwarder addresses and supported tokens come from the AnomaPay backend (/configuration/all).
const config = {
  ethereum: {
    forwarder: '0x775c81a47f2618a8594a7a7f4a3df2a300337559',
    xan: '0xcedbea37c8872c4171259cdfd5255cb8923cf8e7',
    tokens: [
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      '0xa3931d71877c0e7a3148cb7eb4463524fec27fbd', // sUSDS
      '0xbeef01735c132ada46aa9aa4c54623caa92a64cb', // steakUSDC
      '0xbeefff209270748ddd194831b3fa287a5386f5bc', // bbqUSDC
      '0xdd0f28e19c1780eb6396170735d45153d261490d', // gtUSDC
      '0xbeefb9f61cc44895d8aec381373555a64191a9c4', // vbshUSDC
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
    ],
  },
  base: {
    forwarder: '0xfaa9de773be11fc759a16f294d32bb2261bf818b',
    xan: '0xf1b53d35c8516151f4c1f6a99e35e45b9c759983',
    tokens: [
      '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC
      '0x4200000000000000000000000000000000000006', // WETH
      '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2', // USDT
      '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf', // cbBTC
    ],
  },
  arbitrum: {
    forwarder: '0xfaa9de773be11fc759a16f294d32bb2261bf818b',
    tokens: [
      '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT0
    ],
  },
  bsc: {
    forwarder: '0xde6a308ed57af26bff059e6c550bd4908ac1840e',
    xan: '0x7427bd9542e64d1ac207a540cfce194b7390a07f',
    tokens: [
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // WETH
      '0x55d398326f99059ff775485246999027b3197955', // USDT
      '0x23ae4fd8e7844cdbc97775496ebd0e8248656028', // XAUM
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // WBNB
      '0x205812cdbed920aff76c6580abd681a46d11efc7', // QQQB
      '0xbe9d156892e55e7154bcd3cb0fea677f9d3103e1', // SPCXB
      '0x7138b48df7d98d7e3cc221bfe7192d0a178182d8', // SPYB
      '0x80f3d493ebce97e343c53d29a137942416b4ffc0', // CRCLB
      '0xcdf2f3e0fa43c47a6662a91c9e4a7c5f69762699', // MUB
      '0x5b1910eaad6450e50f816082aa078c41f10c292f', // TSLAB
      '0x02fca66c1d1afb4e2a7884261eb00f63598a7436', // NVDAB
      '0x3ee4df61bd4f867e349beae8bfe07bc31b4850fb', // SNDKB
      '0xe87afb3076aeb0f9b14e368de8145ae6a2826a14', // MSTRB
      '0x46ceefda28dd7207059ed19b0acdc026955bb15c', // GMEB
      '0x431a3bee82e2ca41e49895cbece5bb0f76a89b7a', // AAPLB
      '0x4902c5ebc598265ed2212b559b042de8a5eeec3f', // BNCB
    ],
  },
  monad: {
    forwarder: '0x23dc44e1a1c3d5432eec8a1c027e22ccdc0a8f54',
    tokens: [
      '0x754704bc059f8c67012fed69bc8a327a5aafb603', // USDC
      '0xee8c0e9f1bffb4eb878d8f15f368a02a35481242', // WETH
      '0xe7cd86e13ac4309349f30b3435a9d337750fc82d', // USDT0
      '0x3bd359c1119da7da1d913d1c4d2b7c461115433a', // WMON
    ],
  },
  stable: {
    forwarder: '0x334e41aa1df8f521e3cc64b5fa19b666b8251cdc',
    tokens: [
      '0x779ded0c9e1022225f8e0630b35a9b54be713736', // USDT0
      '0x0000000000000000000000000000000000001003', // STABLE
    ],
  },
}

module.exports = {
  methodology: 'TVL is the balance of supported tokens held by the AnomaPay forwarder contract on each chain, which locks assets while they are shielded. XAN, the Anoma token, is reported separately as ownTokens. Some supported tokens are yield-bearing vault shares (Sky sUSDS, Morpho USDC vaults), priced at share value.',
}

Object.entries(config).forEach(([chain, { forwarder, tokens, xan }]) => {
  module.exports[chain] = {
    tvl: (api) => sumTokens2({ api, owner: forwarder, tokens }),
  }
  if (xan) module.exports[chain].ownTokens = (api) => sumTokens2({ api, owner: forwarder, tokens: [xan] })
})
