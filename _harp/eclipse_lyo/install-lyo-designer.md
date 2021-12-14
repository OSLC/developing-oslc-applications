# Installing Lyo Designer

1. Make sure you have Java 8 installed on your platform.
1. Download the Lyo Designer application for your target operating system from [Lyo download site](https://download.eclipse.org/lyo/product/binaries/stable/)
1. Unzip your download to any desired application. 
1. Run the lyodesigner executable.
1. Regularly try to update the application by selecting ***help\--\>Check for Updates***

## Installing as plugins on an Eclipse installation
You can also install Lyo Designer as a set of plugins into an existing Eclipse installation.
This is recommended for advanced users that can deal with conflicts in plugin dependencies when installing multiple plugins.

The Modelling environment and code generator are known to work on Eclipse
versions up until Eclipse 2020-09 (v4.18).

The easiest way to install Lyo Designer is via the update-site
`http://download.eclipse.org/lyo/p2/stable/`. (This URL is intended to
be accessed via the Eclipse update functionality, and not via a web
browser.)

1. First make sure your Eclipse environment is setup
as expected for general Lyo-based development, as instructed in [Eclipse Setup for Lyo-based Development](./eclipse-setup-for-lyo-based-development)
1.  Select ***Help \--\> Install New Software\...***
1.  Set ***Work With:*** to the update site
    <http://download.eclipse.org/lyo/p2/stable/>
1.  Select both features (1) ***Lyo Code Generator*** and (2) ***Lyo
    Toolchain Designer***.
1.  Proceed with the installation steps.
1.  Install the following plugins
    * Acceleo
    * Sirius Integration with Xtext
    * Sirius Properties Views - Runtime Support
    * Sirius Properties Views - Specifier Support
    * Sirius Specifier Environment

**Problems installing?**: If you face problems installing the plugin
    (or when updating to a new version), try one of the following:
    1.  check the \"Contact all update sites during install to find
        required software\" option
    2.  check/uncheck "Group items by category" (particularly the case,
        if you get the message "there are no categorized items")
    3.  uninstall existing version and then re-install the plugin again.

# Bleeding edge

**USE AT YOUR RISK**

You can configure the Lyo Designer application to get updates from yet-unreleased builds of Lyo Designer.
1. Select ***Window\--\>Preferences***
1. Select ***Install/Update\--\>Available Software Sites***
1. Either enable or create a new site with the location <https://download.eclipse.org/lyo/product/p2/edge>
1. Click ***Apply and Close***.
1. Update the appliation by selecting ***help\--\>Check for Updates***

## Lyo Designer Plugins

For Lyo Designer installed as plugins, you can specify the update site <http://download.eclipse.org/lyo/p2/edge/>.
