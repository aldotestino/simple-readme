#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const os = require('os');
const path = require('path');

let packageJSON;
if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
  packageJSON = require(path.join(process.cwd(), 'package.json'));
}

const defaultName = path.basename(process.cwd());
const defaultAuthor = os.userInfo().username;

function getDefaultDescription() {
  return (packageJSON && packageJSON.description) || null;
}

function getDefaultVersion() {
  return (packageJSON && packageJSON.version) || '1.0.0';
}

function getDependencies() {
  if (packageJSON && packageJSON.dependencies) {
    return `### Dependencies: ${Object.keys(packageJSON.dependencies).map((dep) => `\n* ${dep}`)}`;
  }
  return '';
}

function getLicense() {
  if (packageJSON && packageJSON.license) {
    return `[${packageJSON.license} license](LICENSE)`;
  }
  return '';
}

function createFile(answers) {
  const file = `# ${answers.name} by ${answers.author}

## ${answers.description}

### Version: ${answers.version}

${answers.languages.length > 0 ? `### Languages: ${answers.languages.map((language) => `\n* ${language}`)}` : ''}

${answers.dependencies ? getDependencies() : ''}

${answers.license ? getLicense() : ''}
`;
  fs.writeFileSync(path.join(process.cwd(), 'README.md'), file, 'utf8');
}

async function questions() {
  const answers = await inquirer.prompt([
    {
      type: 'text',
      name: 'name',
      message: 'What\'s your project name?',
      default: defaultName,
    },
    {
      type: 'text',
      name: 'description',
      message: 'Would you like to add a description to your project?:',
      default: getDefaultDescription(),
    },
    {
      type: 'text',
      name: 'author',
      message: 'Who is the author of this project?:',
      default: defaultAuthor,
    },
    {
      type: 'text',
      name: 'version',
      message: 'What is the project version?:',
      default: getDefaultVersion(),
    },
    {
      type: 'checkbox',
      name: 'languages',
      message: 'Which languages are you using for this project?',
      choices: ['Python', 'Java', 'C', 'C++', 'C#', 'Javascript', 'Typescript', 'Node', 'React', 'Vue', 'Svelte', 'Angular', 'ELectron', 'Go'],
    },
    {
      type: 'confirm',
      name: 'dependencies',
      message: 'Do you want to mention the dependecies of this project? (only if package.json is present)',
      default: true,
    },
    {
      type: 'confirm',
      name: 'license',
      message: 'Do you want to link your license?',
      default: true,
    },
  ]);
  createFile(answers);
  console.log('✨ A README.md file with these options has been created!');
  console.log(answers);
}

async function main() {
  const alreadyExists = fs.existsSync(path.join(process.cwd(), 'README.md'));
  if (alreadyExists) {
    const res = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'A README.md file is already present, do you want to overwrite it?',
        default: true,
      },
    ]);
    if (res.overwrite) {
      questions();
    } else {
      console.log('Goodbye!');
      process.exit();
    }
  } else {
    questions();
  }
}

main();
