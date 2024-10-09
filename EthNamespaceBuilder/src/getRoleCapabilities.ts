import contract from './ethereumContract';
import { Log } from 'ethers';

interface RoleCapabilityUpdatedEvent extends Log {
  topics: string[];
  data: string;
}

export async function trackRoleCapabilities() {
  console.log('Tracking Role Capability Changes...');

  // Filter for RoleCapabilityUpdated event
  const filter = contract.filters.RoleCapabilityUpdated();
  const events = await contract.queryFilter(filter);
  //console.log('Events fetched:', events.length);

  const roleCapabilitiesMap: Map<string, { role: number; target: string; functionSig: string; enabled: boolean }> = new Map();

  events.forEach((event) => {
    const roleCapabilityEvent = event as RoleCapabilityUpdatedEvent;

    const decodedData = contract.interface.decodeEventLog(
      "RoleCapabilityUpdated",
      roleCapabilityEvent.data,
      roleCapabilityEvent.topics
    );

    const { role, target, functionSig, enabled } = decodedData;

    const key = `${role}-${target}-${functionSig}`;

    roleCapabilitiesMap.set(key, { role: Number(role), target, functionSig, enabled });

    //console.log(`Processed event: role=${role}, target=${target}, functionSig=${functionSig}, enabled=${enabled}`);
  });

  const roleCapabilities = Array.from(roleCapabilitiesMap.values());

  return roleCapabilities;
}

if (require.main === module) {
  trackRoleCapabilities().catch(console.error);
}
