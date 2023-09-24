import React, { Component } from 'react';
import ContactRegistry from './contracts/ContactRegistry.json'; // Import the contract artifact
import getWeb3 from './getWeb3'; // This is a utility to get the web3 instance
import './ContactApp.css'; // Import your CSS file

class ContactApp extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    name: '',
    number: '',
    contacts: [],
    searchName: '', // Added state for searchName
    filteredContacts: [], // Added state to store filtered contacts
    contactId: '', // Added state to input the contact ID
    contactDetails: null, // Added state to store contact details
  };

  componentDidMount = async () => {
    try {
      // Get the web3 instance
      const web3 = await getWeb3();

      // Get the user's accounts
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ContactRegistry.networks[networkId];
      const contract = new web3.eth.Contract(
        ContactRegistry.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract });

      // Load the user's contacts
      this.loadContacts();
    } catch (error) {
      console.error('Error initializing web3:', error);
    }
  };

  loadContacts = async () => {
    const { contract } = this.state;
    let contacts; // Declare the 'contacts' variable here

    // Get the total number of contacts
    const contactCount = await contract.methods.contactCount().call();
    console.log('Total contact count:', contactCount);

    // Load each contact by ID
    contacts = [];
    for (let i = 1; i <= contactCount; i++) {
      const contact = await contract.methods.viewContact(i).call();
      console.log('Loaded contact:', contact);
      contacts.push(contact);
    }

    console.log('Contacts:', contacts);

    this.setState({ contacts });
    // Set filteredContacts initially to all contacts
    this.setState({ filteredContacts: contacts });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCreateContact = async () => {
    const { accounts, contract, name, number } = this.state;

    // Create a new contact
    await contract.methods.registerContact(name, number).send({ from: accounts[0] });

    console.log('Contact created:', name, number);

    // Reload contacts
    this.loadContacts();

    // Clear the input fields
    this.setState({ name: '', number: '' });
  };

  handleSearch = () => {
    const { contacts, searchName } = this.state;
  
    // Filter contacts based on the searchName
    const filteredContacts = contacts.filter((contact) =>
      contact.name &&
      contact.name.toLowerCase().includes(searchName.toLowerCase())
    );
  
    this.setState({ filteredContacts });
  };

  handleViewContact = async () => {
    const { contract, contactId } = this.state;

    try {
      const contact = await contract.methods.viewContact(contactId).call();
      console.log('Contact details:', contact);
      this.setState({ contactDetails: contact });
    } catch (error) {
      console.error('Error fetching contact:', error);
      this.setState({ contactDetails: null });
    }
  };
  
  render() {
    const { name, number, filteredContacts, searchName, contactId, contactDetails } = this.state;

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
            <button onClick={this.handleCreateContact}>Create</button>
          </div>
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
            <button onClick={this.handleViewContact}>View Contact</button>
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

      </div>
    );
  }
}

export default ContactApp;
