# Integrating Products with OSLC - Tutorial Overview

This comprehensive tutorial explains how to implement OSLC consumers and providers through realistic use cases, working code examples, and step-by-step implementation guidance.

!!! info "Tutorial Format"
    This tutorial walks through a fully developed adapter with no coding required. For hands-on programming, see the complementary [hands-on workshop](https://github.com/eclipse/lyo.docs/blob/master/lyo-rest-workshop/Lab1/Lyo_OSLC_Workshop.pdf).

!!! warning "Version Notice"
    This tutorial targets **Lyo 2.2** and has not been updated for Lyo 5.0+ (current supported version). Please post on the [forum](https://forum.open-services.net/c/sdks/lyo/9) if you encounter problems.

## Tutorial Structure

### Part 1: OSLC Provider Implementation
**[Implementing an OSLC Provider](implementing_an_oslc_provider/1_0_implementing_a_provider.md)**

Transform Bugzilla into a Change Management OSLC specification provider:

- Architecture and integration design
- OSLC catalogs and resource representations
- Delegated UI implementation
- Programmatic bug creation

### Part 2: OSLC Consumer Implementation  
**[Implementing an OSLC Consumer](integrating_with_an_oslc_provider/2_0_implementing_consumer.md)**

Build a consumer application that integrates with the Bugzilla provider:

- Link management with Bugzilla bugs
- UI preview implementation
- Delegated UI integration
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
