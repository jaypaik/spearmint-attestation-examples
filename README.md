# Spearmint attestation examples

This repo includes [some contract examples](/contracts/) that demonstrate how to consume
Spearmint attestations.

Both types of attestations (signature and Merkle proof) are covered, each with two variations: one with attestation data and one without.

A demonstration of how to integrate your frontend can be found in the [tests](/test/).

You'll find some [helper contracts](/contracts/attestable/) here that can serve as a reference for your contracts. THESE CONTRACTS ARE NOT AUDITED SO USE AT YOUR OWN RISK.

To run the tests:

```sh
yarn
npx hardhat test
```
