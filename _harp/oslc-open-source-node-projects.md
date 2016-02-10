# OSLC4JS: OSLC Open Source Node.js Projects

OSLC is designed to add a layer on top or Linkded Data Platform (LDP) and HTTP to support simple, easy to develop and easy to use, loosely coupled integration between system and application development and lifecycle management tools. As described in previous content on this site, Eclipse/Lyo provides a set of Java based APIs and generative tools to support the creation of OSLC domain servers and integrated client applications. While Eclipse/Lyo provide a very rich and robust platfrom for OSLC development, it has a relatively high learning curve and that can increase development time, costs and risks. 

OSLC4JS represents a set of related Open Source projects supporting the creation and integration of OSLC based client and server applications that leverage the dynamic and asynchronous capabilities of JavaScript and Node.js. These projects provide Express.js middleware components that can be used to add OSLC and LDP services to any Express Web application. Other project use these services to create OSLC servers that can easily and dynamically adapt to any OSLC domain, extensions to domains, and/or integrations between domains. 

OSLC4JS projects cover the whole end-to-end capabilities required to build, extend and integrate Web applications that exploit OSLC integration capabilities and linked-data resources. The OSLC Browser project is a sample OSLC Web application that can act as a hub for browsing and integrating federated contribution of other OSLC servers. It provides a convenient means of navigating domain objects, viewing their properties, creating new instances and updating existing resources. This browser is intended to provide a starting point for extension in order to meet specific user needs.

Two companion projects, OSLC Service and OSLC Server together provide a generic OSLC server implementation that can be configured to support any domains. You just provide the domain vocabulary and shape constraints to the server using config files that that are based on the OSLC discovery resources (Service Provider Catalog, Service Provider and Service resources). OSLC Service is an Express middleware component that is used to add OSLC capabilities to any Express server. It is used by the OSLC Server, which has a deployed instance on IBM Bluemix.

Similarly, LDP Service and LDP Server together provide and LDP implementation built on MongoDB that can be used to deploy an LDP Server. The LDP service are also used by the OSLC Service since OSLC builds on LDP. 

## Motivation

The OSLC 2.0 specifications have been finalized on open-services.net, and are implemented a significant number of successful client and server products. This certainly proves the utility and value proposition of OSLC. OASIS OSLC Core and CCM Technical Committees are currently developing the OASIS OSLC 3.0 specifications that define additional OSLC capabilities built on the W3C Linked-Data Platform. The eclipse Lyo (OSLC4J) project provides a reference implementation of the OSLC 2.0 domains, and provides Java APIs for developing client and server implementations and adapters. There is also an excellent tutorial on open-services.net that describes how to use OSLC4J to develop a Bugzilla OSLC CM provider, and the NinaCRM consumer/client that access that provider.

However, the cost of OSLC adoption is still somewhat higher then we had hopped. The OSLC4J tutorial is somewhat complex and requires users to understand a large number of Java-based technologies (eclipse, Maven, Git, Java annotations, Java EE, JAX-RS, eclipse Lyo/OSLC4J, Apache Wink, Apache CSF, etc.). These technologies are fine, but don't necessarily represent the most current approach to Web application development.

Modern Web application development currently focused on the MEAN Stack (Mongo, Express, Angular, Node). There is currently no JavaScript support for OSLC core or any of the domains. The OSLC team did develop LDP.js - an LDP server written in JavaScript and deployed on Bluemix. But this server does not support any OSLC Core or any OSLC domains. OSLC should be accessible to programmers in the development environments they are most likely to use. In the near term, that is the MEAN stack, as well as Java and JAX-RS.

The MEAN Stack, and JavaScript have some interesting characteristics that provide real advantages over Java and OSLC4J:

 * JavaScript is a scripting language that supports agile development. Along with Node.js, the entry cost may be somewhat lower compared to Java and OSLC4J.
 * JavaScript is a dynamic language which can help bridge the gap between the open-world assumptions of RDF (upon which OSLC is based) and the closed-world assumptions of Java classes. JavaScript objects are dynamic, they contain the properties that are discovered at runtime rather than the properties the developer designed into static, structure-based classes. This is a much better fit for integration development because it increases developer flexibility, fits better with the dynamic, asynchronous, reflective and discovery-based approach of OSLC, and reduces coupling between clients and servers.
 * JavaScript is a single-threaded language - there are no threads or thread synchronization issues. Rather JavaScript and Node.js are event-based programming models that are inherently asynchronous, reflecting the needs of modern, Web application development.
 * The OSLC team is already getting requests to provide a simpler, more programmer friendly, and JavaScript interface to OSLC domains. OSLC4JS is an experimental initiative to investigate building Node.js modules for OSLC core and the OSLC domains.

The goal is to minimize the cost of developing the OSLC specifications, reference implementation and test suites. The OASIS OSLC specifications would also benefit from a reference implementation in another language.

## The OSLC4JS Projects

The following sections provide a brief description of each OSLC4J sub-project and provide links to the development sites and related work products.

A [oslc4js Slack Channel](https://openintegrations.slack.com/archives/oslc4js) has been created to facilitate collaborative development of these Open Source Projects.

### OSLC Browser

A sample OSLC Web application deployed on Bluemix that uses the OSLC Service to provide a means of browsing OSLC resources. OSLC Browser allows you to configure a connection pool of contributing OSLC servers, and provides a convenient means of browsing the content contributed by those servers. The federation of this information is supported by the OSLC service with can also support OSLC domains, extension to domains, integration between domains. This allows the OSLC Browser to act as a federation hub for OSLC resources where stakeholder viewpoints, views (i.e., active dashboards) can be created to support integration needs. 

Future extensions to this browser could provide a means of categorizing and organizing lifecycle information for different needs, possibly using SKOS for knowledge organization. The moves OSLC from simply enabling point-to-point integration between tools to supporting active integration between tools without having undue impact on, or introducing unmanageable coupling between the integrated tools. 

- [Mural Design](https://app.mural.ly/t/ibm14/m/ibm14/1452806819730)
- GitHub project, Git URI
- GitHub Wiki
- IBM Track & Plan
- Bluemix App Dashboard

### OSLC Client API

A simple Node.js asynchronous OSLC client API to facilitate rich application development in JavaScript. This API may be attractive to client developers who wish to access OSLC capabilities and resources through a more logical API abstraction rather than more raw REST services.

- [GitHub project](https://github.com/OSLC/oslc-client), Git URI: https://github.com/OSLC/oslc-client.git
- [GitHub Wiki](https://github.com/OSLC/oslc-client/wiki)
- [IBM Track & Plan](https://hub.jazz.net/project/jamsden/oslc-client/track)
- npmjs.com package

### OSLC Service

A generic Node.js Express middleware OSLC 3.0 service that can support any domain and can be easily adapted to any applicable data source. This services also utilizes the LDP Service.

- [GitHub project](https://github.com/OSLC/oslc-service), Git URI: https://github.com/OSLC/oslc-service.git
- [GitHub Wiki](https://github.com/OSLC/oslc-service/wiki)
- [IBM Track & Plan](https://hub.jazz.net/project/jamsden/oslc-service/track)
- npmjs.com package

### OSLC Server

A minimal OSLC server that uses the oslc-service and ldp-service and can be accessed using a browser REST client. An instance of this server is deployed to IBM Bluemix in order to provide a platform for OSLC experimentation and testing.

- [GitHub project](https://github.com/OSLC/oslc-server), Git URI: https://github.com/OSLC/oslc-server.git
- [GitHub Wiki](https://github.com/OSLC/oslc-server/wiki)
- [IBM Track & Plan](https://hub.jazz.net/project/jamsden/oslc-server/track)
- [Bluemix App Dashboard](https://console.ng.bluemix.net/?direct=classic/#/resources/appGuid=08af38ec-37f9-4138-9fb6-3775bb56f27e&orgGuid=c4aaef36-b968-446f-9e72-d26046d28c9a&spaceGuid=b07e4db6-9a60-4423-b233-873e6e443fd6), route: http://oslc-server.mybluemix.net

### LDP App

A sample LDP Web application that uses the LDP Service and supports CRUD operations and a graph of linked data.

- [GitHub project](https://github.com/OSLC/ldp-app), Git URI: https://github.com/OSLC/ldp-app.git
- [GitHub Wiki](https://github.com/OSLC/ldp-app/wiki)
- [IBM Track & Plan](https://hub.jazz.net/project/jamsden/ldp-app/track)
- [Bluemix App Dashboard](https://console.ng.bluemix.net/?direct=classic/#/resources/appGuid=f9ff4bb4-2732-4e99-86e8-613fafe67d53&orgGuid=c4aaef36-b968-446f-9e72-d26046d28c9a&spaceGuid=b07e4db6-9a60-4423-b233-873e6e443fd6), route: http://ldp-app.mybluemix.net/

### LDP Service

Express middleware providing LDP capabilities to Web apps

- [GitHub project](https://github.com/OSLC/ldp-service), Git URI: https://github.com/OSLC/ldp-service.git
- [GitHub Wiki](https://github.com/OSLC/ldp-service/wiki)
- [IBM Track & Plan](https://hub.jazz.net/project/jamsden/ldp-service/track)
- [npmjs.com package](https://www.npmjs.com/package/ldp-service)
