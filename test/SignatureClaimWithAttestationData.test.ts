import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SignatureClaimWithAttestationData", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const SignatureClaimWithAttestationData = await ethers.getContractFactory(
      "SignatureClaimWithAttestationData"
    );
    // Address of the signer generated on Spearmint.
    const signerAddress = "0x35bBb36285694CBa55Bf6b2A18ddE2A4471D13cf";
    const contract = await SignatureClaimWithAttestationData.deploy(
      signerAddress
    );
    return { contract, owner };
  }

  describe("Claim", function () {
    // Response from Attestation API's signature endpoint for address:
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.
    const response = {
      data: {
        signature:
          "0xffd285e4f9d4f3bbe306d551060b7a7825d13b56ead84e402fd8d68b44ce6cad3dbdc176040813c0d1b082e1b8ae7a99af3b1d660e2c58535e92de606a3c121d1c",
        attestationData: {
          validAt: "1625097600",
          quantity: "100",
        },
      },
    };

    it("Should claim expected quantity", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);
      await contract.claim(
        response.data.attestationData,
        response.data.signature
      );
      expect(await contract.balanceOf(owner.address)).to.equal(
        response.data.attestationData.quantity
      );
    });

    it("Should revert if signature is invalid", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      await expect(
        contract.claim(
          response.data.attestationData,
          response.data.signature.replace("a", "b")
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
          response.data.signature
        )
      ).to.be.revertedWithCustomError(contract, "InvalidAttestation");
    });
  });
});
