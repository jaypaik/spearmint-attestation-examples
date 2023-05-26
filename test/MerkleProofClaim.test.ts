import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MerkleProofClaim", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const MerkleProofClaim = await ethers.getContractFactory(
      "MerkleProofClaim"
    );
    // Root hash of the Merkle tree generated on Spearmint.
    const rootHash =
      "0xbccb63ee062bcc58e058e0deec84135ea9d931d2eeb6254411e7dd1fdf8b001e";
    const contract = await MerkleProofClaim.deploy(rootHash);
    return { contract, owner };
  }

  describe("Claim", function () {
    // Response from Attestation API's proof endpoint for address:
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.
    const response = {
      data: {
        proof: [
          "0xc167b0e3c82238f4f2d1a50a8b3a44f96311d77b148c30dc0ef863e1a060dcb6",
          "0xcd3092daf15688632ad7fd4589d65a5d3e256270f229e6927016cc9b5400910e",
          "0xe4b525a7ba6012d3e36fbbe7a01bf619b921726a1436af87ee2db787c540533d",
        ],
        attestationData: null,
      },
    };

    it("Should claim expected quantity", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);
      const quantity = await contract.CLAIMABLE_QUANTITY();
      await contract.claim(response.data.proof);
      expect(await contract.balanceOf(owner.address)).to.equal(quantity);
    });

    it("Should revert if proof is invalid", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      await expect(
        contract.claim(response.data.proof.slice(1))
      ).to.be.revertedWithCustomError(contract, "InvalidAttestation");
    });
  });
});
