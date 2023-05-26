import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MerkleProofClaimWithAttestationData", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const MerkleProofClaimWithAttestationData = await ethers.getContractFactory(
      "MerkleProofClaimWithAttestationData"
    );
    // Root hash of the Merkle tree generated on Spearmint.
    const rootHash =
      "0x908b90789e087b11cb74b5f488881dbe0959e4ad876613d78d8e3321adc131d9";
    const contract = await MerkleProofClaimWithAttestationData.deploy(rootHash);
    return { contract, owner };
  }

  describe("Claim", function () {
    // Response from Attestation API's proof endpoint for address:
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.
    const response = {
      data: {
        proof: [
          "0x2ad371926687b523a8b6ba78e14cf2edeb2319143704ba57f05ff165bf574f5f",
          "0x486690061d3c270e5b1fb9fa749996b42309386c6d2d9796abac6db9b5f74582",
          "0x249c4aff640ce4f9e5814cc6d3eb33f884292702b24809bdb36ae5da2a792f1d",
          "0x00d7caf173133b60e6e6608a24ad71fa90b4d51288fcd3237561bcf4a37b4f5c",
        ],
        attestationData: {
          validAt: "1625097600",
          quantity: "100",
        },
      },
    };

    it("Should claim expected quantity", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);
      await contract.claim(response.data.attestationData, response.data.proof);
      expect(await contract.balanceOf(owner.address)).to.equal(
        response.data.attestationData.quantity
      );
    });

    it("Should revert if proof is invalid", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      await expect(
        contract.claim(
          response.data.attestationData,
          response.data.proof.slice(1)
        )
      ).to.be.revertedWithCustomError(contract, "InvalidAttestation");
    });

    it("Should revert if attestation data is invalid", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      await expect(
        contract.claim(
          {
            ...response.data.attestationData,
            quantity: "10000000",
          },
          response.data.proof
        )
      ).to.be.revertedWithCustomError(contract, "InvalidAttestation");
    });
  });
});
