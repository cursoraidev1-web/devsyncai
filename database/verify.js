#!/usr/bin/env node

/**
 * Database Verification Script
 * Run this to verify your Supabase database is set up correctly
 * 
 * Usage: node database/verify.js
 */

const https = require('https');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Expected tables
const EXPECTED_TABLES = [
  'users',
  'projects',
  'project_members',
  'prds',
  'prd_versions',
  'prd_sections',
  'documents',
  'tasks',
  'task_comments',
  'notifications',
  'integrations',
  'github_repos',
  'commits',
  'deployments',
  'audit_logs',
  'analytics_events',
];

console.log(`${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║   Zyndrx Database Verification Script    ║${colors.reset}`);
console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);

// Check environment variables
function checkEnvVariables() {
  console.log(`${colors.blue}[1/4] Checking environment variables...${colors.reset}`);
  
  if (!SUPABASE_URL || SUPABASE_URL.includes('your-project')) {
    console.log(`${colors.red}✗ SUPABASE_URL not configured in .env${colors.reset}`);
    console.log(`${colors.yellow}  → Set up Supabase project and update .env file${colors.reset}\n`);
    return false;
  }
  
  if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('your-service')) {
    console.log(`${colors.red}✗ SUPABASE_SERVICE_ROLE_KEY not configured in .env${colors.reset}`);
    console.log(`${colors.yellow}  → Get your service role key from Supabase dashboard${colors.reset}\n`);
    return false;
  }
  
  console.log(`${colors.green}✓ Environment variables configured${colors.reset}`);
  console.log(`  URL: ${SUPABASE_URL}`);
  console.log(`  Key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...${colors.reset}\n`);
  return true;
}

// Make HTTP request to Supabase
function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Test database connection
async function testConnection() {
  console.log(`${colors.blue}[2/4] Testing database connection...${colors.reset}`);
  
  try {
    // Try to query users table
    const result = await makeRequest('/rest/v1/users?select=count&limit=1');
    
    if (result.status === 200) {
      console.log(`${colors.green}✓ Successfully connected to database${colors.reset}\n`);
      return true;
    } else if (result.status === 404) {
      console.log(`${colors.red}✗ Users table not found${colors.reset}`);
      console.log(`${colors.yellow}  → Run database/schema.sql in Supabase SQL Editor${colors.reset}\n`);
      return false;
    } else {
      console.log(`${colors.red}✗ Connection failed (Status: ${result.status})${colors.reset}`);
      console.log(`  Response: ${JSON.stringify(result.data).substring(0, 100)}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Connection error: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Verify all tables exist
async function verifyTables() {
  console.log(`${colors.blue}[3/4] Verifying database tables...${colors.reset}`);
  
  const results = [];
  
  for (const table of EXPECTED_TABLES) {
    try {
      const result = await makeRequest(`/rest/v1/${table}?select=count&limit=1`);
      
      if (result.status === 200) {
        results.push({ table, exists: true });
      } else {
        results.push({ table, exists: false });
      }
    } catch (error) {
      results.push({ table, exists: false, error: error.message });
    }
  }
  
  // Display results
  const existingTables = results.filter(r => r.exists);
  const missingTables = results.filter(r => !r.exists);
  
  console.log(`  Found: ${existingTables.length}/${EXPECTED_TABLES.length} tables`);
  
  if (existingTables.length > 0) {
    console.log(`\n  ${colors.green}✓ Existing tables:${colors.reset}`);
    existingTables.forEach(r => {
      console.log(`    • ${r.table}`);
    });
  }
  
  if (missingTables.length > 0) {
    console.log(`\n  ${colors.red}✗ Missing tables:${colors.reset}`);
    missingTables.forEach(r => {
      console.log(`    • ${r.table}`);
    });
    console.log(`\n  ${colors.yellow}→ Run database/schema.sql in Supabase SQL Editor${colors.reset}\n`);
    return false;
  }
  
  console.log(`\n${colors.green}✓ All tables exist${colors.reset}\n`);
  return true;
}

// Check for seed data
async function checkSeedData() {
  console.log(`${colors.blue}[4/4] Checking for seed data...${colors.reset}`);
  
  try {
    const result = await makeRequest('/rest/v1/users?select=count');
    
    if (result.status === 200) {
      const count = result.data[0]?.count || 0;
      
      if (count === 0) {
        console.log(`${colors.yellow}! No users found in database${colors.reset}`);
        console.log(`  ${colors.cyan}→ Optional: Run database/seed.sql for test data${colors.reset}\n`);
      } else {
        console.log(`${colors.green}✓ Database contains data (${count} users)${colors.reset}\n`);
      }
    }
  } catch (error) {
    console.log(`${colors.yellow}! Could not check for seed data${colors.reset}\n`);
  }
}

// Main verification function
async function verify() {
  try {
    // Step 1: Check environment variables
    const envOk = checkEnvVariables();
    if (!envOk) {
      console.log(`${colors.red}❌ Verification failed: Environment not configured${colors.reset}`);
      console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
      console.log(`  1. Create a Supabase project at https://supabase.com`);
      console.log(`  2. Copy your API keys to .env file`);
      console.log(`  3. Run this script again\n`);
      process.exit(1);
    }
    
    // Step 2: Test connection
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.log(`${colors.red}❌ Verification failed: Cannot connect to database${colors.reset}\n`);
      process.exit(1);
    }
    
    // Step 3: Verify tables
    const tablesOk = await verifyTables();
    if (!tablesOk) {
      console.log(`${colors.red}❌ Verification failed: Missing tables${colors.reset}`);
      console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
      console.log(`  1. Go to Supabase dashboard → SQL Editor`);
      console.log(`  2. Copy contents of database/schema.sql`);
      console.log(`  3. Paste and run in SQL Editor`);
      console.log(`  4. Run this script again\n`);
      process.exit(1);
    }
    
    // Step 4: Check seed data
    await checkSeedData();
    
    // Success!
    console.log(`${colors.green}╔═══════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║   ✓ Database verification successful!    ║${colors.reset}`);
    console.log(`${colors.green}╚═══════════════════════════════════════════╝${colors.reset}\n`);
    
    console.log(`${colors.cyan}Your database is ready for development!${colors.reset}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Run: npm run dev`);
    console.log(`  2. Visit: http://localhost:5000/health`);
    console.log(`  3. Start building your modules\n`);
    
  } catch (error) {
    console.log(`${colors.red}❌ Verification error: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Run verification
verify();
