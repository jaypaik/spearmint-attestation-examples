import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SignatureClaim", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const SignatureClaim = await ethers.getContractFactory("SignatureClaim");
    // Address of the signer generated on Spearmint.
    const signerAddress = "0x35bBb36285694CBa55Bf6b2A18ddE2A4471D13cf";
    const contract = await SignatureClaim.deploy(signerAddress);
    return { contract, owner };
  }

  describe("Claim", function () {
    // Response from Attestation API's signature endpoint for address:
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.
    const response = {
      data: {
        signature:
          "0xade81d5e5162c22039bd003c76ce41e83335a0317f98f148e5e38c4cd5cbcc36551fe8c052b21591476eddbda162b99c462e416c740e64adf1cd021bc30e12c21b",
        attestationData: null,
      },
    };

    it("Should claim expected quantity", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);
      const quantity = await contract.CLAIMABLE_QUANTITY();
      await contract.claim(response.data.signature);
      expect(await contract.balanceOf(owner.address)).to.equal(quantity);
    });

    it("Should revert if signature is invalid", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      await expect(
        contract.claim(response.data.signature.replace("a", "b"))
      ).to.be.revertedWithCustomError(contract, "InvalidAttestation");
    });
  });
});
