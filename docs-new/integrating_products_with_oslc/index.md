# Integrating products with OSLC - Tutorial Overview

<!-- omit in toc -->
## Table of Contents

- [Introduction](#introduction)
- [Audience](#audience)
- [Sample applications](#sample-applications)

## Introduction

*Older version of the tutorial for Lyo 2.1 can be [downloaded as pdf](integrating_with_oslc_tutorial.pdf).*

This tutorial explains how to implement OSLC consumers and providers by examining realistic use cases and showing how to implement OSLC specifications with lots of examples and working code. 

> **WARNING!** This tutorial targets Lyo 2.2 and has not been updated to run on Lyo 5.0, the currently supported version. Please post [on the forum](https://forum.open-services.net/c/sdks/lyo/9) if you encounter any problems in the tutorial!

This tutorial walks you through a fully developed adapter, with no need to code. If you want to have a more hands-on approach, you can refer to the complementary [hands-on tutorial](https://github.com/eclipse/lyo.docs/blob/master/lyo-rest-workshop/Lab1/Lyo_OSLC_Workshop.pdf) takes you through the incremental programming steps.

It is organized into the following parts:

1. This introduction
2. [__A brief overview of OSLC__](overview_of_oslc.md)
3. [**Downloading and starting the sample applications**](running_the_examples.md)
3. [**Part 1**, turning Bugzilla into a provider of the Change Management OSLC specification](implementing_an_oslc_provider/1_0_implementing_a_provider.md). We'll walk through the architecture of the integration, create OSLC catalogs and representations, provide delegated UIs, and allow you to create Bugzilla bugs programmatically.
4. [**Part 2**, turning a home-grown application into a consumer of the Change Management OSLC specification](integrating_with_an_oslc_provider/2_0_implementing_consumer.md) that works with the Bugzilla adapter from Part 1. We'll implement links to Bugzilla bugs, UI previews, delegated UIs, and automated bug creation.

## Audience

This tutorial is for people who will be writing code to implement OSLC consumers and providers; we assume the following about you:

+ You understand the basics of software development, web architecture, HTTP, [linked data](http://youtu.be/40mjwqGEKBU), and [RDF](http://www.youtube.com/watch?v=Nk9TOx1sBUk&feature=share&list=PLpqpu1CS6Rj4dRKWX1UICKseBq_20nk6k)
+ You want to learn more about OSLC
+ You can follow examples in XML, JSON, HTML, and JavaScript
+ You can understand server-side programming languages, particularly in Java and JSP (see below)
+ You want to learn more about how [Eclipse Lyo](../eclipse_lyo/eclipse-lyo) can help you more quickly develop OSLC-driven integrations

> **On the choice of server-side programming language** 
> Although our sample applications use Java and JSP, many of the methods of
> implementing OSLC are the same regardless of your choice of server-side
> programming-language. Later versions of this document might expand to other
> languages and platforms. OSLC is a community effort and we'd love your help
> in adding examples in different programming languages to this tutorial (or
> other material) to help those on other platforms such as Perl, PHP, Python,
> Ruby, or .Net.  

## Sample applications

You can follow along with the OSLC Tutorial by using the following software:

- Bugzilla: a common open-source defect tracking application. In this tutorial,
  you will configure a running Bugzilla system using Docker if you do not want
  to set up your own Bugzilla application.
- OSLC4J Bugzilla adapter: a full-featured adapter that presents Bugzilla bugs
  as OSLC Change Management v2 resources. In our examples, we assume the
  Bugzilla adapter is running at
  [http://localhost:8080/OSLC4JBugzilla](http://localhost:8080/OSLC4JBugzilla)
- NinaCRM: A simple, fictional Customer Relationship Management (CRM) system
  that hosts OSLC UI Preview and OSLC Delegated UI examples, implemented as a
  Java EE web application. In our examples, we assume that NinaCRM is running
  at [http://localhost:8181/ninacrm](http://localhost:8181/ninacrm)
- Poster browser plugin (for
  [Firefox](https://addons.mozilla.org/en-US/firefox/addon/poster/) or
  [Chrome](https://chrome.google.com/webstore/detail/chrome-poster/cdjfedloinmbppobahmonnjigpmlajcd)):
  we will browse and manipulate OSLC resources with this plugin that makes it
  easy to issue HTTP requests and set custom headers. An alternative for
  Firefox is
  [RESTClient](https://addons.mozilla.org/en-us/firefox/addon/restclient/).

For more information, see our section about [downloading, building, and starting the NinaCRM and OSLC4J Bugzilla applications](running_the_examples).

Get Started: [A brief overview of OSLC](overview_of_oslc)
- Automated bug creation workflows

## Getting Started

1. **[OSLC Overview](overview_of_oslc.md)** - Brief introduction to OSLC concepts
2. **[Running Examples](running_the_examples.md)** - Download and start sample applications
3. **[Provider Tutorial](implementing_an_oslc_provider/1_0_implementing_a_provider.md)** - Begin with provider implementation
4. **[Consumer Tutorial](integrating_with_an_oslc_provider/2_0_implementing_consumer.md)** - Continue with consumer implementation

## Target Audience

This tutorial is designed for developers who will implement OSLC consumers and providers. We assume you have:

### Required Knowledge
- **Software Development**: Understanding of web architecture and HTTP
- **Linked Data**: Familiarity with [linked data concepts](http://youtu.be/40mjwqGEKBU)
- **RDF**: Basic understanding of [RDF principles](http://www.youtube.com/watch?v=Nk9TOx1sBUk&feature=share&list=PLpqpu1CS6Rj4dRKWX1UICKseBq_20nk6k)
- **Web Technologies**: Can follow XML, JSON, HTML, and JavaScript examples
- **Server Programming**: Understanding of Java and JSP (see language note below)

### Learning Goals
- **OSLC Implementation**: Practical OSLC consumer and provider development
- **Eclipse Lyo**: How to use [Eclipse Lyo](../eclipse_lyo/index.md) for faster development
- **Integration Patterns**: Real-world OSLC integration approaches

!!! note "Programming Language Choice"
    While sample applications use Java and JSP, OSLC implementation principles apply across programming languages. Future versions may include examples in Perl, PHP, Python, Ruby, or .NET.
    
    **Community Contribution Welcome**: Help us add examples in different languages!

## Sample Applications

The tutorial uses these applications to demonstrate OSLC concepts:

### Core Applications

| Application | Purpose | Default URL |
|-------------|---------|-------------|
| **Bugzilla** | Open-source defect tracking | Configurable via Docker |
| **OSLC4J Bugzilla Adapter** | Full OSLC Change Management v2 provider | `http://localhost:8080/OSLC4JBugzilla` |
| **NinaCRM** | Fictional CRM system demonstrating consumer patterns | `http://localhost:8181/ninacrm` |

### Development Tools

| Tool | Purpose | Platform |
|------|---------|----------|
| **Poster** | HTTP request testing and manipulation | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/poster/) / [Chrome](https://chrome.google.com/webstore/detail/chrome-poster/cdjfedloinmbppobahmonnjigpmlajcd) |
| **RESTClient** | Alternative HTTP client | [Firefox](https://addons.mozilla.org/en-us/firefox/addon/restclient/) |

### Application Details

#### Bugzilla
- **Type**: Defect tracking system
- **Role**: Data source for OSLC integration
- **Setup**: Docker-based for easy configuration
- **Features**: Complete bug lifecycle management

#### OSLC4J Bugzilla Adapter
- **Type**: OSLC Provider
- **Specification**: Change Management v2
- **Features**: 
  - Full CRUD operations on bugs
  - Delegated UI for bug creation/selection
  - Resource shape definitions
  - Query capabilities

#### NinaCRM
- **Type**: OSLC Consumer
- **Role**: Demonstrates consumer integration patterns
- **Features**:
  - UI Preview implementation
  - Delegated UI integration
  - Link management
  - Automated workflows

## Getting the Applications

For detailed setup instructions, see **[Running the Examples](running_the_examples.md)**.

### Quick Start

1. **Download Applications**
   - Clone repositories or download packages
   - Follow setup instructions for each component

2. **Configure Environment**
   - Set up Docker for Bugzilla (optional)
   - Configure application servers
   - Verify network connectivity between applications

3. **Install Browser Tools**
   - Install Poster or RESTClient for HTTP testing
   - Configure tools for OSLC resource manipulation

## Legacy Resources

!!! info "Historical Tutorial"
    An older version targeting Lyo 2.1 is available as **[PDF download](integrating_with_oslc_tutorial.pdf)** for reference.

## Prerequisites Checklist

Before starting the tutorial, ensure you have:

- [ ] Basic understanding of web development concepts
- [ ] Familiarity with HTTP protocols and REST APIs
- [ ] Knowledge of linked data and RDF fundamentals
- [ ] Java development environment (for code examples)
- [ ] Web browser with HTTP testing extensions
- [ ] Eclipse IDE (recommended for Eclipse Lyo development)

## Tutorial Navigation

### Next Steps

1. **[OSLC Overview](overview_of_oslc.md)** - Start with OSLC fundamentals
2. **[Setup Applications](running_the_examples.md)** - Configure your development environment
3. **[Provider Implementation](implementing_an_oslc_provider/1_0_implementing_a_provider.md)** - Begin building OSLC providers

### Related Resources

- **[Eclipse Lyo Documentation](../eclipse_lyo/index.md)** - Complete Lyo development guide
- **[Technical Foundations](../technical-foundations.md)** - OSLC technical concepts
- **[Sample Applications](../samples.md)** - Additional code examples
- **[OSLC Specifications](https://docs.oasis-open.org/oslc-domains/)** - Official specification documents

## Community and Support

- **[OSLC Forum](https://forum.open-services.net/)** - Community discussions and support
- **[Eclipse Lyo](https://eclipse.org/lyo/)** - Official Lyo project page
- **[GitHub Repositories](https://github.com/eclipse/lyo)** - Source code and issue tracking

---

**Ready to begin?** Start with the **[OSLC Overview](overview_of_oslc.md)** to understand the foundations, then proceed to **[Running the Examples](running_the_examples.md)** to set up your development environment.
