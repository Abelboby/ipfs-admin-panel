# Traffix Admin Panel

![image](https://github.com/user-attachments/assets/6c2e44fc-f5b1-4696-aad1-7d48f8f79393)


## Overview
The *Traffix Admin Panel* is a decentralized application designed for the administrator (or owner) to review road safety reports submitted by citizens and reward them for their efforts by paying them directly through the blockchain. The platform consists of two parts:

![image](https://github.com/user-attachments/assets/359f289b-47f1-43e0-8dac-afa69e14ae75)


1. *Backend*: A Node.js-based server that interacts with the blockchain to fetch report data and process payments.
2. *Frontend*: A React-based admin panel that provides a user-friendly interface to view, review, and reward the reports submitted by users.

The smart contract stores the reports, and the backend retrieves the data for the admin, enabling the admin to perform the review and payment operations.

### Key Features:
1. *Review Reports*: Admins can view the reports submitted by citizens, which include the issue details and images.
2. *Make Payments*: Once the report is reviewed, the admin can reward the user for their submission directly through the blockchain.
3. *Blockchain Interaction*: All data is fetched and submitted through the blockchain, ensuring transparency and immutability.

## Folder Structure
The repository contains two main folders:
- *back-end*: Contains the Node.js server, which interacts with the smart contract and retrieves reports from the blockchain.
- *front-end*: Contains the React-based admin panel for viewing and interacting with reports.

## Technologies Used:
- *Backend*: 
  - Node.js
  - Express
  - Web3.js (for blockchain interaction)
- *Frontend*:
  - React
  - Axios (for API calls to the backend)
  - Web3.js (for Metamask and blockchain interaction)
- *Smart Contracts*: Deployed on Ethereum (or compatible) blockchain.

## Prerequisites
To run this application locally, you need:

- *Node.js*: Install it from [Node.js Official Website](https://nodejs.org/).
- *npm*: Node Package Manager is bundled with Node.js.
- *Metamask Wallet*: Install the [Metamask extension](https://metamask.io/) in your browser to interact with the Ethereum blockchain.
- *Git*: To clone the repository.

## Getting Started

### 1. Clone the Repository:
Clone the repository to your local machine using Git.

bash
git clone https://github.com/kichuman28/traffix-admin-panel.git


### 2. Backend Setup:
1. Navigate to the *backend* directory:
   
   bash
   cd traffix-admin-panel/backend
   

2. Install dependencies:
   
   bash
   npm install
   

3. Start the Node.js server:
   
   bash
   node server.js
   

   The backend server will now be running on http://localhost:5000 (or another configured port). This server is responsible for fetching report data from the blockchain and processing payments.

### 3. Frontend Setup:
1. Open a new terminal and navigate to the *frontend* directory:
   
   bash
   cd traffix-admin-panel/frontend
   

2. Install the dependencies:
   
   bash
   npm install
   

3. Start the React development server:
   
   bash
   npm start
   

   The React app will launch in your browser at http://localhost:3000. Make sure that the backend is running, as the frontend will depend on it to fetch the reports and process transactions.

### Important Notes:
- If the *backend* server is not running, the frontend will not be able to fetch the reports or interact with the blockchain.
- Make sure your Metamask wallet is connected to the correct blockchain network to ensure the app functions properly.

## How to Use

1. *Login with Metamask*: The admin must connect their Metamask wallet to the application.
2. *View Reports*: The admin panel will display all the reports submitted by users, fetched from the blockchain via the backend.
3. *Review Reports*: Admin can review the content of each report, including images and descriptions.
4. *Reward Citizens*: After reviewing a report, the admin can process the payment to reward the user for their effort. This transaction is executed on the blockchain.

## License
This project is licensed under the MIT License.

## Contributions
Contributions are welcome! Feel free to fork this project, submit pull requests, or open issues to enhance the application.
