# Domain Specification Modelling Workshop

This workshop guides you through creating OSLC domain specifications using Lyo Designer's graphical modeling capabilities.

## Introduction

With Lyo Designer, you can graphically model your domain specifications according to the OSLC Core specification. A **Domain Specification** defines the types of resources, their properties and relationships, following the [OSLC Core Specification](https://docs.oasis-open.org/oslc-core/oslc-core/v3.0/oslc-core-v3.0.html) and the [Resource Shape constraint language](https://docs.oasis-open.org/oslc-core/oslc-core/v3.0/oslc-core-v3.0.html#resource-shapes).

**Benefits:**
- Generate Java classes with appropriate Lyo annotations
- Reflect defined OSLC Resources and their properties
- Use generated classes in OSLC application development with Lyo SDK
- Import domain models into toolchain models for complete integration

!!! tip "Related Workshop"
    Domain models can be imported into toolchain models for complete server/client modeling. See [Toolchain Modelling Workshop](toolchain-modelling-workshop.md) for details.

## Prerequisites

### Development Environment

Before starting, ensure your environment is properly configured:

1. **Eclipse Setup**: Follow the [Eclipse Setup Guide](setup.md) for Lyo-based development
2. **Lyo Designer**: Install using the [Lyo Designer Installation Guide](install-lyo-designer.md)

### Getting Help

!!! question "Support Resources"
    - **Mailing List**: [lyo-dev@eclipse.org](mailto:lyo-dev@eclipse.org)
    - **GitHub Issues**: [Lyo Designer Issues](https://github.com/eclipse/lyo.designer/issues)
    - **Community Forum**: [OSLC Forum](https://forum.open-services.net/)

## Project Structure

### Recommended Layout

Organize your projects using this structure for optimal development:

```
oslc-project/
├── oslc-model-project/          # Lyo Designer modeling project
├── domain1-project/             # Java classes for domain 1
├── domain2-project/             # Java classes for domain 2
└── README.md
```

**Directory purposes:**
- **oslc-project**: Git repository root
- **oslc-model-project**: Lyo Designer modeling project (model management)
- **domain-project**: Java classes for domain specifications (generated code)

!!! tip "Project Distribution"
    You can distribute domain specifications into separate Java libraries, each as its own Eclipse project for better modularity.

## Creating a Domain Specification Project

### Step 1: Create Modeling Project

1. **Switch to Modeling Perspective**
   - In Eclipse, select **Window → Open Perspective → Modeling**

2. **Create New Project**
   - Select **File → New → Modeling Project**
   - Choose a descriptive project name (e.g., `oslc-domain-model`)

### Step 2: Create Specification Model

1. **Create Domain Model**
   - Right-click the project → **New → Other...**
   - Navigate to **Lyo Designer → OSLC Domain Model**
   - Click **Next**

2. **Configure Model**
   - Choose filename (e.g., `domain.xml`)
   - Click **Next**
   - Set **Model Object** to `Specification`
   - Click **Finish**

3. **Enable Viewpoints**
   - Right-click project → **Viewpoints Selection**
   - Select **ToolChainViewpoint**
   - Click **OK**

### Step 3: Access Modeling Views

1. **Open Model Explorer**
   - Expand the model file by clicking the triangle/arrow next to `domain.xml`
   - **Important**: Don't double-click the file (opens XML editor)

2. **Access Diagrams**
   - Look for `SpecificationDiagram` entry
   - Double-click to open and edit diagrams

!!! note "Advanced Organization"
    For complex models, Lyo Designer supports breaking models into multiple projects. See [Handling Large Models](modelling-howto.md#handling-large-models) for details.

## Modeling Domain Specifications

### Specification Diagram Overview

In the **SpecificationDiagram**, you define:
- **Domain Specifications**: Logical groupings of related resources
- **Resources**: OSLC resource types (e.g., Requirement, Defect, TestCase)
- **Resource Properties**: Attributes and relationships of resources

![Domain Specification Example](images/LyoToolchainModel-SpecificationDiagram.png)

*Example domain specification diagram showing resources and their relationships*

### Modeling Steps

1. **Learn Lyo Designer Basics**
   - Review [General Lyo Modeling Instructions](toolchain-modelling-workshop.md#general-modelling-instructions)
   - Understand the modeling interface and tools

2. **Create Domain Specifications**
   - Follow the [Domain Specification Modeling Guide](toolchain-modelling-workshop.md#domain-specification-view)
   - Focus only on the domain specification section

3. **Validate Your Model**
   - Use the [Model Validation Instructions](toolchain-modelling-workshop.md#validate-model)
   - Ensure your model is complete and consistent

### Best Practices

!!! success "Modeling Guidelines"
    - **Use Standard Vocabularies**: Leverage Dublin Core, FOAF, and OSLC standard properties
    - **Consistent Naming**: Follow consistent naming conventions across resources
    - **Clear Relationships**: Define clear relationships between resources
    - **Validation**: Regularly validate your model during development

## Setting Up Lyo Projects

Once your specification model is complete and validated, generate Java classes with appropriate Lyo annotations.

!!! info "Automatic Project Creation"
    Modern Lyo Designer automatically creates Eclipse projects during generation - no manual setup required!

### Configuration Steps

1. **Create Specification Configuration**
   - Use the tools palette to create a **Specification Configuration**
   - Place it in the Specification Diagram (**not** inside a specific Domain Specification)

2. **Configure General Settings**
   
   | Setting | Description | Example |
   |---------|-------------|---------|
   | **Files Base Path** | Relative path for generated files | `../my-domain-lib/src/main/java` |
   | **Java Base Package Name** | Root package for generated code | `com.example.oslc.domains` |

3. **Configure Project Settings**
   
   | Setting | Description | Required |
   |---------|-------------|----------|
   | **Do Not Generate Project Files** | Skip pom.xml/web.xml generation | Optional |
   | **Group Id** | Maven group identifier | Yes |
   | **Artifact Id** | Maven artifact identifier | Yes |
   | **Version** | Project version | Yes |
   | **Lyo Version** | Lyo library version to use | Yes |

!!! tip "Domain-Specific Configuration"
    Create additional **Specification Configuration** elements within specific Domain Specifications to override global settings.

## Generating Java Code

### Generation Process

1. **Trigger Generation**
   - Right-click in Specification Diagram (don't select any Domain Specification)
   - Choose **OSLC Lyo Designer → Generate Specification Java Code**

2. **Specify Output Path**
   - Enter the base path for Java class generation
   - **Alternative**: Create `generator.properties` file with `generationPath` property

3. **Confirm Generation**
   - Click **OK** to start generation
   - Wait for completion confirmation dialog

### Generation Features

!!! success "Incremental Development Support"
    - **Incremental Updates**: Manual changes within designated placeholders are preserved
    - **Flexible Output**: Generate different parts to different projects/locations
    - **Code Reuse**: Better package reuse through configurable generation

**Advanced Configuration**: See [Controlling Generation Parameters](modelling-howto.md#controlling-generation-parameters) for multi-project setups.

## Exploring Generated Code

### Generated Structure

For each OSLC resource in your Domain Specifications, Lyo Designer generates:

- **Java Class**: Complete POJO with OSLC annotations
- **Instance Attributes**: Properties defined in the model
- **Getters/Setters**: Accessor methods for all properties
- **OSLC Annotations**: Proper annotation for OSLC compliance

### Code Placeholders

Generated classes include placeholders for custom code:

```java
public class MyResource extends AbstractResource {
    // Start of user code imports
    // End of user code
    
    // Generated code...
    
    public String getCustomProperty() {
        // Start of user code getCustomProperty
        // End of user code
        return customProperty;
    }
}
```

!!! warning "Placeholder Usage"
    **Always place custom code within designated placeholders** to preserve changes during regeneration.

### Common Placeholder Types

| Placeholder | Purpose | Example Usage |
|-------------|---------|---------------|
| `// Start of user code imports` | Custom imports | Additional library imports |
| `// Start of user code class` | Class-level code | Static methods, constants |
| `// Start of user code [methodName]` | Method implementation | Custom validation, computation |

## Next Steps

### Development Workflow

1. **Iterative Development**
   - Modify model as requirements evolve
   - Regenerate code preserving custom modifications
   - Test generated classes in your application

2. **Integration**
   - Use generated classes in OSLC servers/clients
   - Follow [Setup Guide](setup.md) for application development
   - Refer to [Sample Applications](../samples.md) for examples

### Advanced Topics

- **[Modelling How-To](modelling-howto.md)**: Advanced modeling techniques
- **[Toolchain Modelling](toolchain-modelling-workshop.md)**: Complete server/client modeling
- **[Lyo Designer](designer.md)**: Comprehensive designer documentation

## Troubleshooting

### Common Issues

!!! bug "Generation Problems"
    **Problem**: Code generation fails or produces errors
    
    **Solutions**:
    - Validate model before generation
    - Check file paths and permissions
    - Verify Lyo Designer installation
    - Review Eclipse error log

!!! bug "Compilation Errors"
    **Problem**: Generated code doesn't compile
    
    **Solutions**:
    - Check Java project configuration
    - Verify Lyo dependencies in pom.xml
    - Ensure proper package structure
    - Review custom code in placeholders

### Getting Help

- **[Lyo Designer Issues](https://github.com/eclipse/lyo.designer/issues)**: Bug reports and feature requests
- **[Lyo Developer List](mailto:lyo-dev@eclipse.org)**: Development questions
- **[OSLC Forum](https://forum.open-services.net/)**: Community support

## Related Resources

- [Eclipse Lyo Overview](index.md)
- [Lyo Designer Documentation](designer.md)
- [Toolchain Modelling Workshop](toolchain-modelling-workshop.md)
- [Sample Applications](../samples.md)
