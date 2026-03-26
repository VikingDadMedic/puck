# Build and Test

Build the `@puckeditor/core` package and run the full test suite.

## Steps

1. Build the core library:
   ```
   yarn turbo run build --filter=@puckeditor/core
   ```

2. Run the test suite:
   ```
   cd packages/core && yarn test
   ```

3. Report results: list any build errors or test failures with file paths and error messages.

4. If all tests pass, confirm success with the count of passing tests.

## When build fails

- Check for TypeScript errors in the build output
- Ensure no circular imports were introduced
- Verify CSS Module imports resolve correctly

## When tests fail

- Show the failing test name and assertion error
- Identify the source file being tested
- Suggest a fix if the failure is obvious
