function generateNextID(prevID) {
    const numericPart = parseInt(prevID.replace(/\D/g, ''));

    const nextNumericPart = numericPart + 1;

    const nextNumericPartStr = nextNumericPart.toString().padStart(prevID.length - 1, '0');

    const prefix = prevID.replace(/\d/g, '');
    const nextID = prefix + nextNumericPartStr;

    return nextID;
  }