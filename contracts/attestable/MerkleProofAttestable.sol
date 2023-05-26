// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IAttestable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleProofAttestable is IAttestable {
    using MerkleProof for bytes32[];

    bytes32 private _root;

    event RootUpdated(bytes32 indexed root);

    modifier onlyValidProof(bytes32 hashedData, bytes32[] calldata proof) {
        _validateProof(hashedData, proof);
        _;
    }

    constructor(bytes32 rootHash) {
        _setRoot(rootHash);
    }

    function root() public view virtual returns (bytes32 rootHash) {
        rootHash = _root;
    }

    function _setRoot(bytes32 rootHash) internal virtual {
        _root = rootHash;
        emit RootUpdated(rootHash);
    }

    function _validateProof(
        bytes32 hashedData,
        bytes32[] calldata proof
    ) internal view {
        if (
            !proof.verifyCalldata(root(), keccak256(bytes.concat(hashedData)))
        ) {
            revert InvalidAttestation();
        }
    }
}
