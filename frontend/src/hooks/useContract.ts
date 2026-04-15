import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import TipPostABI from '../abi/TipPost.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function useContract() {
  const { account } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    async function initContract() {
      if (!account || !window.ethereum) {
        setContract(null);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          TipPostABI.abi,
          signer
        );
        
        setContract(contractInstance);
      } catch (error) {
        console.error('Error instantiating contract:', error);
        setContract(null);
      }
    }

    initContract();
  }, [account]);

  return contract;
}
