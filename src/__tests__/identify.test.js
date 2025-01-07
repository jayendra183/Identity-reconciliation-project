import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import { Contact } from '../models/Contact.js';

describe('Contact Identification API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts_test');
  });

  afterAll(async () => {
    await Contact.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  it('should create a new primary contact when no matches exist', async () => {
    const response = await request(app)
      .post('/identify')
      .send({
        email: 'test@example.com',
        phoneNumber: '1234567890'
      });

    expect(response.status).toBe(200);
    expect(response.body.contact).toHaveProperty('primaryContactId');
    expect(response.body.contact.emails).toContain('test@example.com');
    expect(response.body.contact.phoneNumbers).toContain('1234567890');
    expect(response.body.contact.secondaryContactIds).toHaveLength(0);
  });

  it('should link contacts when matching information is found', async () => {
    // Create initial contact
    const initial = await request(app)
      .post('/identify')
      .send({
        email: 'test@example.com',
        phoneNumber: '1234567890'
      });

    // Send request with matching email but different phone
    const response = await request(app)
      .post('/identify')
      .send({
        email: 'test@example.com',
        phoneNumber: '9876543210'
      });

    expect(response.status).toBe(200);
    expect(response.body.contact.primaryContactId).toBe(initial.body.contact.primaryContactId);
    expect(response.body.contact.phoneNumbers).toHaveLength(2);
    expect(response.body.contact.secondaryContactIds).toHaveLength(1);
  });

  it('should validate request payload', async () => {
    const response = await request(app)
      .post('/identify')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});