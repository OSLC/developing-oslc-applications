<div class="notice">
  <div class="header">
    <h2 class="title">Developing an OSLC adaptor for Watson IoT Platform</h2>
  </div>
  <div class="content">
    iotp-adapter is an OSLC server that exposes IBM Watson IoT Platform resources as OSLC resources. The Developer Guid explains how this server was developed and integrated with the IBM jazz.net applications.
  </div>
</div>



# Introduction

See the [iotp-adaptor User Guide](./userGuide/user-guide) for information on how to install, configure, administer and use the iotp-adaptor OSLC server. This Developer Guide explains how the adaptor was build and integrated with the IBM CE jazz.net applications. The source code is available in a the GitHub [iotp-adaptor Project](https://github.com/OSLC/iotp-adaptor).

iotp-adaptor was designed and initially created using the [eclipse/Lyo Designer](https://github.com/eclipse/lyo.designer/wiki). This tool using model-based development techniques to generate an OSLC server implementation with a minimal Web UI "debug" application that allows you to browse the OSLC services and adapted resources. The code generator uses [M2T](https://www.eclipse.org/modeling/m2t/) templates that were developed using the eclipse/Lyo [OSLC4J Bugzilla](https://wiki.eclipse.org/Lyo/BuildOSLC4JBugzilla) sample application.

The Lyo Designer code generator creates an [OSLC Core 2.0](https://archive.open-services.net/bin/view/Main/OslcCoreSpecification) compliant OSLC server. This server is sufficient to explore the adapted resources using OSLC capabilities, but it is not enough to be able to integrate that server with the IBM jazz.net based applications. Additional considerations must be addressed in order to integrate with these applications including:

* Providing a rootservices document for discovering server discovery capabilities
* Establishing Consumer/Friend relationships using OAuth to allow servers to interact
* Creating project area artifact container associations to enable linking between jazz.net CE tools and OSLC resources provided by adaptors
* What link types are available in each of the applications based on the chosen artifact container association
* Specific integration requirements of each CE application (RDNG, RTC and RQM) that you need to know to get the integrations working
* Creating a TRS provider that can contribute to IBM [RELM](https://www.ibm.com/support/knowledgecenter/en/SS2L6K_6.0.5/com.ibm.team.jp.relm.doc/topics/c_node_product_relm.html) and [LQE](https://www.ibm.com/support/knowledgecenter/en/SS2L6K_6.0.5/com.ibm.team.jp.lqe2.doc/topics/t_lqe_admin.html).

The iotp-adaptor Developer Guide walks through all of these considerations and provides example solutions. Here's an overview of each of the sections in the Developer Guide:

* [eclipse environment setup](./environment-setup.html): describes how to setup an eclipse development environment for developing the model and code. Eclipse is required in order to use Lyo Designer, which is an eclipse plug-in.
* [The toolchain model](./toolchain-model.html) - describes the design of the Watson IoT Platform OSLC domain model, and the model of the OSLC services that are provided
* [Generating the server code](./code-generator.html) - explains how to generate the server implementation using the Lyo Designer code generator with additional details for managing embedded user code.
* [Exploring the generated code](./exploring-the-code.html)  - looks at the structure of the iotp-adaptor eclipse project, and discusses the key folders and files of the generated application.
* [https and SSL support](./ssl-support.html) - discusses the important topic of secure connections and how to configure the Web application to support SSL, and how to manage self-assigned certificates.
* [Authentication](./authentication.html) - addresses the often sticky problem of end-user login as well as server-to-server connections through OAuth.
* [Creating the rootservices document](./rootservices.html) - Describes how to provide a rootservices document which is required to establish consumer/friend connections between the jazz.net applications (primarily the Jazz Team Server) and the iotp-adaptor.
* [Connecting Servers](./consumer-friend.html) - describes how to create a consumer/friend relationship using OAuth in order to establish server-to-server communications with jazz.net applications
* [Artifact Container Associations](./artifact-container-associations.html) - describes how to configure jazz.net application project areas so they are able to access OSLC services provided by iotp-adaptor
* [Updating generated dialogs](./dialogs.html) - explains how to customize the preview and delegated dialogs created by the Lyo Designer code generator
* [Implementing a Domain Class](./implement-domain-class.html) - summarizes all of the user code that needs to be developed to implement an adaptor domain class, using DeviceType as an example.
* [Implementing a TRS Provider](./trs-provider.html) - provides and overview of the design and implementation of the iotp-adaptor TRS provider
* [JUnit Tests](./junit-tests.html) - describes an example of a typical JUnit test that tests the OSLC CRUD operations of an IoT Platform resource.

# Resources

* [OSLC Web Site](https://open-services.net)
* [OSLC Developer Guide](http://oslc.github.io/developing-oslc-applications/)
* [OSLC Primer](https://archive.open-services.net/primer)
* [eclipse/Lyo Project](https://www.eclipse.org/lyo/)
* [Lyo Designer](https://github.com/eclipse/lyo.designer/wiki)
* [OSLC Swagger.io](https://github.com/OSLC/OSLC-API)
* [OSLC GitHub Organization](https://github.com/OSLC)
* [iotp-adaptor Project](https://github.com/OSLC/iotp-adaptor)

# Call for Contrubtion

This documentation site is under continuous development as we discover more information about how to develop OSLC clients and servers that integrate with the jazz.net applications. We encourage you to contribute if you find something missing, incorrect, or unclear. You can email suggestions to [Jim Amsden](mailto:jamsden@us.ibm.com).
