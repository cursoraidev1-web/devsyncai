# Contributing to CodexFlow

First off, thank you for considering contributing to CodexFlow! It's people like you that make CodexFlow such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@codexflow.io.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the behavior you expected to see**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript/JavaScript styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. **Fork the repository** and create your branch from `develop`
2. **Install dependencies**: `npm install`
3. **Make your changes**
4. **Add tests** if you've added code that should be tested
5. **Ensure the test suite passes**: `npm test`
6. **Run the linter**: `npm run lint`
7. **Format your code**: `npm run format`
8. **Commit your changes** using conventional commits
9. **Push to your fork** and submit a pull request

## Style Guidelines

### TypeScript Style Guide

* Use TypeScript for all new code
* Use explicit types when possible
* Prefer `interface` over `type` for object types
* Use PascalCase for type names
* Use camelCase for variable and function names
* Use UPPER_CASE for constants

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Follow [Conventional Commits](https://www.conventionalcommits.org/)

Example:
```
feat(auth): add JWT-based authentication

Implement JWT token generation and validation using AWS Cognito.
Include token refresh mechanism and proper error handling.

Closes #123
```

### JavaScript/TypeScript Style Guide

* 2 spaces for indentation
* Prefer single quotes for strings
* Always use semicolons
* Use async/await over promises when possible
* Use arrow functions for callbacks

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with any API changes
3. Add tests for new functionality
4. Ensure all tests pass
5. The PR will be merged once you have the sign-off of at least one maintainer

## Questions?

Feel free to ask questions in our [Community Forum](https://community.codexflow.io) or reach out to the team at contribute@codexflow.io.

Thank you for contributing to CodexFlow! 🎉
