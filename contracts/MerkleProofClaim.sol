// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./attestable/MerkleProofAttestable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MerkleProofClaim is ERC20, MerkleProofAttestable {
    uint256 public constant CLAIMABLE_AFTER = 1625097600; // 2021-07-01T00:00:00Z
    uint256 public constant CLAIMABLE_QUANTITY = 100;

    constructor(
        bytes32 rootHash
    ) ERC20("Spearmint", "SPEAR") MerkleProofAttestable(rootHash) {}

    function claim(
        bytes32[] calldata proof
    ) external onlyValidProof(_getHashedData(), proof) {
        if (CLAIMABLE_AFTER > block.timestamp) {
            revert ClaimNotYetAvailable();
        }
        // TODO: Mark as claimed.
        _mint(msg.sender, CLAIMABLE_QUANTITY);
    }

    function _getHashedData() private view returns (bytes32 hashedData) {
        hashedData = keccak256(abi.encode(msg.sender));
    }

    error ClaimNotYetAvailable();
}
