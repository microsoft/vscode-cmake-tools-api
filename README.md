# Public API for the ms-vscode.cmake-tools VS Code extension

The purpose of this API is to allow for extensions to access with the CMake code model and execute CMake commands.

When your extension activates, you can use the following code to get access to the API:

```TypeScript
import { CMakeToolsApi, Version, getCMakeToolsApi, UIElement } from 'vscode-cmake-tools';

const api = await getCMakeToolsApi(Version.v1);
if (api) {
    // Access the API here. In this example, we hide the launch target button.
    await api.hideUIElement(UIElement.StatusBarLaunchButton);
}
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
