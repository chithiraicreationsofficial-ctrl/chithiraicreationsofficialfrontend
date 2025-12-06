// src/hooks/useWalletData.js
import { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";

// Map chainId -> CoinGecko ID
const tokenPriceMap = {
    1: "ethereum",     // Ethereum Mainnet
    56: "binancecoin", // BNB Mainnet
    97: "binancecoin", // BNB Testnet
    137: "polygon",    // Polygon Mainnet
};

export default function useWalletData(preferredCurrency) {
    const { isConnected, chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [address, setAddress] = useState(localStorage.getItem("userAddress") || "");
    const [balance, setBalance] = useState(localStorage.getItem("balance") || "0");
    const [usdBalance, setUsdBalance] = useState(localStorage.getItem("balanceUSD") || "0");

    // 🔄 Fetch native + USD balance
    const getBalanceWithUSD = async () => {
        if (!isConnected || !walletProvider) return;

        try {
            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            setAddress(userAddress);
            localStorage.setItem("userAddress", userAddress);

            // Native balance
            const balanceWei = await provider.getBalance(userAddress);
            const nativeBalance = formatEther(balanceWei);
            setBalance(nativeBalance);
            localStorage.setItem("balance", nativeBalance);

            // USD balance
            const coinId = tokenPriceMap[chainId] || "ethereum";
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
            );
            const usdPrice = data[coinId]?.usd || 0;
            const balanceInUSD = (parseFloat(nativeBalance) * usdPrice).toFixed(2);

            setUsdBalance(balanceInUSD);
            localStorage.setItem("balanceUSD", balanceInUSD);

        } catch (err) {
            console.error("Balance fetch error:", err);
            toast.error("Failed to fetch balance");
        }
    };

    // 🔄 Auto fetch on connect/network change
    useEffect(() => {
        if (isConnected) getBalanceWithUSD();
    }, [isConnected, chainId]);

    // 🔄 Re-fetch when currency changes
    useEffect(() => {
        if (isConnected) getBalanceWithUSD();
    }, [preferredCurrency]);

    return {
        address,
        balance,
        usdBalance,
        getBalanceWithUSD,
    };
}
