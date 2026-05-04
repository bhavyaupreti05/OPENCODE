const vm = require('vm');

class RunnerService {
  sanitizeResult(result) {
    if (result === undefined || result === null) {
      return String(result);
    }
    if (typeof result === 'object') {
      try {
        return JSON.stringify(result);
      } catch (err) {
        return String(result);
      }
    }
    return String(result);
  }

  parseInput(rawInput) {
    try {
      return JSON.parse(rawInput);
    } catch (err) {
      return rawInput;
    }
  }

  async evaluateJavaScript(code, testCase) {
    const context = {
      console: {
        log: () => {}
      },
      result: null,
      solution: undefined,
      module: {},
      exports: {}
    };

    const scriptSource = `${code}\n` +
      `if (typeof solution !== 'function') {\n` +
      `  if (typeof module.exports === 'function') {\n` +
      `    solution = module.exports;\n` +
      `  } else if (typeof exports === 'function') {\n` +
      `    solution = exports;\n` +
      `  }\n` +
      `}\n` +
      `if (typeof solution !== 'function') {\n` +
      `  throw new Error('Your code must export or define a function named solution');\n` +
      `}`;

    const script = new vm.Script(scriptSource, { timeout: 1000 });
    const sandbox = vm.createContext(context);

    script.runInContext(sandbox, { timeout: 1000 });

    const parsedInput = this.parseInput(testCase.input);
    const args = Array.isArray(parsedInput) ? parsedInput : [parsedInput];

    let output;
    try {
      output = sandbox.solution(...args);
    } catch (err) {
      throw err;
    }

    return this.sanitizeResult(output);
  }

  async evaluate({ code, language, testCases, timeLimit = 1000, memoryLimit = 256 }) {
    if (!Array.isArray(testCases)) {
      throw new Error('Test cases must be provided');
    }

    if (language !== 'javascript') {
      throw new Error('Currently only JavaScript evaluation is supported');
    }

    const results = [];

    for (const testCase of testCases) {
      const start = Date.now();
      let passed = false;
      let actualOutput = null;
      let error = null;

      try {
        actualOutput = await this.evaluateJavaScript(code, testCase);
        passed = actualOutput === String(testCase.expectedOutput);
      } catch (err) {
        actualOutput = err.message;
        error = err.message;
        passed = false;
      }

      const executionTime = Date.now() - start;
      results.push({
        testCaseId: testCase._id || testCase.id || null,
        input: testCase.input,
        expectedOutput: String(testCase.expectedOutput),
        actualOutput,
        passed,
        executionTime,
        memoryUsed: null,
        error
      });
    }

    return results;
  }
}

module.exports = new RunnerService();