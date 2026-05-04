const runnerService = require('../services/runnerService');

describe('RunnerService', () => {
  describe('evaluate', () => {
    it('should evaluate javascript code and return passed results', async () => {
      const code = 'function solution(a, b) { return a + b; }';
      const testCases = [
        { input: '[1,2]', expectedOutput: '3' },
        { input: '[5,7]', expectedOutput: '12' }
      ];

      const results = await runnerService.evaluate({
        code,
        language: 'javascript',
        testCases
      });

      expect(results).toHaveLength(2);
      expect(results[0].passed).toBe(true);
      expect(results[1].passed).toBe(true);
      expect(results[0].actualOutput).toBe('3');
      expect(results[1].actualOutput).toBe('12');
    });

    it('should return failed results for incorrect outputs', async () => {
      const code = 'function solution(a, b) { return a - b; }';
      const testCases = [
        { input: '[4,2]', expectedOutput: '6' }
      ];

      const results = await runnerService.evaluate({
        code,
        language: 'javascript',
        testCases
      });

      expect(results[0].passed).toBe(false);
      expect(results[0].actualOutput).toBe('2');
      expect(results[0].error).toBeNull();
    });

    it('should throw for unsupported language', async () => {
      await expect(runnerService.evaluate({
        code: 'print("hello")',
        language: 'python',
        testCases: [{ input: '[]', expectedOutput: 'hello' }]
      })).rejects.toThrow('Currently only JavaScript evaluation is supported');
    });
  });
});