#!/usr/bin/env node

/**
 * AWS RDS PostgreSQL Database Setup Script
 * 
 * This script helps with setting up the .env file for the database connection
 * and initializing the database schema.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define paths
const rootDir = path.resolve(__dirname, '..');
const envFilePath = path.join(rootDir, '.env');

/**
 * Prompt the user for input with an optional default value
 */
function prompt(question, defaultValue = '') {
  const defaultText = defaultValue ? ` (default: ${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${defaultText}: `, (input) => {
      resolve(input || defaultValue);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log('\n📦 AWS RDS PostgreSQL Database Setup\n');
  
  console.log('This script will help you set up your AWS RDS database connection.\n');
  console.log('Please have your AWS RDS credentials ready.\n');
  
  // Get database connection info
  const region = await prompt('AWS Region', 'us-east-1');
  const dbHost = await prompt('RDS Endpoint (e.g., your-db.abcdef123456.us-east-1.rds.amazonaws.com)');
  const dbPort = await prompt('Database Port', '5432');
  const dbName = await prompt('Database Name', 'chat_history_db');
  const dbUser = await prompt('Database Username', 'db_admin');
  const dbPassword = await prompt('Database Password');
  
  // Construct the connection string
  const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
  
  // Create or update .env file
  try {
    const envFileContent = `# PostgreSQL Connection (AWS RDS)
DATABASE_URL="${connectionString}"

# AWS RDS Configuration
AWS_RDS_REGION="${region}"
AWS_RDS_INSTANCE="${dbHost.split('.')[0]}"
AWS_RDS_DB_NAME="${dbName}"
AWS_RDS_USERNAME="${dbUser}"
AWS_RDS_PASSWORD="${dbPassword}"
AWS_RDS_PORT="${dbPort}"

# Application Configuration
NODE_ENV="development"
`;

    fs.writeFileSync(envFilePath, envFileContent);
    console.log('\n✅ .env file created successfully!\n');
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message);
    process.exit(1);
  }
  
  // Ask if the user wants to run migrations
  const runMigrations = await prompt('Do you want to run database migrations now? (y/n)', 'y');
  
  if (runMigrations.toLowerCase() === 'y') {
    try {
      console.log('\n🚀 Running Prisma migrations...\n');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('\n✅ Database migrations applied successfully!\n');
      
      console.log('🚀 Generating Prisma client...\n');
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('\n✅ Prisma client generated successfully!\n');
    } catch (error) {
      console.error('\n❌ Error running migrations:', error.message);
      console.log('\nPlease check your database connection and try again manually with:');
      console.log('  npx prisma migrate deploy');
      console.log('  npx prisma generate');
    }
  } else {
    console.log('\nYou can run migrations manually with:');
    console.log('  npx prisma migrate deploy');
    console.log('  npx prisma generate');
  }
  
  console.log('\n🎉 Setup complete! You can now start the application with:');
  console.log('  npm run dev\n');
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
}); 