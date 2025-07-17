# Copilot Instructions for `mwcom`

This document provides guidance for AI coding agents working on the `mwcom` project. It outlines the architecture, workflows, and conventions specific to this codebase to ensure productive contributions.

## Project Overview

- **Project Name**: `mwcom`
- **Version**: 1.0.0
- **Entry Point**: `index.html`
- **Description**: This project is a refresh of my personal portfolio. It will contain information about me, examples of my work, an email signup form and links to my social profiles.

## Developer Workflows

### Testing
- The `test` script in `package.json` is a placeholder and does not execute any tests. Update the `test` script to include a testing framework (e.g., Jest, Mocha) if tests are added.

### Building and Running
- No build or run scripts are defined in `package.json`. If applicable, add scripts for starting the application or building assets.

## Conventions and Patterns

- **File Structure**: The project has a minimal structure including only an index.html document and the assets it loads from the local file system.
- **Dependencies**: No dependencies are currently defined. Use `npm install <package>` to add dependencies as needed.

## Recommendations for AI Agents

1. **Focus on Initialization**: Since the project is in its early stages, prioritize setting up basic functionality, such as a proper entry point (`index.js`) and initial dependencies.
2. **Add Documentation**: Include comments and README updates to clarify the purpose and usage of new features.
3. **Testing**: Introduce a testing framework and write basic tests to ensure code reliability.

## Key Files

- `.github/tasks/*.md`: The files in this folder are ordered (001, 002, 003, etc.) and inlcude the scoped tasks to build the project.
- `index.html`: This is the entirety of this single page app.

---

If any section is unclear or incomplete, please provide feedback to iterate on this document.