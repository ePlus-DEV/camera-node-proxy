const { hello } = require('./app'); // Assuming hello is the function to be tested

test('hello world!', async () => {
    const result = await hello(); // Ensure the function is awaited
    expect(result).toBe('Hello, World!');
});