// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./attestable/SignatureAttestable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SignatureClaim is ERC20, SignatureAttestable {
    uint256 public constant CLAIMABLE_AFTER = 1625097600; // 2021-07-01T00:00:00Z
    uint256 public constant CLAIMABLE_QUANTITY = 100;

    constructor(
        address signerAddress
    ) ERC20("Spearmint", "SPEAR") SignatureAttestable(signerAddress) {}

    function claim(
        bytes calldata signature
    ) external onlyValidSignature(_getHashedData(), signature) {
        if (CLAIMABLE_AFTER > block.timestamp) {
            revert ClaimNotYetAvailable();
        }
        // TODO: Mark as claimed.
        _mint(msg.sender, CLAIMABLE_QUANTITY);
    }

    function _getHashedData() internal view returns (bytes32 hashedData) {
        hashedData = keccak256(abi.encode(msg.sender));
    }

    error ClaimNotYetAvailable();
}
