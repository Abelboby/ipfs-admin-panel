import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from './config';
import { FileText, MapPin, Link as LinkIcon, CheckCircle, XCircle, DollarSign, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

const OWNER_ADDRESS = "0x0a5be85d5437d8db3887de2acf64457c67030278";

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium focus:outline-none transition-colors duration-200";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function App() {
  const [reports, setReports] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // const response = await axios.get('http://localhost:8080/api/reports');

      const baseURL = 'http://localhost:8080/api/reports';

const response = await axios.get(baseURL);
setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
        
        setIsOwner(connectedAccount.toLowerCase() === OWNER_ADDRESS.toLowerCase());
        setWalletConnected(true);
        toast.success('Wallet connected successfully!');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWalletConnected(false);
    setContract(null);
    setIsOwner(false);
    toast.success('Wallet disconnected');
  };

  const verifyReport = async (reportId) => {
    if (!contract) return;

    try {
      const rewardAmount = prompt("Enter reward amount (in ETH):");
      const tx = await contract.verifyReport(reportId, ethers.parseEther(rewardAmount), {
        value: ethers.parseEther(rewardAmount),
      });
      await tx.wait();
      toast.success("Report verified successfully!");
      fetchReports();
    } catch (error) {
      console.error('Error verifying report:', error);
      toast.error('Failed to verify the report');
    }
  };

  const togglePreview = (link) => {
    setPreview(preview === link ? null : link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Admin Panel
      </h1>

      <div className="flex justify-center mb-8">
        {walletConnected ? (
          <div className="text-center">
            <Button variant="danger" onClick={disconnectWallet}>
              <Wallet className="inline-block mr-2 h-4 w-4" /> Disconnect Wallet
            </Button>
            <p className="mt-2 text-sm text-gray-600">Connected: {truncateAddress(account)}</p>
            {isOwner && <p className="mt-1 text-xs text-green-600 font-medium">Contract Owner</p>}
          </div>
        ) : (
          <Button onClick={connectWallet}>
            <Wallet className="inline-block mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <AnimatePresence>
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">Report #{report.id}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {report.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    <span title={report.reporter}>{truncateAddress(report.reporter)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-green-500" />
                    <span className="truncate">{report.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{report.reward} ETH</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {report.verified ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                    )}
                    <span>{report.verified ? 'Verified' : 'Not Verified'}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{report.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="secondary" onClick={() => togglePreview(report.evidenceLink)}>
                    {preview === report.evidenceLink ? 'Hide Evidence' : 'View Evidence'}
                  </Button>
                  {!report.verified && (
                    <Button onClick={() => verifyReport(report.id)}>
                      Verify Report
                    </Button>
                  )}
                </div>
                <AnimatePresence>
                  {preview === report.evidenceLink && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <img
                        src={report.evidenceLink}
                        alt="Evidence Preview"
                        className="max-w-full h-auto rounded-lg shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default App;
