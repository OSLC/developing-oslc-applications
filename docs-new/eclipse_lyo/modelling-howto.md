# Modelling How-To

This guide covers advanced topics for working with models in Lyo Designer, including URL configuration, handling large models, and controlling code generation.

## Configuring JAX-RS Web Service URLs {#configure-service-url}

For each **ServiceProviderCatalog**, **ServiceProvider**, and **Service** in your model, Lyo Designer generates corresponding JAX-RS web services. You can control the relative URLs of these services.

### ServiceProvider URL Configuration

Configure the following optional properties for **ServiceProvider** web services:

#### serviceNamespace
Specifies the relative URL for the ServiceProvider JAX-RS Service.

!!! example "Example Configuration"
    - Setting: `projects`
    - Result: `http://localhost:8080/YourAdaptor/services/projects`
    - Default: `serviceProviders` → `http://localhost:8080/YourAdaptor/services/serviceProviders`

#### instanceID  
Specifies the relative URL pattern for individual service providers, including parameter variables.

!!! example "Parameter Examples"
    - Simple: `{projectId}` → `http://localhost:8080/YourAdaptor/services/projects/1`
    - Complex: `collectionName/{collectionName}/project/{projectName}`
    - Default: `{serviceProviderId}`

### Service URL Configuration

For **Service** web services, configure:

#### serviceNamespace
Controls URL relationship to the managing service provider:

| Value | Description | URL Pattern |
|-------|-------------|-------------|
| `relativeToServiceProvider` | Build upon ServiceProvider URL | `/services/projects/1/requirements` |
| `independentOfServiceProvider` | Standalone URL | `/services/requirements` |

## Handling Large Models {#handling-large-models}

Lyo Designer supports two approaches for managing large models:

1. **Multiple diagrams** within the same model file
2. **Model composition** across multiple model files

### Common Domains

Reuse existing OSLC domain models to accelerate development:

!!! tip "Using Common Domains"
    1. **Clone Repository**: `git clone https://github.com/eclipse/lyo.domains`
    2. **Import Project**: Import `org.eclipse.lyo.tools.domainmodels`
    3. **Navigate Models**: Explore predefined OSLC domain specifications

The project includes models for:
- Core OSLC domains (RM, CM, QM, etc.)
- Common vocabularies (Dublin Core, FOAF, etc.)
- Extension domains

### Multiple Diagrams in One Model

Create multiple views of your model for better organization:

1. **Open Model Explorer View**
2. **Expand Model Structure**
   - Expand `domainModel.xml` file
   - Locate the `Specification` entry (don't double-click)
3. **Create New Diagram**
   - Right-click `Specification` entry
   - Select **New Representation → New SpecificationDiagram**

#### Diagram Capabilities

!!! info "Diagram Features"
    - **Multiple Specifications**: One diagram can contain multiple Domain Specifications
    - **Cross-Diagram Views**: Domain Specifications can appear in multiple diagrams
    - **Drag-and-Drop**: Move specifications between diagrams via Model Explorer
    - **Synchronized Changes**: Modifications reflect across all diagrams

### Model Composition Across Files

Import and reuse models from other projects:

1. **Add Model Dependencies**
   - Right-click **Project Dependencies** in Model Explorer
   - Select **Add Model**

2. **Browse and Select**
   - Choose **Browse Workspace**
   - Navigate to desired model file
   - Click **OK**

3. **Use Imported Models**
   - Expand imported model under **Project Dependencies**
   - Drag-drop Domain Specifications into diagrams
   - Reference imported Resource Properties in relationships

!!! success "Benefits of Model Composition"
    - **Reusability**: Share common domain models
    - **Modularity**: Separate concerns across projects
    - **Consistency**: Maintain standard definitions
    - **Collaboration**: Teams can work on separate model components

## Controlling Generation Parameters {#controlling-generation-parameters}

Customize where and how Java classes are generated from your models.

### Default Generation Behavior

By default, Java classes are generated:
- **Location**: Same destination folder as the containing model
- **Package**: Same package name as the containing model

### Use Cases for Custom Generation

!!! example "Generation Scenarios"
    - **Separate Libraries**: Generate each Domain Specification into separate Maven projects
    - **Existing Classes**: Model existing implementations without regenerating
    - **Manual Modifications**: Preserve custom code changes
    - **Team Organization**: Different teams manage different domain specifications

### Domain Specification-Level Settings

Configure generation for individual Domain Specifications:

1. **Select Generation Setting** from the tools palette
2. **Click Domain Specification** in the diagram
3. **Set Properties**:

| Property | Description | Example |
|----------|-------------|---------|
| **Java Files Path** | Relative path for generated classes | `../common-domains/src/main/java` |
| **Java Class Package Name** | Package name for generated classes | `com.example.oslc.domains.rm` |
| **Do Not Generate** | Skip generation entirely | `true` (for existing classes) |

### Model-Level Settings

Configure generation for all Domain Specifications:

1. **Select Generation Setting** from tools palette
2. **Click empty area** in Specification Diagram (not on any Domain Specification)
3. **Set global properties** using same parameters as above

### Generation Precedence Rules

!!! info "Override Hierarchy"
    1. **Domain Specification settings** override Model settings
    2. **Model settings** override Tool Adaptor settings
    3. **Tool Adaptor settings** are the fallback defaults

### Managing Dependencies

When distributing classes across multiple Java projects:

!!! warning "Dependency Management Required"
    Set up proper Maven/Gradle dependencies between projects when related classes are in different modules.

**Example Scenario:**
- Resource `oslc:Requirement` references `dcterms:creator`
- Range of `dcterms:creator` is `foaf:Person`
- OSLC and FOAF generated into separate Maven projects
- **Solution**: Add FOAF project as dependency in OSLC project's `pom.xml`

```xml
<dependency>
    <groupId>com.example.domains</groupId>
    <artifactId>foaf-domain</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Best Practices

### Model Organization

!!! tip "Organization Strategies"
    - **Domain Separation**: One diagram per major domain
    - **Functional Grouping**: Group related resources together
    - **Layered Architecture**: Separate core, extension, and application-specific models
    - **Consistent Naming**: Use clear, descriptive names for diagrams

### Code Generation Strategy

!!! success "Generation Best Practices"
    - **Start Simple**: Begin with single-project generation
    - **Plan Dependencies**: Map resource relationships before splitting projects
    - **Version Control**: Keep model files and generated code in sync
    - **Documentation**: Document custom generation settings

### Collaborative Development

!!! info "Team Collaboration"
    - **Shared Models**: Use common domain models across teams
    - **Clear Ownership**: Define who maintains each model component
    - **Change Management**: Coordinate model changes across dependent projects
    - **Regular Sync**: Keep imported models up to date

## Troubleshooting

### Common Issues

!!! bug "Generation Problems"
    **Problem**: Classes not generated or in wrong location
    
    **Solutions**:
    - Verify generation settings at correct level
    - Check file path permissions
    - Ensure target directories exist

!!! bug "Dependency Errors"
    **Problem**: Compilation errors in generated code
    
    **Solutions**:
    - Add missing Maven/Gradle dependencies
    - Verify import statements in generated classes
    - Check model references and relationships

## Related Topics

- [Lyo Designer Overview](designer.md)
- [Installing Lyo Designer](install-lyo-designer.md)
- [Domain Specification Modelling Workshop](domain-specification-modelling-workshop.md)
- [Setup Development Environment](setup.md)
