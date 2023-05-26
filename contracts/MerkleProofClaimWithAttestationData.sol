// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./attestable/MerkleProofAttestable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MerkleProofClaimWithAttestationData is ERC20, MerkleProofAttestable {
    struct AttestationData {
        uint256 validAt;
        uint256 quantity;
    }

    constructor(
        bytes32 rootHash
    ) ERC20("Spearmint", "SPEAR") MerkleProofAttestable(rootHash) {}

    function claim(
        AttestationData calldata data,
        bytes32[] calldata proof
    ) external onlyValidProof(_getHashedData(data), proof) {
        if (data.validAt > block.timestamp) {
            revert ClaimNotYetAvailable();
        }
        // TODO: Mark as claimed.
        _mint(msg.sender, data.quantity);
    }

    function _getHashedData(
        AttestationData calldata data
    ) private view returns (bytes32 hashedData) {
        hashedData = keccak256(abi.encode(msg.sender, data));
    }

    error ClaimNotYetAvailable();
}
