const DontAgreeAction = {

  // Stored in the metadata, extract and return.
  reason({metadata: {reason}}) {
    return reason;
  }
};

module.exports = DontAgreeAction;
