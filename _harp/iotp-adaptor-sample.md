iotp-adaptor is a partial implementation of an OSLC adapter for IBM Watson IoT Platform resources developed using eclipse/Lyo Designer. This adaptor provides an example of how to build an OSLC adaptor using [Lyo Designer](https://github.com/eclipse/lyo.designer/wiki), and how to customize the generated adaptor to expose Watson IoT Platform resources through OSLC capabilities and enable integration with IBM's jazz.net based [Continuous Engineering](https://jazz.net/products/continuous-engineering-solution/) solution.  

The [iotp-adaptor project](https://github.com/OSLC/iotp-adaptor) provides source code for a subset of [IBM Rational Engineering Lifecycle Manager](https://jazz.net/products/rational-engineering-lifecycle-manager/) (CE) version 6.0.6. The intent of providing this source code and documentation is help others who are developing OSLC integrations with IBM offerings. The [Developer Guide](./iotp_adaptor/developer-guide) provides the additional information you need to integrate OSLC clients and servers with the IBM jazz-based applications. This includes:

* Providing a rootservices document for discovering server discovery capabilities
* Establishing Consumer/Friend relationships using OAuth to allow servers to interact
* Creating project area artifact container associations to enable linking between jazz.net CE tools and OSLC resources provided by adaptors
* What link types are available in each of the applications based on the chosen artifact container association
* Specific integration requirements of each CE application (RDNG, RTC and RQM) that you need to know to get the integrations working

[iotp-adaptor User Guide](./iotp_adaptor/userGuide/user-guide) is a simple user's guide for installing, configuring, administering and using iotp-adapter with the CE tools.

[iotp-adaptor Developer Guide](./iotp_adaptor/developer-guide) provides the complete documentation on how the server was developed.

## What is an Adaptor?

Developing integrations using OSLC follows a number of common patterns:

* **Facade** - OSLC native implementation in the tool or through a plugin using tool’s extensibility mechanisms - very tool specific
* **Mediator** - OSLC adapter for the tool (tool responsible for storage) - using Lyo Designer, factors out all OSLC capabilities and requires only implementation of connector manager.
* **Data mining** - into common OSLC manager (e.g. Rational Design Manager, MID Smartfacts) can result in data redundancy and ETL overhead
* **Synchronization** - of common or overlapping data between tools - limited traceability and impact analysis (e.g., Tasktop Integration Hub)

An OSLC adaptor (or adapter) follows the Mediator pattern. The adaptor can be quite simple: providing only OSLC capabilities and delegating all user management, persistence and user interaction to the integrated tools. Or the adaptor can be quite complex: providing OSLC capabilities on one or more adapted data sources, but also providing an integration hub with its own storage facilities, user management and UI in order to support integrations that are not possible or appropriate to implement in the individual tools.

This range of adaptors represents a continuum between enabling and supporting integration. Enabling integration is primarily about providing OSLC capabilities on data sources in order to link resources across tools. These OSLC capabilities or services include:

* **CRUD operations** - on resources using RDF resource representations (provides predictable resource formats, rich semantics, and goos support for links)
* **Service discovery** - ServiceProviderCatalog, ServiceProvicers (containers of managed resources), Services that describe what OSLC capabilities are provided on what resources
* **Query Capability** – persistent independent query capability for integration
* **Delegated dialogs** – to allow an application to create and select resources in another application for the purpose of establishing links
* **Resource preview** – to provide icons and labels in order to view a link to a resource managed by another tool
* **Tracked Resource Sets** – in order to efficiently contribute data from many data sources into a single repository for cross-tool views, queries and reporting

Providing these capabilities enables the integration of OSLC based clients and servers. But supporting integration can go beyond simple enabling of links to establishing and maintaining the meaning of the links, and the ability to automate workflow based on link semantics.

iotp-adaptor is a simple OSLC adaptor that has no persistence of its own and does no user management. Login is delegated to the IBM Watson IoT Platform using your IBM Cloud credentials. All resources are stored in the Watson IoT Platform, and all links between the CE tools and the IoT Platform resources are stored in the CE tools repositories. 

Lyo Designer does generate a Web application that uses OSLC discovery to provide a "debug" interface on the OSLC representations of the IoT Platform resources. See [Generated Debug Web App](./iotp_adaptor/userGuide/debug-interface) for details. This generated Web application could be extended to provide additional UI and integration capabilities that could compliment the Watson IoT Platform UI. However this is not necessary in this case because the Watson IoT Platform already provides a sufficient Web UI. 

Other adaptors may need additional UI, workflow scripting and other capabilities. Lyo Designer can be used to create a starting point for such applications. 




