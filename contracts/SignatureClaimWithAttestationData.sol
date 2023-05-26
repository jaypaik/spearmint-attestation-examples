// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./attestable/SignatureAttestable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SignatureClaimWithAttestationData is ERC20, SignatureAttestable {
    struct AttestationData {
        uint256 validAt;
        uint256 quantity;
    }

    constructor(
        address signerAddress
    ) ERC20("Spearmint", "SPEAR") SignatureAttestable(signerAddress) {}

    function claim(
        AttestationData calldata data,
        bytes calldata signature
    ) external onlyValidSignature(_getHashedData(data), signature) {
        if (data.validAt > block.timestamp) {
            revert ClaimNotYetAvailable();
        }
        // TODO: Mark as claimed.
        _mint(msg.sender, data.quantity);
    }

    function _getHashedData(
        AttestationData calldata data
    ) internal view returns (bytes32 hashedData) {
        hashedData = keccak256(abi.encode(msg.sender, data));
    }

    error ClaimNotYetAvailable();
}
