// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContactRegistry {
    // Struct to represent a contact
    struct Contact {
        uint256 id;
        string name;
        string number;
    }

    // Mapping to store contacts by their ID
    mapping(uint256 => Contact) public contacts;

    // Counter to keep track of the total number of contacts
    uint256 public contactCount;

    // Event to log contact registration
    event ContactRegistered(uint256 indexed id, string name, string number);

    // Function to register a new contact
    function registerContact(string memory _name, string memory _number) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_number).length > 0, "Number cannot be empty");

        // Increment the contact count
        contactCount++;

        // Create a new Contact struct and add it to the mapping
        contacts[contactCount] = Contact(contactCount, _name, _number);

        // Emit an event to log the contact registration
        emit ContactRegistered(contactCount, _name, _number);
    }

    // Function to view a contact by its ID
    function viewContact(uint256 _id) public view returns (uint256, string memory, string memory) {
        require(_id > 0 && _id <= contactCount, "Invalid contact ID");

        // Retrieve the contact from the mapping
        Contact memory contact = contacts[_id];

        return (contact.id, contact.name, contact.number);
    }
}
