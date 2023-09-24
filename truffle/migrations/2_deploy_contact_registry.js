const ContactRegistry = artifacts.require("ContactRegistry");

module.exports = function (deployer) {
  deployer.deploy(ContactRegistry);
};
