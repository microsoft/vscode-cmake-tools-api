import * as vscode from 'vscode';
import { CMakeToolsApi, CMakeToolsExtensionExports, CodeModel, ConfigurationType, Project, Version } from 'vscode-cmake-tools';

const logger = vscode.window.createOutputChannel("CMake Tools API Integration Sample");

function print(string: string, numTabs = 0): void {
	let value = "";
	for (let i = 0; i < numTabs; i++) {
		value += "\t";
	}
	logger.appendLine(`${value}${string}`);
	logger.show();
}

function printCodeModelContent(codemodel: CodeModel.Content): void {
	print(`Printing the current codemodel from the project using`, 1);

	print("Printing out the toolchains from the codemodel", 2);
	codemodel.toolchains?.forEach((toolchain) => {
		print(`Path: ${toolchain.path}`, 3);
		if (toolchain.target) {
			print(`Target: ${toolchain.target}`, 3);
		}
	});

	print("Printing out the configurations from the codemodel", 2);
	codemodel.configurations.forEach((configuration) => {
		print(`Name: ${configuration.name}`, 3);
		print("Printing out the projects for the configuration", 4);
		configuration.projects.forEach((project) => {
			print(`Name: ${project.name}`, 5);
			print(`Source Directory: ${project.sourceDirectory}`, 5);
			if (project.targets) {
				print("Printing out the targets for the project", 5);
				project.targets.forEach((target) => {
					print(`Name: ${target.name}`, 6);
					print(`Type: ${target.type}`, 7);

					if (target.sourceDirectory) {
						print(`Source Directory: ${target.sourceDirectory}`, 7);
					}

					if (target.fullName) {
						print(`Full Name: ${target.fullName}`, 7);
					}

					if (target.sysroot) {
						print(`Sysroot: ${target.sysroot}`, 7);
					}

					if (target.artifacts) {
						print("Printing out the artifacts for the target", 7);
						target.artifacts.forEach((artifact) => {
							print(`Artifact: ${artifact}`, 8);
						});
					}

					if (target.fileGroups) {
						print("Printing out the file groups for the target", 7);
						target.fileGroups.forEach((fileGroup) => {
							print("Filegroup:", 8);
							print("Printing our the sources for the filegroup", 9);
							fileGroup.sources.forEach((source) => {
								print(`Source: ${source}`, 10);
							});

							if (fileGroup.language) {
								print(`Language: ${fileGroup.language}`, 9);
							}

							if (fileGroup.includePath) {
								print("Printing out the include paths for the filegroup", 9);
								fileGroup.includePath.forEach((includePath) => {
									print(`Include Path: ${includePath.path}`, 10);
								});
							}

							if (fileGroup.compileCommandFragments) {
								print("Printing out the compile command fragments for the filegroup", 9);
								fileGroup.compileCommandFragments.forEach((compileCommandFragment) => {
									print(`Compile Command Fragment: ${compileCommandFragment}`, 10);
								});
							}

							if (fileGroup.defines) {
								print("Printing out the defines for the filegroup", 9);
								fileGroup.defines.forEach((define) => {
									print(`Define: ${define}`, 10);
								});
							}

							if (fileGroup.isGenerated) {
								print("Filegroup is generated", 9);
							} else {
								print("Filegroup is not generated", 9);
							}
						});
					}
				});
			}

			if (project.hasInstallRule) {
				print("Project has install rule", 5);
			} else {
				print("Project does not have install rule", 5);
			}
		});
	});

	print("Done printing out the codemodel content", 1);
}

async function printProjectDetails(project: Project): Promise<void> {
	print("Printing out the project details using the cmake-tools-api\n");

	const codemodel: CodeModel.Content | undefined = project.codeModel;
	if (codemodel) {
		printCodeModelContent(codemodel);
	}

	const buildType = await project.getActiveBuildType();
	print(`Active build type: ${buildType}`, 1);

	const buildDirectory = await project.getBuildDirectory();
	print(`Build directory: ${buildDirectory}`, 1);

	// Other methods available on the project object.
	//await activeProject.build();
	//await activeProject.clean();
	//await activeProject.configure();
	//await activeProject.install();
	//await activeProject.reconfigure();

	print("\nDone printing project details");
}

async function updateProject(project: Project): Promise<void> {
	activeProject = project;
	await printProjectDetails(activeProject);

	activeProject.onCodeModelChanged((_) => {
		print("Code model changed event received");
		if (activeProject && activeProject.codeModel) {
			printCodeModelContent(activeProject.codeModel);
		}
	});

	activeProject.onSelectedConfigurationChanged((configuration) => {
		print("Selected configuration changed event received");
		switch (configuration) {
			case ConfigurationType.Kit:
				print("Selected configuration type: Kit");
				break;
			case ConfigurationType.ConfigurePreset:
				print("Selected configuration type: Configure Preset");
				break;
			case ConfigurationType.BuildPreset:
				print("Selected configuration type: Build Preset");
				break;
		}
	});
}

let api: CMakeToolsApi;
let activeProject: Project | undefined;

export async function activate(_context: vscode.ExtensionContext) {
	const cmakeToolsExtension: CMakeToolsExtensionExports = await vscode.extensions.getExtension('ms-vscode.cmake-tools')?.activate();
	api = cmakeToolsExtension.getApi(Version.v3);

	// Other items available on the api object.
	const version = api.version;
	print(`CMake Tools API version: ${version}`);
	//api.showUIElement(<element>);
	//api.hideUIElement(<element>);

	const proj = await api.getProject(vscode.Uri.file(api.getActiveFolderPath()));
	if (proj) {
		await updateProject(proj);
	}

	api.onBuildTargetChanged(async (target) => {
		print("Build target changed event received");
		print(`Build target: ${target}`);
	});

	api.onLaunchTargetChanged(async (target) => {
		print("Launch target changed event received");
		print(`Launch target: ${target}`);
	});

	api.onActiveProjectChanged(async (projectUri) => {
		logger.clear();
		print("Active project changed event received");
		let proj;
		if (projectUri) {
			proj = await api.getProject(projectUri);
		}

		if (proj) {
			await updateProject(proj);
		}
	});
}
 