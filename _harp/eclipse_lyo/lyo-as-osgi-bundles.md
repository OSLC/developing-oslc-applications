# Lyo As OSGI Bundles

This is an experimental setup.

## Installing Lyo components as plugins on an Eclipse installation

This setup is known to work on Eclipse
version [Eclipse 2020-12](https://www.eclipse.org/downloads/packages/release/2020-12/r/eclipse-ide-enterprise-java-developers).

1. Make sure your Eclipse environment is setup
as expected for general Lyo-based development, as instructed in [Eclipse Setup for Lyo-based Development](./eclipse-setup-for-lyo-based-development)

1. Install Jersey plugins from Orbit
    1.  Select ***Help \--\> Install New Software\...***
    1.  Set ***Work With:*** to the update site
        <https://download.eclipse.org/tools/orbit/downloads/drops/R20201130205003/repository>
    1.  Select to install the following features
        * jersey-core-common
        * jersey-core-client
        * jersey.inject-hk2
1. Install the Lyo plugins 
    1.  Select ***Help \--\> Install New Software\...***
    1.  Set ***Work With:*** to the update site
        <https://download.eclipse.org/lyo/bundle/p2/stable/>
    1.  Select to plugins you need
        * Lyo Core
        * Lyo Client
        * Lyo Store

# Bleeding edge

**USE AT YOUR RISK**

You can choose to use the following update sites to get updates from yet-unreleased builds of Lyo plugins:

    * <https://download.eclipse.org/lyo/bundle/p2/edge/> 
    * <https://download.eclipse.org/lyo/bundle/p2/superedge/>
