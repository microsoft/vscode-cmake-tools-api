import * as vscode from 'vscode';
/**
 * API version information.
 */
export declare enum Version {
    v1 = 1,
    v2 = 2,
    v3 = 3,
    v4 = 4,
    v5 = 5,
    latest = 5
}
/**
 * The interface provided by the CMake Tools extension during activation.
 * It is recommended to use the helper function [getCMakeToolsApi](#getCMakeToolsApi)
 * instead of querying the extension instance directly.
 */
export interface CMakeToolsExtensionExports {
    /**
     * Get an API object.
     * @param version The desired API version.
     * @returns The CMake Tools API object for the specified version.
     */
    getApi(version: Version): CMakeToolsApi;
}
/**
 * An interface to allow VS Code extensions to interact with the CMake Tools extension.
 */
export interface CMakeToolsApi {
    /**
     * The version of the API.
     */
    readonly version: Version;
    /**
     * Shows the given UI element.
     * @param element Element to show.
     */
    showUIElement(element: UIElement): Promise<void>;
    /**
     * Hides the given UI element.
     * @param element Element to hide.
     */
    hideUIElement(element: UIElement): Promise<void>;
    /**
     * An event that fires when the selected build target changes.
     */
    readonly onBuildTargetChanged: vscode.Event<string>;
    /**
     * An event that fires when the selected launch target changes.
     */
    readonly onLaunchTargetChanged: vscode.Event<string>;
    /**
     * An event that fires when the active project changes.
     */
    readonly onActiveProjectChanged: vscode.Event<vscode.Uri | undefined>;
    /**
     * Gets the project associated with the given file or folder, if it exists.
     * @param path The file or folder to get the project for.
     * @returns A promise that resolves to the project if it exists, or undefined otherwise.
     */
    getProject(path: vscode.Uri): Promise<Project | undefined>;
    /**
     * Gets the active workspace folder.
     * @returns The path to the active workspace folder.
     */
    getActiveFolderPath(): string;
}
export declare enum UIElement {
    StatusBarLaunchButton = 0,
    StatusBarDebugButton = 1
}
export declare enum ConfigurationType {
    Kit = 0,
    ConfigurePreset = 1,
    BuildPreset = 2
}
export type EnvironmentWithNull = Record<string, string | undefined | null>;
export interface Condition {
    type: 'const' | 'equals' | 'notEquals' | 'inList' | 'notInList' | 'matches' | 'notMatches' | 'anyOf' | 'allOf' | 'not';
    value?: boolean;
    lhs?: string;
    rhs?: string;
    string?: string;
    list?: string[];
    regex?: string;
    conditions?: Condition[];
    condition?: Condition;
}
export type VendorType = {
    [key: string]: any;
};
export interface Preset {
    name: string;
    displayName?: string;
    description?: string;
    hidden?: boolean;
    inherits?: string | string[];
    environment?: EnvironmentWithNull;
    vendor?: VendorType;
    condition?: Condition | boolean | null;
    isUserPreset?: boolean;
}
export interface InheritsConfigurePreset extends Preset {
    configurePreset?: string;
    inheritConfigureEnvironment?: boolean;
}
export interface TraceOptions {
    mode?: string;
    format?: string;
    source?: string[];
    redirect: string;
}
export interface ValueStrategy {
    value?: string;
    strategy?: 'set' | 'external';
}
export type CacheVarType = null | boolean | string | {
    type: string;
    value: boolean | string;
};
export interface ErrorOptions {
    dev?: boolean;
    deprecated?: boolean;
}
export interface WarningOptions {
    dev?: boolean;
    deprecated?: boolean;
    uninitialized?: boolean;
    unusedCli?: boolean;
    systemVars?: boolean;
}
export interface DebugOptions {
    output?: boolean;
    tryCompile?: boolean;
    find?: boolean;
}
export type VendorVsSettings = {
    'microsoft.com/VisualStudioSettings/CMake/1.0': {
        hostOS: OsName | OsName[];
        [key: string]: any;
    };
    [key: string]: any;
};
export type OsName = "Windows" | "Linux" | "macOS";
export interface ConfigurePreset extends Preset {
    generator?: string;
    architecture?: string | ValueStrategy;
    toolset?: string | ValueStrategy;
    binaryDir?: string;
    cmakeExecutable?: string;
    cacheVariables?: {
        [key: string]: CacheVarType | undefined;
    };
    warnings?: WarningOptions;
    errors?: ErrorOptions;
    debug?: DebugOptions;
    trace?: TraceOptions;
    vendor?: VendorVsSettings | VendorType;
    toolchainFile?: string;
    installDir?: string;
    graphviz?: string;
}
export interface BuildPreset extends InheritsConfigurePreset {
    jobs?: number;
    targets?: string | string[];
    configuration?: string;
    cleanFirst?: boolean;
    verbose?: boolean;
    nativeToolOptions?: string[];
}
export interface OutputOptions {
    shortProgress?: boolean;
    verbosity?: 'default' | 'verbose' | 'extra';
    debug?: boolean;
    outputOnFailure?: boolean;
    quiet?: boolean;
    outputLogFile?: string;
    outputJUnitFile?: string;
    labelSummary?: boolean;
    subprojectSummary?: boolean;
    maxPassedTestOutputSize?: number;
    maxFailedTestOutputSize?: number;
    testOutputTruncation?: 'tail' | 'heads' | 'middle';
    maxTestNameWidth?: number;
}
export interface IncludeFilter {
    name?: string;
    label?: string;
    useUnion?: boolean;
    index?: string | {
        start?: number;
        end?: number;
        stride?: number;
        specificTests?: number[];
    };
}
export interface ExcludeFilter {
    name?: string;
    label?: string;
    fixtures?: {
        any?: string;
        setup?: string;
        cleanup?: string;
    };
}
export interface TestFilter {
    include?: IncludeFilter;
    exclude?: ExcludeFilter;
}
export interface ExecutionOptions {
    stopOnFailure?: boolean;
    enableFailover?: boolean;
    jobs?: number;
    resourceSpecFile?: string;
    testLoad?: number;
    showOnly?: 'human' | 'json-v1';
    repeat?: {
        mode: 'until-fail' | 'until-pass' | 'after-timeout';
        count: number;
    };
    interactiveDebugging?: boolean;
    scheduleRandom?: boolean;
    timeout?: number;
    noTestsAction?: 'default' | 'error' | 'ignore';
}
export interface TestPreset extends InheritsConfigurePreset {
    configuration?: string;
    overwriteConfigurationFile?: string[];
    output?: OutputOptions;
    filter?: TestFilter;
    execution?: ExecutionOptions;
}
export interface PackageOutputOptions {
    debug?: boolean;
    verbose?: boolean;
}
export interface PackagePreset extends InheritsConfigurePreset {
    configurations?: string[];
    generators?: string[];
    variables?: {
        [key: string]: string | null | undefined;
    };
    configFile?: string;
    output?: PackageOutputOptions;
    packageName?: string;
    packageVersion?: string;
    packageDirectory?: string;
    vendorName?: string;
}
export interface CommandResult {
    /**
     * The exit code of the command.
     */
    exitCode: number;
    /**
     * The standard output of the command.
     */
    stdout?: string;
    /**
     * The standard error output of the command.
     */
    stderr?: string;
}
export interface Project {
    /**
     * Gets the code model for this project if it is available.
     */
    readonly codeModel: CodeModel.Content | undefined;
    /**
     * Gets the configure preset for this project if it is available.
     */
    readonly configurePreset: ConfigurePreset | undefined;
    /**
     * Gets the build preset for this project if it is available.
     */
    readonly buildPreset: BuildPreset | undefined;
    /**
     * Gets the test preset for this project if it is available.
     */
    readonly testPreset: TestPreset | undefined;
    /**
     * Gets the package preset for this project if it is available.
     */
    readonly packagePreset: PackagePreset | undefined;
    /**
     * Gets whether this project uses CMake Presets.
     */
    readonly useCMakePresets: boolean;
    /**
     * An event that fires when the code model for this project is updated.
     */
    readonly onCodeModelChanged: vscode.Event<void>;
    /**
     * An event that fires when the selected configuration changes.
     * This applies to Kits or Presets.
     */
    readonly onSelectedConfigurationChanged: vscode.Event<ConfigurationType>;
    /**
     * Configures the project.
     */
    configure(): Promise<void>;
    /**
     * Configures the project and returns the result of the command.
     * @param cancellationToken Optional cancellation token to cancel the operation.
     * @returns A promise that resolves to the command result.
     */
    configureWithResult(cancellationToken?: vscode.CancellationToken): Promise<CommandResult>;
    /**
     * Builds the given targets or the active build target if none are given.
     * @param targets The targets to build. If not provided, the active build target is used.
     */
    build(targets?: string[]): Promise<void>;
    /**
     * Builds the given targets or the active build target if none are given,
     * @param targets The targets to build. If not provided, the active build target is used.
     * @param cancellationToken Optional cancellation token to cancel the operation.
     * @returns A promise that resolves to the command result.
     */
    buildWithResult(targets?: string[], cancellationToken?: vscode.CancellationToken): Promise<CommandResult>;
    /**
     * Executes the tests for the project.
     * @param tests The tests to run. If not provided, all tests are run.
     * @param cancellationToken Optional cancellation token to cancel the operation.
     * @returns A promise that resolves to the command result.
     */
    ctestWithResult(tests?: string[], cancellationToken?: vscode.CancellationToken): Promise<CommandResult>;
    /**
     * Installs the project.
     */
    install(): Promise<void>;
    /**
     * Installs the project and returns the result of the command.
     * @param cancellationToken Optional cancellation token to cancel the operation.
     * @returns A promise that resolves to the command result.
     */
    installWithResult(cancellationToken?: vscode.CancellationToken): Promise<CommandResult>;
    /**
     * Cleans the build output from the project.
     */
    clean(): Promise<void>;
    /**
     * Cleans the build output from the project and returns the result of the command.
     * @param cancellationToken Optional cancellation token to cancel the operation.
     * @returns A promise that resolves to the command result.
     */
    cleanWithResult(cancellationToken?: vscode.CancellationToken): Promise<CommandResult>;
    /**
     * Removes the CMake cache file and any intermediate configuration files,
     * then configures the project.
     */
    reconfigure(): Promise<void>;
    /**
     * Removes the CMake cache file and any intermediate configuration files,
     * then configures the project and returns the result of the command.
     * @param cancellationToken Optional cancellation token to cancel the operation.
     * @returns A promise that resolves to the command result.
     */
    reconfigureWithResult(cancellationToken?: vscode.CancellationToken): Promise<CommandResult>;
    /**
     * Gets the directory where build output is placed, if it is defined.
     * @returns A promise that resolves to the build directory path, or undefined if not defined.
     */
    getBuildDirectory(): Promise<string | undefined>;
    /**
     * Gets the type of build for the currently selected configuration.
     * @returns A promise that resolves to the active build type, or undefined if not available.
     */
    getActiveBuildType(): Promise<string | undefined>;
    /**
     * Gets all of the build targets for the project.
     * @returns A promise that resolves to an array of build target names, or undefined if not available.
     */
    listBuildTargets(): Promise<string[] | undefined>;
    /**
     * Gets all the tests for the project.
     * @returns A promise that resolves to an array of test names, or undefined if not available.
     */
    listTests(): Promise<string[] | undefined>;
}
export declare namespace CodeModel {
    type TargetType = 'STATIC_LIBRARY' | 'MODULE_LIBRARY' | 'SHARED_LIBRARY' | 'OBJECT_LIBRARY' | 'EXECUTABLE' | 'UTILITY' | 'INTERFACE_LIBRARY';
    /**
     * Describes a CMake target.
     */
    interface Target {
        /**
         * A string specifying the logical name of the target.
         *
         * (Source CMake Documentation cmake-file-api(7))
         */
        readonly name: string;
        /**
         * A string specifying the type of the target.
         * The value is one of EXECUTABLE, STATIC_LIBRARY, SHARED_LIBRARY, MODULE_LIBRARY, OBJECT_LIBRARY, or UTILITY.
         *
         * (Source CMake Documentation cmake-file-api(7))
         *
         * \todo clarify need of INTERFACE_LIBRARY type
         */
        type: TargetType;
        /** A string specifying the absolute path to the target’s source directory. */
        sourceDirectory?: string;
        /** Name of the target artifact on disk (library or executable file name). */
        fullName?: string;
        /** List of absolute paths to a target´s build artifacts. */
        artifacts?: string[];
        /**
         * The file groups describe a list of compilation information for artifacts of this target.
         * The file groups contains source code files that use the same compilation information
         * and are known by CMake.
         */
        fileGroups?: FileGroup[];
        /**
         * Represents the CMAKE_SYSROOT variable
         */
        sysroot?: string;
    }
    /**
     * Describes a file group to describe the build settings.
     */
    interface FileGroup {
        /** List of source files with the same compilation information */
        sources: string[];
        /** Specifies the language (C, C++, ...) for the toolchain */
        language?: string;
        /** Include paths for compilation of a source file */
        includePath?: {
            /** include path */
            path: string;
        }[];
        /** Compiler flags */
        compileCommandFragments?: string[];
        /** Defines */
        defines?: string[];
        /** CMake generated file group */
        isGenerated: boolean;
    }
    /**
     * Describes cmake project and all its related targets
     */
    interface Project {
        /** Name of the project */
        name: string;
        /** List of targets */
        targets: Target[];
        /** Location of the Project */
        sourceDirectory: string;
        hasInstallRule?: boolean;
    }
    /**
     * Describes cmake configuration
     */
    interface Configuration {
        /** List of project() from CMakeLists.txt */
        projects: Project[];
        /** Name of the active configuration in a multi-configuration generator.*/
        name: string;
    }
    interface Toolchain {
        path: string;
        target?: string;
    }
    /** Describes the cmake model */
    interface Content {
        /** List of configurations provided by the selected generator */
        configurations: Configuration[];
        toolchains?: Map<string, Toolchain>;
    }
}
/**
 * Helper function to get the CMakeToolsApi from the CMake Tools extension.
 * @param desiredVersion The desired API version.
 * @param exactMatch If true, the version must match exactly. Otherwise, the
 * function will attempt to return the requested version, but it may not match
 * exactly.
 * @returns The API object, or undefined if the API is not available.
 */
export declare function getCMakeToolsApi(desiredVersion: Version, exactMatch?: boolean): Promise<CMakeToolsApi | undefined>;
