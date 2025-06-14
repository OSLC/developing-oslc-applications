# Lyo Designer - Visual OSLC Modeling Tool

Lyo Designer is an Eclipse plugin that allows you to graphically model:

1. **Overall system architecture**
2. **Information model** of RDF resources being shared  
3. **Individual services and operations** of each server in the system

!!! example "Video Demo"
    Watch a [video demonstration of Lyo Designer](https://www.youtube.com/watch?v=tZxPzlSTdeM) to see it in action.

## Visual Modeling Interface

The figure below shows the information modeling interface:

![An example domain specification diagram](images/LyoToolchainModel-SpecificationDiagram.png)

## Code Generation

Lyo Designer includes an integrated code generator that synthesizes your model into almost-complete OSLC-compliant JAX-RS web applications that are ready to run in modern containers (Jetty, Tomcat, TomEE, WildFly, Payara).

### Generated Code Includes

#### **Java Classes with Lyo Annotations**
- Automatically reflects the modeled RDF resource shapes
- Automates marshaling/unmarshaling of Java instances as Linked Data RDF resources

#### **JAX-RS Service Operations**
- **CRUD Operations**: Accessing, updating, creating and deleting RDF resources
- **Multi-format Support**: Handles turtle, RDF/XML, JSON-LD, and other formats
- **HTML Debug Views**: JSP pages for HTML representations of all RDF resources

#### **Delegated UI Support**
- Complete [Delegated UI](http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/cs01/part4-delegated-dialogs/oslc-core-v3.0-cs01-part4-delegated-dialogs.html) implementation
- **Creation Dialogs**: For creating new resources
- **Selection Dialogs**: For selecting existing resources
- **Auto-generated JSP pages** for dialog HTML representations

#### **Resource Preview**
- Full [Resource Preview](http://docs.oasis-open.org/oslc-core/oslc-core/v3.0/cs01/part3-resource-preview/oslc-core-v3.0-cs01-part3-resource-preview.html) support
- Auto-generated JSP pages for resource preview representations

## Incremental Development

!!! tip "Preserves Manual Changes"
    Lyo Designer supports incremental development where manual changes to the generated code are preserved upon model changes and subsequent code regeneration.

## Getting Started

### Prerequisites
- Eclipse IDE with modeling support
- Java 17+ development environment
- Maven or Gradle build system

### Installation and Tutorials

| Guide | Description |
|-------|-------------|
| **[Install Lyo Designer](install-lyo-designer.md)** | Step-by-step installation instructions |
| **[Toolchain Modeling Workshop](toolchain-modelling-workshop.md)** | Model a complete toolchain and generate code |
| **[Domain Specification Workshop](domain-specification-modelling-workshop.md)** | Model domain specifications and generate Lyo-annotated Java classes |
| **[Modeling How-to Guide](modelling-howto.md)** | Advanced modeling techniques and best practices |

## Development and Contribution

Interested in contributing to Lyo Designer? You can [work from its source code](https://github.com/eclipse/lyo.designer/wiki/Working-from-Source-Code) on GitHub.

## Alternative: Manual Development

!!! note "Designer vs Manual Development"
    While Lyo Designer provides excellent scaffolding and code generation, you can also develop OSLC applications manually using the [Lyo SDK setup guide](setup.md) and [reference implementation examples](../samples.md).

## Next Steps

1. **[Install Lyo Designer](install-lyo-designer.md)** in your Eclipse IDE
2. **Follow a workshop** to learn the modeling approach
3. **Generate your first OSLC application** from a model
4. **Customize the generated code** for your specific needs
