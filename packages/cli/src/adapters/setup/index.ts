/**
 * @fileoverview Setup and initialization system for Zyntra.js projects
 * 
 * This module provides a comprehensive project setup system similar to T3 Stack CLI,
 * with interactive prompts, feature selection, and automated project generation.
 */

// Main setup command
export { 
  handleInitCommand,
  initInCurrentDirectory,
  initInNewDirectory,
  validateProjectName,
  showInitHelp 
} from './init.setup'

// Interactive prompts system
export { 
  runSetupPrompts,
  confirmOverwrite 
} from './prompts'

// Project generation system
export { 
  ProjectGenerator,
  generateProject 
} from './generator'

// Template generation
export {
  generateZyntraRouter,
  generateUserController,
  generateMainRouter,
  generatePackageJson,
  generateTsConfig,
  generateEnvFile,
  generateDockerCompose,
  generateGitIgnore,
  generateReadme,
  generateAllTemplates
} from './templates'

// Feature configuration system
export {
  ZYNTRA_FEATURES,
  DATABASE_CONFIGS,
  getFeatureDependencies,
  getDockerServices,
  getEnvironmentVariables
} from './features'

// Type definitions
export type {
  ProjectSetupConfig,
  ZyntraFeatures,
  DatabaseProvider,
  DatabaseConfig,
  PackageManager,
  TemplateFile,
  PackageDependency,
  GenerationContext,
  FeatureDefinition,
  DockerService,
  EnvVariable,
} from './types' 