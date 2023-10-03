import React, { Component } from 'react';
import ContactRegistry from './contracts/ContactRegistry.json';
import getWeb3 from './getWeb3';
import './ContactApp.css';
import { QrReader } from 'react-qr-reader';
import qrcode from 'qrcode'; // Import qrcode library

class ContactApp extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    name: '',
    number: '',
    contactId: '',
    contactDetails: null,
    qrCodeDataURL: null,
    qrScannerEnabled: false,
    scannedQRData: null,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ContactRegistry.networks[networkId];
      const contract = new web3.eth.Contract(
        ContactRegistry.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract });
    } catch (error) {
      console.error('Error initializing web3:', error);
    }
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCreateContact = async () => {
    const { accounts, contract, name, number } = this.state;

    try {
      await contract.methods.registerContact(name, number).send({ from: accounts[0] });

      console.log('Contact created:', name, number);

      const contactCount = await contract.methods.contactCount().call();
      const contactId = contactCount.toString();

      // Generate a QR code as a Data URL using qrcode library
      const qrCodeDataURL = await qrcode.toDataURL(contactId);

      this.setState({ qrCodeDataURL, name: '', number: '', contactDetails: null });
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };
  
  handleViewContact = async () => {
    const { contract, contactId } = this.state;

    try {
      const contact = await contract.methods.viewContact(contactId).call();
      console.log('Contact details:', contact);
      this.setState({ contactDetails: contact, qrCodeDataURL: null });
    } catch (error) {
      console.error('Error fetching contact:', error);
      this.setState({ contactDetails: null });
    }
  };

  handleDownloadQRCode = () => {
    const { qrCodeDataURL } = this.state;

    if (qrCodeDataURL) {
      const a = document.createElement('a');
      a.href = qrCodeDataURL;
      a.download = 'contact_qr_code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  toggleQRScanner = () => {
    this.setState((prevState) => ({
      qrScannerEnabled: !prevState.qrScannerEnabled,
      scannedQRData: null,
    }));
  };

  handleScan = (data) => {
    if (data) {
      // Extract the text from the scanned data
      const scannedText = data.text;
  
      // Update the contactId state with the scanned text
      this.setState({ contactId: scannedText }, () => {
        // After updating the state, call the handleViewContact method
        this.handleViewContact();
      });
    }
  };
  
  

  render() {
    const { name, number, contactId, contactDetails, qrCodeDataURL, qrScannerEnabled, scannedQRData } = this.state;

    return (
      <div className="contact-app">
        <h1>Contact Registry</h1>

        <div className="section">
          <h2>Create Contact</h2>
          <div className="form">
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="number"
              value={number}
              onChange={this.handleInputChange}
              placeholder="Number"
            />
            <button className="contact-button" onClick={this.handleCreateContact}>
              Create
            </button>
          </div>
          {qrCodeDataURL && (
            <div className="contact-details">
              <h3>QR Code</h3>
              <img src={qrCodeDataURL} alt="QR Code" />
              <br></br>
              <button className="contact-button" onClick={this.handleDownloadQRCode}>
                Download QR Code
              </button>
            </div>
          )}
        </div>

        <div className="section">
          <h2>View Contact by ID</h2>
          <div className="form">
            <input
              type="text"
              name="contactId"
              value={contactId}
              onChange={this.handleInputChange}
              placeholder="Enter Contact ID"
            />
            <button className="contact-button" onClick={this.handleViewContact}>
              View Contact
            </button>
          </div>
          {contactDetails && (
            <div className="contact-details">
              <h3>Contact Details</h3>
              <p>ID: {contactDetails[0]}</p>
              <p>Name: {contactDetails[1]}</p>
              <p>Number: {contactDetails[2]}</p>
            </div>
          )}
        </div>

        <div className="section">
          <h2>QR Scanner</h2>
          <div className="form">
            <button className="contact-button" onClick={this.toggleQRScanner}>
              {qrScannerEnabled ? 'Disable QR Scanner' : 'Enable QR Scanner'}
            </button>
          </div>
          {qrScannerEnabled && (
            <div className="qr-scanner">
              <QrReader
                delay={300}
                onScan={this.handleScan}
                onResult={this.handleScan} // Add this line
                onError={(error) => console.error('QR Scanner Error:', error)}
                style={{ width: '100%' }}
              />
            </div>
          )}
          {scannedQRData && (
            <div className="scanned-data">
              <h3>Scanned QR Code Data</h3>
              <p>{scannedQRData}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ContactApp;