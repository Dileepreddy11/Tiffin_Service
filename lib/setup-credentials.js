#!/usr/bin/env node

/**
 * Script to generate secure admin credentials for the Tiffin Service Admin Portal
 * Run this once and update your .env.local with the generated values
 */

const bcrypt = require('bcryptjs');

// CHANGE THESE TO YOUR PREFERRED CREDENTIALS
const ADMIN_KEY = process.env.ADMIN_KEY || 'TIFFIN_ADM_7K9xQ2mL';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SecurePass@2024!Tiffin';

async function generateCredentials() {
  console.log('\n🔐 Generating Secure Admin Credentials...\n');
  
  try {
    const keyHash = await bcrypt.hash(ADMIN_KEY, 10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    console.log('Admin Key Hash:');
    console.log(keyHash);
    console.log('\nAdmin Password Hash:');
    console.log(passwordHash);
    
    console.log('\n📝 Add these to your .env.local:');
    console.log('NEXT_PUBLIC_ADMIN_KEY=' + ADMIN_KEY);
    console.log('NEXT_PUBLIC_ADMIN_PASSWORD=' + ADMIN_PASSWORD);
    
    console.log('\n✅ Credentials generated successfully!');
    console.log('⚠️  Important: Keep your key and password secure!');
    console.log('⚠️  Only share them with authorized admin users.');
    
  } catch (error) {
    console.error('❌ Error generating credentials:', error);
    process.exit(1);
  }
}

generateCredentials();
