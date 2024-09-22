require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const { contractABI, contractAddress } = require('./config');

const app = express();
app.use(cors());

// Initialize provider using your Infura or Alchemy endpoint
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// API to get all reports
app.get('/api/reports', async (req, res) => {
  try {
    const totalReports = await contract.reportCount();
    const reports = [];

    for (let reportId = 0; reportId < totalReports; reportId++) {
      try {
        const report = await contract.reports(reportId);
        reports.push({
          id: reportId,
          reporter: report.reporter,
          description: report.description,
          location: report.location,
          evidenceLink: report.evidenceLink,
          verified: report.verified,
          reward: ethers.formatEther(report.reward),
          // timestamp: new Date(report.timestamp * 1000).toLocaleString(),
        });
      } catch (error) {
        console.error(`Error fetching report ${reportId}:`, error);
      }
    }
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
