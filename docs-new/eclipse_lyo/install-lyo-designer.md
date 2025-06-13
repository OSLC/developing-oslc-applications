# Installing Lyo Designer

Lyo Designer is available both as a standalone application and as plugins for existing Eclipse installations.

!!! info "Java Requirements"
    Lyo Designer requires **Java 8** for the standalone application. Plugin installations may have different requirements based on your Eclipse version.

## Standalone Application

### Download and Installation

1. **Download** the Lyo Designer application for your operating system from the [Lyo download site](https://download.eclipse.org/lyo/product/binaries/stable/)
2. **Extract** the downloaded archive to your desired location
3. **Run** the `lyodesigner` executable
4. **Update regularly** by selecting **Help → Check for Updates**

!!! tip "System Requirements"
    - Java 8 (required)
    - 4GB RAM minimum, 8GB recommended
    - 1GB free disk space

## Plugin Installation

For advanced users who want to integrate Lyo Designer into an existing Eclipse IDE.

!!! warning "Compatibility"
    The modeling environment and code generator work on Eclipse versions up to **Eclipse 2020-09 (v4.18)**. Plugin dependency conflicts may occur with other plugins.

### Prerequisites

First ensure your Eclipse environment is properly configured for Lyo development:
- Follow the [Eclipse Setup Guide](setup.md)
- Install Eclipse IDE for Enterprise Java and Web Developers

### Installation Steps

1. **Open Eclipse Update Manager**
   - Select **Help → Install New Software...**

2. **Add Update Site**
   - Set **Work With:** to `http://download.eclipse.org/lyo/p2/stable/`

3. **Select Features**
   - ☑️ **Lyo Code Generator**
   - ☑️ **Lyo Toolchain Designer**

4. **Complete Installation**
   - Follow the installation wizard
   - Restart Eclipse when prompted

### Required Additional Plugins

Install these additional plugins for full functionality:

!!! note "Required Dependencies"
    - **Acceleo** - Template-based code generation
    - **Sirius Integration with Xtext** - Modeling language support
    - **Sirius Properties Views - Runtime Support** - Property editing
    - **Sirius Properties Views - Specifier Support** - Property specification
    - **Sirius Specifier Environment** - Complete modeling environment

### Troubleshooting Installation

If you encounter installation problems:

!!! tip "Common Solutions"
    1. **Enable dependency resolution**: Check "Contact all update sites during install to find required software"
    2. **Toggle categorization**: Check/uncheck "Group items by category"
    3. **Clean installation**: Uninstall existing version and reinstall
    4. **Check proxy settings**: Ensure Eclipse can access update sites

## Bleeding Edge Updates

!!! danger "Use at Your Own Risk"
    Bleeding edge builds contain unreleased features and may be unstable.

### Standalone Application

1. **Open Preferences**
   - Select **Window → Preferences**

2. **Configure Update Sites**
   - Select **Install/Update → Available Software Sites**
   - Enable or create site: `https://download.eclipse.org/lyo/product/p2/edge`
   - Click **Apply and Close**

3. **Update Application**
   - Select **Help → Check for Updates**

### Plugin Installation

For plugin installations, use the edge update site:
`http://download.eclipse.org/lyo/p2/edge/`

## Verification

After installation, verify Lyo Designer is working:

1. **Create New Project**
   - **File → New → Other → Lyo → Lyo Modelling Project**

2. **Check Code Generation**
   - Right-click on model file → **Lyo → Generate Complete Lyo-based Application**

3. **Validate Modeling Tools**
   - Open `.aird` files to access the modeling perspective

## Next Steps

Once Lyo Designer is installed:

- [Lyo Designer Overview](designer.md) - Understanding the tool
- [Modelling How-To](modelling-howto.md) - Create your first model
- [Setup Development Environment](setup.md) - Configure your workspace

## Getting Help

- **[Lyo Forum](https://forum.open-services.net/)** - Community support
- **[GitHub Issues](https://github.com/eclipse/lyo.designer/issues)** - Bug reports
- **[Eclipse Lyo Documentation](https://eclipse.org/lyo/docs/)** - Official documentation

## Update Schedule

!!! info "Release Cycle"
    - **Stable releases**: Quarterly
    - **Edge builds**: Weekly (development snapshots)
    - **LTS releases**: Annually

Check the [Lyo release page](https://github.com/eclipse/lyo/releases) for the latest version information.
