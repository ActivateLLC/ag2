# Contributing to Arise Cares Analytics Platform

We love your input! We want to make contributing to the Arise Cares Analytics Platform as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Monorepo Structure

This project uses a monorepo structure to organize code across multiple packages and services. Please follow these guidelines when contributing:

#### Adding to Existing Packages

If you're adding functionality to an existing package:

1. Navigate to the appropriate package directory
2. Make your changes
3. Update tests if necessary
4. Run tests to ensure your changes don't break existing functionality

#### Creating New Packages

If you need to create a new package:

1. Follow the existing package structure
2. Include a `package.json` file with appropriate dependencies
3. Add appropriate tests
4. Update the root `package.json` if necessary to include your new package

### Coding Style

We use several tools to maintain code quality:

- **ESLint** for JavaScript/TypeScript code
- **Prettier** for code formatting
- **Black** for Python code formatting
- **PyLint** for Python linting

Before submitting a pull request, please make sure your code passes all linting checks:

```bash
# For JavaScript/TypeScript
pnpm lint

# For Python
black .
pylint **/*.py
```

## Integration Guidelines

When working on integrations between AG2, n8n, and BrowserUse:

1. **Clean Interfaces**: Ensure clean API interfaces between components
2. **Decoupling**: Minimize direct dependencies between components
3. **Documentation**: Document all integration points clearly
4. **Error Handling**: Implement robust error handling for cross-component communication

## Working with Core Components

### AG2 Agents

When working with AG2 agents:

- Keep agent responsibilities focused and clear
- Use the shared configuration from `@arise-cares/config`
- Document the agent's purpose and capabilities

### n8n Workflows

When developing n8n workflows:

- Store workflow definitions as JSON in the `services/n8n-workflows/workflows` directory
- Include documentation for each workflow
- Use the n8n connector API for custom functionality

### BrowserUse Automation

When writing BrowserUse automation scripts:

- Place scripts in the appropriate subdirectory based on function
- Implement proper error handling and logging
- Set sensible timeouts and retry logic

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## Questions?

Please feel free to contact the project maintainers if you have any questions about contributing.
