# Installing Lyo Designer

## Installing from a ready-built package (recommended)

1. Make sure you have Java 17 installed on your platform.
1. Download the Lyo Designer application for your target operating system from
   the [stable](https://download.eclipse.org/lyo/product/binaries/stable/)
   track (recommended) or
   [development](https://download.eclipse.org/lyo/product/binaries/edge/) track
   (normally, at your risk, unless instructed by the dev team). 
1. Unzip your download to any desired application. 
1. Run the `lyodesigner` executable.
1. Regularly try to update the application by selecting ***Help → Check for
   Updates***

!!! tip "Pro tip: which Lyo Designer version do I need?"
    Normally, you want the latest stable version as linked above.

    The latest development version is usually a risky choice, but could be good to access latest features (esp. if there was no stable release in the last 6 months), or to open projects that are using the development version already (e.g., we normally apply latest development version of Lyo Designer on the Reference Implementation project).

    Older versions may be useful to open an older project where its import crashes in the newer versions of Lyo Designer. Normally, this should not happen - latest versions of Lyo Designer can recognize older versions of the metamodel and display warnings when some parts of the opened model need to me updated. Older versions can be downloaded from the [Releases](https://download.eclipse.org/lyo/product/binaries/releases/) page. 

## Installing as plugins on an Eclipse installation

You can also install Lyo Designer as a set of plugins into an existing Eclipse
installation. This is recommended for advanced users that can deal with
conflicts in plugin dependencies when installing multiple plugins.

Prerequisites: the Modelling environment and code generator are known to work on Eclipse
versions up until Eclipse 2022-03.

Installation steps:

1. First make sure your Eclipse environment is setup as expected for general
Lyo-based development, as instructed in [Eclipse Setup for Lyo-based
Development](./eclipse-setup-for-lyo-based-development.md)
1.  Select ***Help → Install New Software...***
1.  Set ***Work With:*** to the update site
    1. Use `http://download.eclipse.org/lyo/p2/stable/` for the stable build (recommended) 
    1. Use `https://download.eclipse.org/lyo/product/p2/edge` for the latest unreleased build (use at your risk!)
1.  Select both features (1) ***Lyo Code Generator*** and (2) ***Lyo Toolchain
    Designer***.
1.  Proceed with the installation steps.
1.  Install the following plugins
    * Acceleo
    * Sirius Integration with Xtext
    * Sirius Properties Views - Runtime Support
    * Sirius Properties Views - Specifier Support
    * Sirius Specifier Environment

!!! question "Problems installing?"
    If you face problems installing the plugin (or when
    updating to a new version), try one of the following:

    1. Check the "Contact all update sites during install to find required
      software" option.
    2. Check/uncheck "Group items by category" (particularly the case, if you get
      the message "there are no categorized items").
    3. Uninstall existing version and then re-install the plugin again.

## Switching to development track plugins at a later point

**USE AT YOUR RISK**

You can configure the Lyo Designer application to get updates from
yet-unreleased builds of Lyo Designer.

1. Select ***Window → Preferences***
1. Select ***Install/Update → Available Software Sites***
1. Either enable or create a new site with the location
   <https://download.eclipse.org/lyo/product/p2/edge>
1. Click ***Apply and Close***.
1. Update the application by selecting ***help → Check for Updates***

## Running from source

If you wish to alter the source code of Lyo Designer (e.g., to contribute new
features) or the generator templates (to update the structure of the generated
code), you will need to [run Lyo Designer from
source](https://github.com/eclipse/lyo.designer/wiki/Working-from-Source-Code).