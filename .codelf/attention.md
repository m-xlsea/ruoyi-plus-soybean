## Development Guidelines

### Framework and Language
> This project uses Vue 3 with TypeScript, focusing on modern development practices and type safety.

**Framework Considerations:**
- Version Compatibility: Ensure all dependencies are compatible with Vue 3.4+ and TypeScript 5.3+
- Feature Usage: Leverage Vue 3 Composition API and TypeScript features
- Performance Patterns: Follow Vue 3 best practices for optimal performance
- Upgrade Strategy: Keep dependencies up to date while maintaining compatibility
- Importance Notes for Framework:
	* Use Composition API for better code organization and reusability
	* Implement proper TypeScript types for better development experience
	* Follow Vue 3's reactivity system best practices

**Language Best Practices:**
- Type Safety: Use TypeScript's type system to prevent runtime errors
- Modern Features: Utilize TypeScript's latest features while maintaining compatibility
- Consistency: Apply consistent coding patterns throughout the codebase
- Documentation: Document complex TypeScript implementations and workarounds

### Code Abstraction and Reusability
> The project follows a modular architecture with clear separation of concerns. Key reusable components and utilities are organized in specific directories.

**Modular Design Principles:**
- Single Responsibility: Each module is responsible for only one functionality
- High Cohesion, Low Coupling: Related functions are centralized, reducing dependencies between modules
- Stable Interfaces: Expose stable interfaces externally while internal implementations can vary

**Reusable Component Library:**
```
root
- src
    - components        // Reusable Vue components
        - advanced     // Advanced UI components
        - common       // Common UI components
        - custom       // Custom business components
    - hooks            // Reusable Vue composition functions
        - business     // Business-specific hooks
        - common       // Common utility hooks
    - utils            // Utility functions
        - common.ts    // Common utility functions
        - crypto.ts    // Cryptographic utilities
        - format.ts    // Formatting utilities
        - storage.ts   // Storage utilities
```

### Coding Standards and Tools
**Code Formatting Tools:**
- ESLint: JavaScript/TypeScript code checking
- Prettier: Code formatting
- StyleLint: CSS/SCSS code checking

**Naming and Structure Conventions:**
- Semantic Naming: Variable/function names should clearly express their purpose
- Consistent Naming Style:
  * Vue components: PascalCase (e.g., UserProfile.vue)
  * TypeScript files: camelCase (e.g., userService.ts)
  * CSS/SCSS: kebab-case (e.g., user-profile.scss)
- Directory Structure follows functional responsibility division

### Frontend-Backend Collaboration Standards
**API Design and Documentation:**
- RESTful design principles
	* Use HTTP methods (GET, POST, PUT, DELETE) to represent operations
	* Follow RESTful resource naming conventions
- Timely interface documentation updates
	* Document API endpoints, parameters, and responses
	* Keep API documentation in sync with implementation
- Unified error handling specifications
	* Implement consistent error handling across the application
	* Use appropriate HTTP status codes

**Data Flow:**
- Clear frontend state management
	* Use Pinia for state management
	* Implement proper state persistence strategies
- Data validation on both frontend and backend
	* Validate data types and constraints
	* Implement proper error handling
- Standardized asynchronous operation handling
	* Use consistent API call patterns
	* Implement proper loading and error states

### Performance and Security
**Performance Optimization Focus:**
- Resource loading optimization
	* Use code splitting and lazy loading
	* Implement proper caching strategies
- Rendering performance optimization
	* Use virtualization for large lists
	* Implement proper pagination
- Appropriate use of caching
	* Implement caching strategies for API responses
	* Use browser storage effectively

**Security Measures:**
- Input validation and filtering
	* Validate user inputs and sanitize data
	* Implement proper XSS protection
- Protection of sensitive information
	* Use secure authentication and authorization mechanisms
	* Implement proper token management
- Access control mechanisms
	* Implement role-based access control
	* Use proper permission checking
