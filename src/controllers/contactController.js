import { Contact } from '../models/Contact.js';

export async function identifyContact(req, res, next) {
  try {
    const { email, phoneNumber } = req.body;

    // Find existing contacts with matching email or phone number
    const existingContacts = await Contact.find({
      $or: [
        { email: email || null },
        { phoneNumber: phoneNumber || null }
      ],
      deletedAt: null
    });

    if (existingContacts.length === 0) {
      // Create new primary contact
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      });

      return res.json({
        contact: {
          primaryContactId: newContact._id,
          emails: [email].filter(Boolean),
          phoneNumbers: [phoneNumber].filter(Boolean),
          secondaryContactIds: []
        }
      });
    }

    // Find primary contact
    let primaryContact = existingContacts.find(c => c.linkPrecedence === 'primary');
    
    if (!primaryContact) {
      // If no primary contact exists, make the first contact primary
      primaryContact = existingContacts[0];
      primaryContact.linkPrecedence = 'primary';
      await primaryContact.save();
    }

    // Create secondary contact if new information is provided
    if (email && phoneNumber && !existingContacts.some(c => 
      (c.email === email && c.phoneNumber === phoneNumber))) {
      await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact._id,
        linkPrecedence: 'secondary'
      });
    }

    // Get all related contacts
    const allRelatedContacts = await Contact.find({
      $or: [
        { _id: primaryContact._id },
        { linkedId: primaryContact._id }
      ],
      deletedAt: null
    });

    // Consolidate contact information
    const emails = [...new Set(allRelatedContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(allRelatedContacts.map(c => c.phoneNumber).filter(Boolean))];
    const secondaryContactIds = allRelatedContacts
      .filter(c => c.linkPrecedence === 'secondary')
      .map(c => c._id);

    return res.json({
      contact: {
        primaryContactId: primaryContact._id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });
  } catch (error) {
    next(error);
  }
}