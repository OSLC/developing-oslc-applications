Eclipse Lyo promotes the use of Linked Data principles and the [OSLC](http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/oslc-core-v3.0-part1-overview.html) (Open Services for Lifecycle Collaboration) standard for publishing lifecycle data, to enable the interoperability of heterogeneous products, services, and other distributed network resources.
The open OASIS OSLC standard is based on a RESTful architecture and Linked Data principles, such as those defined in the RDF family of specifications, and the [W3C Linked Data Platform](https://www.w3.org/TR/ldp/).

Eclipse Lyo supports Java developers with the development of REST-based servers and clients that need to share heterogeneous information as [RDF resources][rdfprimer11].

**What is OSLC?** For details on the OASIS OSLC standard, see the [various resources on open-services](http://open-services.net/resources/), or the [oslc Core 3.0 specification](http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/oslc-core-v3.0-part1-overview.html).

### OSLC4J SDK

Lyo’s central component is the OSLC4J SDK (Software Development Kit) that helps build REST-based servers and clients, compliant with the OSLC standard.

The library provides:

* Annotations that automate the marshaling/unmarshaling of Java objects to/from Linked Data RDF resources ([Apache Jena](https://jena.apache.org/) model).
* Annotations that allow servers to publish their RESTful API capabilities, based on the [OSLC Discovery][oslcv3discovery] approach. This in turn facilitates for clients to discover and use available capabilities.
* JAX-RS Providers and utility classes to facilitate the development of REST operations for accessing, creating, updating and deleting RDF resources.

### Lyo Designer

[Lyo Designer](./eclipse-lyo/lyo-designer) is an Eclipse plugin that allows one to graphically model (1) the overall system architecture, (2) the information model of the RDF resources being shared, and (3) the individual services and operations of each Server in the system. The figure below shows the information modelling interface:

![An example domain specification diagram](./eclipse-lyo/images/LyoToolchainModel-SpecificationDiagram.png){width="800"}

Lyo Designer includes a integrated code generator that synthesizes the model into almost-complete OSLC4J-compliant running implementation.
The resulting code includes:

* Java classes with appropriate OSLC4J-annotations to reflect the modelled RDF resource shapes
    * This automates the marshaling/unmarshaling of Java instances as Linked Data RDF resources.
* JAX-RS Service operations for accessing, updating, creating and deleting RDF resources.
    * These operations handle any of the supported formats (turtle, RDF/XML, Json, etc.)
    * For debugging purposes, JSP pages are also produced to deliver HTML representations of all RDF resources.
* JAX-RS Service operations to completely handle [Delegated UI](http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/cs01/part4-delegated-dialogs/oslc-core-v3.0-cs01-part4-delegated-dialogs.html) for both creation and selection dialogs.
    * Including the initial generation of basic JSP pages for the html-representation of the dialogs.
* JAX-RS Service operations to handle [Resource Preview](http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/cs01/part3-resource-preview/oslc-core-v3.0-cs01-part3-resource-preview.html)
    * Including the initial generation of basic JSP pages for the html-representation of the resource previews.

Lyo Designer supports incremental development, where manual changes to the generated code are preserved upon changes to the model, and subsequent code regeneration.


### Tutorials and Documentation

#### Installation

* How to [setup the Eclipse environment](./eclipse-lyo/general-setup-for-oslc4j-development) for Lyo-based development
* How to [create an initial REST server application](./eclipse-lyo/create-an-oslc4j-project), ready for Lyo-based development
* How to [install Lyo Designer](./eclipse-lyo/installing-lyo-designer)

#### Basic Topics

* How to [use Lyo Designer](./eclipse-lyo/user-manual-for-toolchain-modelling) to model a toolchain and generate an initial code base
* How to [use Lyo Designer](./eclipse-lyo//user-manual-for-domain-specification-modelling) to model domain specifications, and generate OSLC4J-annotated Java classes to reflect the defined OSLC Resources. 
* How to implement an [Tracked Resource Set (TRS)](https://wiki.eclipse.org/Lyo/TRSWorkshop) OSLC server

#### Example OSLC Servers

Lyo also includes instructions and source code for a range of OSLC Server implementations:

* [Bugzilla](https://wiki.eclipse.org/Lyo/BuildOSLC4JBugzilla) - an example of what Eclipse Lyo can be used for, in the form of an OSLC-CM compatible adapter for the Bugzilla bugtracker application. It wraps Bugzilla (interacting with it through Bugzilla's native XMLRPC API) with an OSLC-CM provider server accessible through REST calls.
* [Sample OSLC client](https://wiki.eclipse.org/Lyo/BuildClient) - that demonstrates how to use the Lyo client to interact with OSLC Service Providers in various ways.
* [SharePoint](https://wiki.eclipse.org/Lyo/SharepointAdapter) - This SharePoint adapter looks through the sharepoint OData collections for collections where the ContentType is defined as "Document". For each SharePoint library that contains documents, an OSLC service provider is created with the basic services for OSLC Delegated dialogs for selection and creation as well as listing the documents with a UI preview.
* The [Hudson and Jenkins](https://wiki.eclipse.org/Lyo/JenkinsPlugin) adapor implements the OSLC Automation specification.
* [Simulink](https://wiki.eclipse.org/Lyo/Simulink)
* [MagicDraw](https://wiki.eclipse.org/Lyo/MagicDraw)
* The [Lyo LDP reference implementation](https://wiki.eclipse.org/Lyo/BuildLDPSample) - is a sample Java implementation of the W3C Linked Data Platform 1.0 Candidate Recommendation using JAX-RS (Apache CXF) and Jena TDB.

### What is OSLC?

For an introduction to the OASIS OSLC standard:

* [Integrating products with OSLC](http://open-services.net/resources/tutorials/integrating-products-with-oslc/) - A tutorial that explains how to implement OSLC Servers and Clients, with lots of examples and working code.
* [Linked Data and OSLC Tutorial](http://open-services.net/linked-data-and-oslc-tutorial-2015-update/) - A video introducing Linked Data and OSLC.
* [Introduction to OSLC and Linked Data](http://open-services.net/resources/presentations/introduction-to-oslc-slideshow/) - A slides presentation introducing OSLC.


### Additional components

Additional components of the Lyo project include:

**OSLC Client** provides helpful APIs to interact with OSLC Servers. It provides an additional layer of functionality on top of Apache HttpClient, Apache Wink, and OSLC4J that can give you a head start on some of the common use cases such as form login, OAuth handling, service discovery, sending queries, and processing query results. Io order to use it, include the following dependency from the Eclipse Maven repositories:

```xml
<dependency>
    <groupId>org.eclipse.lyo.clients</groupId>
    <artifactId>oslc-java-client</artifactId>
    <version>2.2.0</version>
</dependency>
```

Find more information in the [Javadocs](https://download.eclipse.org/lyo/docs/client/2.2.0/overview-summary.html).

Other components:

* [OSLC Tracked Resource Specification (TRS) SDK](https://wiki.eclipse.org/Lyo/TRSSDK) - provides a simple set of java beans that represent the entities within the TRS specification.
> TODO current TRS libs live under the Lyo core.
* [Lyo Store](https://github.com/eclipse/lyo-store) - a library that provides a simple interface for working with a triplestore via Java objects representing OSLC Resources.
* [Test Suite](https://wiki.eclipse.org/Lyo/LyoTestSuite) - provides a suite of tests which will test OSLC domain provider implementations against the specification.
* [Reference Implementations](https://wiki.eclipse.org/Lyo/BuildingOSLC4J) - See how OSLC works directly with working samples and with a simple server to test against.
> TODO is it a typo?
* [_Reference Implementations (OUTDATED)_](Lyo/LyoRIO) - a simple, bare-bones reference implementation of the OSLC specifications. RIOs are intended to help those who are adopting OSLC by providing a functioning system that can be explored via a simple UI and REST services, or by taking a look at the source code.
* [Lyo OSLC Perl library and samples](https://wiki.eclipse.org/Lyo/LyoPerl)
* [_OSLC4JS Javascript OSLC library (experimental)_](https://wiki.eclipse.org/Lyo/Oslc4Js).
    - [OSLC4JS architecture](http://oslc.github.io/developing-oslc-applications/oslc-open-source-node-projects.html)
    - [Development with OSLC4JS](https://wiki.eclipse.org/DevelopingOslc4Js)


### Working from Source Code

* [ Working with Lyo Designer from source code](https://wiki.eclipse.org/Lyo/modelling_and_generation/working_from_source_code)
    * [Eclipse Setup when working with source code](https://wiki.eclipse.org/Lyo/modelling_and_generation/working_from_source_code#Eclipse_Setup_when_working_with_source_code)
* [Building and using OSLC4J from source code](https://wiki.eclipse.org/Lyo/BuildingOSLC4J) (Including running sample code and reference implementations)
* [Building and using Lyo Client from source code](https://wiki.eclipse.org/Lyo/BuildClient) (Including running sample code)
* [Building and running the **\*old\*** reference implementations (RIOs)](https://wiki.eclipse.org/Lyo/BuildRIO)
* [Building and running the OSLC test suite](https://wiki.eclipse.org/Lyo/BuildTestSuite)

### Contributing to Lyo

* Introduce yourself on the [Lyo development mailing list](mailto:lyo-dev@eclipse.org)
* Open a new [Lyo Bugzilla ticket](https://bugs.eclipse.org/bugs/enter_bug.cgi?product=Lyo)
    (you may check [existing open tickets first](https://bugs.eclipse.org/bugs/buglist.cgi?bug_status=UNCONFIRMED;bug_status=NEW;bug_status=ASSIGNED;bug_status=REOPENED;product=Lyo))
* To contribute code, see the [ Lyo Contributor's Guide](https://wiki.eclipse.org/Lyo/ContributorsGettingStarted) and [ Tips for Working with Git](https://wiki.eclipse.org/Lyo/GitTips).
* [Eclipse Lyo Release Process](https://wiki.eclipse.org/Lyo/ReleaseReviews)


### Project Plans

[Lyo project plan for Lyo 1.0-2.1.2](https://wiki.eclipse.org/Lyo/ProjectPlans)

After 2.1 there was a plan for immediate Lyo 3 release, but it was not picked up eagerly enough. Right now the new roadmap continues to make 2.x releases.

[Lyo 2.3+ roadmap][lyo23roadmap] (updated on 2017-07-29).



[rdfprimer11]: https://www.w3.org/TR/rdf11-primer/
[oslcv3discovery]: http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/cs01/part2-discovery/oslc-core-v3.0-cs01-part2-discovery.html
[lyo23roadmap]: https://docs.google.com/document/d/e/2PACX-1vSglX92r6OvjHvQZDpq8fxarTkYGsdBCjX23HOOfkMHYb9g_qPO5x-q1DCTkAJbeHsFVOqCYfyIVN-M/pub