require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../auth/models/Role');
const TechStack = require('../stacks/models/TechStack');
const SkillDomain = require('../skills/models/SkillDomain');
const DifficultyLevel = require('../difficulties/models/DifficultyLevel');
const Problem = require('../problems/models/Problem');
const DocsEntry = require('../docs/models/DocsEntry');
const RepositoryGuide = require('../open-source-guides/model');

async function seedRoles() {
  const roles = [
    {
      name: 'normal',
      permissions: ['read', 'write']
    },
    {
      name: 'verified_contributor',
      permissions: ['read', 'write', 'contribute', 'review']
    },
    {
      name: 'admin',
      permissions: ['read', 'write', 'delete', 'admin', 'contribute', 'review']
    }
  ];

  for (const roleData of roles) {
    const existingRole = await Role.findOne({ name: roleData.name });
    if (!existingRole) {
      await Role.create(roleData);
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }
  }
}

async function seedStacksSkillsDifficulties() {
  const stacks = [
    {
      name: 'JavaScript',
      description: 'A beginner-friendly stack for web development and open-source contributions',
      supported: true,
      executionSupported: true
    },
    {
      name: 'React',
      description: 'Frontend library for building interactive UIs',
      supported: true,
      executionSupported: true
    }
  ];

  const difficulties = [
    { name: 'beginner', description: 'Perfect for learners just starting out' },
    { name: 'intermediate', description: 'For learners with some experience' },
    { name: 'advanced', description: 'For learners ready for deeper challenges' }
  ];

  const populatedStacks = [];
  for (const stackData of stacks) {
    let stack = await TechStack.findOne({ name: stackData.name });
    if (!stack) {
      stack = await TechStack.create(stackData);
      console.log(`Created stack: ${stack.name}`);
    } else {
      console.log(`Stack already exists: ${stack.name}`);
    }
    populatedStacks.push(stack);
  }

  const stackByName = populatedStacks.reduce((acc, stack) => {
    acc[stack.name] = stack._id;
    return acc;
  }, {});

  const skills = [
    {
      name: 'JavaScript Fundamentals',
      description: 'Core language concepts for beginners',
      stackId: stackByName.JavaScript
    },
    {
      name: 'React Basics',
      description: 'Building components, props, and state',
      stackId: stackByName.React
    },
    {
      name: 'Open Source Contribution',
      description: 'How to navigate repos and submit PRs',
      stackId: stackByName.JavaScript
    }
  ];

  for (const skillData of skills) {
    const existingSkill = await SkillDomain.findOne({ name: skillData.name, stackId: skillData.stackId });
    if (!existingSkill) {
      await SkillDomain.create(skillData);
      console.log(`Created skill: ${skillData.name}`);
    } else {
      console.log(`Skill already exists: ${existingSkill.name}`);
    }
  }

  for (const difficultyData of difficulties) {
    const existingDifficulty = await DifficultyLevel.findOne({ name: difficultyData.name });
    if (!existingDifficulty) {
      await DifficultyLevel.create(difficultyData);
      console.log(`Created difficulty: ${difficultyData.name}`);
    } else {
      console.log(`Difficulty already exists: ${existingDifficulty.name}`);
    }
  }
}

async function seedProblems() {
  // Get references to existing data
  const javascriptStack = await TechStack.findOne({ name: 'JavaScript' });
  const fundamentalsSkill = await SkillDomain.findOne({ name: 'JavaScript Fundamentals' });
  const beginnerDifficulty = await DifficultyLevel.findOne({ name: 'beginner' });

  if (!javascriptStack || !fundamentalsSkill || !beginnerDifficulty) {
    console.log('Required references not found, skipping problem seeding');
    return;
  }

  const problems = [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      difficultyId: beginnerDifficulty._id,
      stackId: javascriptStack._id,
      skillId: fundamentalsSkill._id,
      problemType: 'practice',
      testCases: [
        {
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0,1]',
          isHidden: false,
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: '[3,2,4]\n6',
          expectedOutput: '[1,2]',
          isHidden: false,
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
        },
        {
          input: '[3,3]\n6',
          expectedOutput: '[0,1]',
          isHidden: true,
          explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
        }
      ],
      starterCode: 'function twoSum(nums, target) {\n    // Your code here\n}',
      solution: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}',
      hints: [
        { text: 'Try using a hash map to store numbers you\'ve seen', order: 1 },
        { text: 'For each number, check if target - current exists in map', order: 2 }
      ],
      tags: ['array', 'hash-table', 'two-pointer'],
      timeLimit: 1000,
      memoryLimit: 256,
      isPublished: true,
      estimatedSolveTime: 20
    },
    {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      difficultyId: beginnerDifficulty._id,
      stackId: javascriptStack._id,
      skillId: fundamentalsSkill._id,
      problemType: 'practice',
      testCases: [
        {
          input: '["h","e","l","l","o"]',
          expectedOutput: '["o","l","l","e","h"]',
          isHidden: false,
          explanation: 'The string is reversed in place.'
        },
        {
          input: '["H","a","n","n","a","h"]',
          expectedOutput: '["h","a","n","n","a","H"]',
          isHidden: false,
          explanation: 'The string is reversed in place.'
        }
      ],
      starterCode: 'function reverseString(s) {\n    // Your code here\n}',
      solution: 'function reverseString(s) {\n    let left = 0;\n    let right = s.length - 1;\n    while (left < right) {\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n}',
      hints: [
        { text: 'Use two pointers, one at start and one at end', order: 1 },
        { text: 'Swap characters and move pointers towards center', order: 2 }
      ],
      tags: ['string', 'two-pointer', 'array'],
      timeLimit: 1000,
      memoryLimit: 256,
      isPublished: true,
      estimatedSolveTime: 15
    }
  ];

  for (const problemData of problems) {
    const existingProblem = await Problem.findOne({ title: problemData.title });
    if (!existingProblem) {
      await Problem.create(problemData);
      console.log(`Created problem: ${problemData.title}`);
    } else {
      console.log(`Problem already exists: ${problemData.title}`);
    }
  }
}

async function seedDocs() {
  // Get references to existing data
  const javascriptStack = await TechStack.findOne({ name: 'JavaScript' });
  const fundamentalsSkill = await SkillDomain.findOne({ name: 'JavaScript Fundamentals' });
  const openSourceSkill = await SkillDomain.findOne({ name: 'Open Source Contribution' });
  const beginnerDifficulty = await DifficultyLevel.findOne({ name: 'beginner' });

  if (!javascriptStack || !fundamentalsSkill || !openSourceSkill || !beginnerDifficulty) {
    console.log('Required references not found, skipping docs seeding');
    return;
  }

  const docs = [
    {
      title: 'Introduction to JavaScript',
      content: '# Introduction to JavaScript\n\nJavaScript is a programming language that adds interactivity to websites...',
      summary: 'Learn the basics of JavaScript programming language',
      stackId: javascriptStack._id,
      skillId: fundamentalsSkill._id,
      difficultyId: beginnerDifficulty._id,
      contentType: 'tutorial',
      order: 1,
      estimatedReadTime: 10,
      tags: ['javascript', 'basics', 'introduction'],
      isPublished: true
    },
    {
      title: 'Variables and Data Types',
      content: '# Variables and Data Types\n\nIn JavaScript, variables are containers for storing data values...',
      summary: 'Understanding JavaScript variables and data types',
      stackId: javascriptStack._id,
      skillId: fundamentalsSkill._id,
      difficultyId: beginnerDifficulty._id,
      contentType: 'tutorial',
      order: 2,
      estimatedReadTime: 15,
      tags: ['javascript', 'variables', 'data-types'],
      isPublished: true
    },
    {
      title: 'Contributing to Open Source',
      content: '# Contributing to Open Source\n\nOpen source contribution is a great way to build your skills...',
      summary: 'Guide to getting started with open source contributions',
      stackId: javascriptStack._id,
      skillId: openSourceSkill._id,
      difficultyId: beginnerDifficulty._id,
      contentType: 'guide',
      order: 1,
      estimatedReadTime: 20,
      tags: ['open-source', 'contribution', 'github'],
      isPublished: true
    }
  ];

  for (const docData of docs) {
    const existingDoc = await DocsEntry.findOne({ title: docData.title });
    if (!existingDoc) {
      await DocsEntry.create(docData);
      console.log(`Created doc: ${docData.title}`);
    } else {
      console.log(`Doc already exists: ${docData.title}`);
    }
  }
}

async function seedOpenSourceGuides() {
  const guides = [
    {
      name: 'React Starter Repo',
      description: 'A beginner-friendly React repository with clear contribution guidelines and first-timer issues.',
      repositoryUrl: 'https://github.com/facebook/react',
      language: 'JavaScript',
      difficulty: 'Beginner',
      contributionGuide: 'Follow the contribution guidelines in the repository README and submit a PR for minor bug fixes or documentation updates.',
      projectOverview: 'React is a popular frontend library for building interactive user interfaces.',
      gettingStartedSteps: [
        {
          step: 'Fork the repository',
          description: 'Create your own copy of the repository on GitHub.'
        },
        {
          step: 'Clone locally',
          description: 'Clone the forked repo to your development machine.'
        },
        {
          step: 'Install dependencies',
          description: 'Use npm or yarn to install project dependencies.'
        }
      ],
      tags: ['web', 'frontend', 'library', 'react'],
      isActive: true
    },
    {
      name: 'Node.js CLI Tool',
      description: 'A small CLI project to help you learn contribution workflows for Node.js and open-source utilities.',
      repositoryUrl: 'https://github.com/nodejs/node',
      language: 'JavaScript',
      difficulty: 'Intermediate',
      contributionGuide: 'Look for issues labeled good-first-issue or help-wanted, then submit a patch following the contribution rules.',
      projectOverview: 'Node.js is a JavaScript runtime built on Chrome V8 for building server-side applications.',
      gettingStartedSteps: [
        {
          step: 'Read the contributing guide',
          description: 'Understand project structure, coding standards, and issue workflow.'
        },
        {
          step: 'Choose an issue',
          description: 'Pick an appropriate issue based on your skills.'
        },
        {
          step: 'Submit a PR',
          description: 'Create a pull request with a clear description and tests if applicable.'
        }
      ],
      tags: ['cli', 'backend', 'node', 'api'],
      isActive: true
    },
    {
      name: 'Python Data Tools',
      description: 'A data-focused repository for Python contributors interested in analytics and scripting.',
      repositoryUrl: 'https://github.com/pandas-dev/pandas',
      language: 'Python',
      difficulty: 'Advanced',
      contributionGuide: 'Review open issues, run the test suite locally, and submit a proposal for larger changes before implementation.',
      projectOverview: 'Pandas is a powerful Python library for data manipulation and analysis.',
      gettingStartedSteps: [
        {
          step: 'Set up the environment',
          description: 'Install required packages and configure your local Python environment.'
        },
        {
          step: 'Explore the codebase',
          description: 'Understand project modules and testing practices.'
        },
        {
          step: 'Work on a chosen issue',
          description: 'Implement a fix or feature following style guidelines.'
        }
      ],
      tags: ['data', 'ai', 'python', 'library'],
      isActive: true
    }
  ];

  for (const guideData of guides) {
    const existingGuide = await RepositoryGuide.findOne({ name: guideData.name });
    if (!existingGuide) {
      await RepositoryGuide.create(guideData);
      console.log(`Created guide: ${guideData.name}`);
    } else {
      console.log(`Guide already exists: ${existingGuide.name}`);
    }
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/open-bridge');

    await seedRoles();
    await seedStacksSkillsDifficulties();
    await seedProblems();
    await seedDocs();
    await seedOpenSourceGuides();

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();