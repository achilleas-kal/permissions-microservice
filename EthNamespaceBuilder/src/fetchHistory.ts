import { Contract } from 'ethers';
import provider from './ethereumProvider';
import { Log } from 'ethers';
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'


// Universal ABI for whitelist events
const universalWhitelistAbi =
  [{ "inputs": [{ "internalType": "address", "name": "_sanctions", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }], "name": "AddressEmptyCode", "type": "error" }, { "inputs": [], "name": "BadAddress", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "implementation", "type": "address" }], "name": "ERC1967InvalidImplementation", "type": "error" }, { "inputs": [], "name": "ERC1967NonPayable", "type": "error" }, { "inputs": [], "name": "FailedInnerCall", "type": "error" }, { "inputs": [], "name": "InvalidInitialization", "type": "error" }, { "inputs": [], "name": "NotInitializing", "type": "error" }, { "inputs": [], "name": "UUPSUnauthorizedCallContext", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "slot", "type": "bytes32" }], "name": "UUPSUnsupportedProxiableUUID", "type": "error" }, { "inputs": [], "name": "Unauthorized", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint64", "name": "version", "type": "uint64" }], "name": "Initialized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "indexed": false, "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "PublicCapabilityUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint8", "name": "role", "type": "uint8" }, { "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "indexed": false, "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "RoleCapabilityUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }], "name": "Upgraded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "uint8", "name": "role", "type": "uint8" }, { "indexed": false, "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "UserRoleUpdated", "type": "event" }, { "inputs": [], "name": "UPGRADE_INTERFACE_VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }], "name": "canCall", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "enum Role", "name": "role", "type": "uint8" }, { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }], "name": "doesRoleHaveCapability", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "enum Role", "name": "role", "type": "uint8" }], "name": "doesUserHaveRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes4", "name": "", "type": "bytes4" }], "name": "getRolesWithCapability", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "getUserRoles", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes4", "name": "", "type": "bytes4" }], "name": "isCapabilityPublic", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "proxiableUUID", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "sanctions", "outputs": [{ "internalType": "contract ISanctions", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "setPublicCapability", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "enum Role", "name": "role", "type": "uint8" }, { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "setRoleCapability", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "enum Role", "name": "role", "type": "uint8" }, { "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "setUserRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newImplementation", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "upgradeToAndCall", "outputs": [], "stateMutability": "payable", "type": "function" }];









interface UserRoleUpdatedEvent extends Log {
  topics: string[];
  data: string;
}



export async function fetchHistory({
  contractAddress,
  Denom,
  WasmHook = '',
  MintsPaused = false,
  SendsPaused = false,
  BurnsPaused = false,
}: {
  contractAddress: string;
  Denom: string;
  WasmHook?: string;
  MintsPaused?: boolean;
  SendsPaused?: boolean;
  BurnsPaused?: boolean;
}) {
  console.log(`Fetching history for contract at address: ${contractAddress}...`);

  const contract = new Contract(contractAddress, universalWhitelistAbi, provider);

  const userRoleFilter = contract.filters.UserRoleUpdated();
  const roleCapabilityFilter = contract.filters.RoleCapabilityUpdated();

  const userRoleEvents = await contract.queryFilter(userRoleFilter);
  const roleCapabilityEvents = await contract.queryFilter(roleCapabilityFilter);

  console.log('UserRoleUpdated events fetched:', userRoleEvents.length);
  console.log('RoleCapabilityUpdated events fetched:', roleCapabilityEvents.length);

  const AddressRoles: { [user: string]: string[] } = {};  // Tracks each user's assigned roles
  const RolePermissions: { [roleName: string]: number } = {};  // Tracks permission bitmasks for each sub-role

  // Process UserRoleUpdated events (assign users to base role with no permissions)
  userRoleEvents.forEach((event) => {
    const decodedData = contract.interface.decodeEventLog(
      "UserRoleUpdated",
      event.data,
      event.topics
    );
    const { role, enabled } = decodedData;
    let { user } = decodedData;

    user = getInjectiveAddress(user);

    if (!AddressRoles[user]) {
      AddressRoles[user] = [];
    }

    if (enabled) {
      if (!AddressRoles[user].includes(`role-${role}`)) {
        AddressRoles[user].push(`role-${role}`);
      }
    } else {
      // Remove the user from the base role if disabled
      AddressRoles[user] = AddressRoles[user].filter(r => r !== `role-${role}`);
    }

    // Initialize the base role with no permissions
    if (!RolePermissions[`role-${role}`]) {
      RolePermissions[`role-${role}`] = 0; // Base role has 0 permissions
    }
  });

  // Process RoleCapabilityUpdated events (assign/remove permissions in sub-roles)
  roleCapabilityEvents.forEach((event) => {
    const decodedData = contract.interface.decodeEventLog(
      "RoleCapabilityUpdated",
      event.data,
      event.topics
    );
    const { role, functionSig, enabled } = decodedData;
    let { target } = decodedData;

    target = getInjectiveAddress(target);
    // Only process relevant function signatures (mint, transfer/receive, burn)
    if (functionSig !== '0x40c10f19' && functionSig !== '0xa9059cbb' && functionSig !== '0x9dc29fac') {
      return;
    }

    // Ensure user exists in the addressRoles mapping
    if (!AddressRoles[target]) {
      console.log(`Target address ${target} not found in any role, skipping...`);
      return;
    }

    // Determine the sub-role based on the function signature
    let subRole = '';
    let permissionBitmask = 0;
    if (functionSig === '0x40c10f19') {
      subRole = `role-${role}-mint`;  // Mint permission role
      permissionBitmask = 1;
    } else if (functionSig === '0xa9059cbb') {
      subRole = `role-${role}-transfer`;  // Transfer/Receive permission role
      permissionBitmask = 2;
    } else if (functionSig === '0x9dc29fac') {
      subRole = `role-${role}-burn`;  // Burn permission role
      permissionBitmask = 4;
    }

    if (enabled) {
      // Add user to the permission-specific sub-role
      if (!AddressRoles[target].includes(subRole)) {
        AddressRoles[target].push(subRole);
      }
      // Set or update the role's permission bitmask
      if (!RolePermissions[subRole]) {
        RolePermissions[subRole] = 0;
      }
      RolePermissions[subRole] |= permissionBitmask;  // Add the permission
    } else {
      // Remove user from the permission-specific sub-role
      AddressRoles[target] = AddressRoles[target].filter(r => r !== subRole);
      // Remove the permission from the bitmask
      if (RolePermissions[subRole]) {
        RolePermissions[subRole] &= ~permissionBitmask;
      }
    }
  });

  // Construct the Namespace object
  const namespace = {
    Denom,  // Denom is now passed in from the function argument
    WasmHook,  // Optional with a default of ''
    MintsPaused,  // Optional with a default of false
    SendsPaused,  // Optional with a default of false
    BurnsPaused,  // Optional with a default of false
    RolePermissions, // Dynamically generated roles with their permissions
    AddressRoles,  // Maps users to the roles they belong to (base + sub-roles)
  };

  console.log('Fetched history:', namespace);
  return namespace;
}
