import { getInjectiveAddress } from '@injectivelabs/sdk-ts'

export function convertAddresses(addresses: string[]): string[] {
  return addresses.map((address) => getInjectiveAddress(address));
}
