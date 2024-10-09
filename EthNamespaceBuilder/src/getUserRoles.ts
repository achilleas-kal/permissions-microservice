import contract from './ethereumContract';

export const getUserRoles = async (address: string): Promise<string> => {
  try {
    // Fetch the roles for a specific user from the smart contract
    const roles = await contract.getUserRoles(address);
    return roles;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};
