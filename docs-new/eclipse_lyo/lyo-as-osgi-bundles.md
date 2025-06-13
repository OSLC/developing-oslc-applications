# Lyo as OSGi Bundles

This page describes how to install and use Eclipse Lyo components as OSGi bundles within an Eclipse IDE environment.

!!! warning "Experimental Setup"
    This configuration is experimental and intended for advanced users who need Lyo components as Eclipse plugins.

## Prerequisites

### Eclipse Version Compatibility

This setup is known to work with:
- **Eclipse 2020-12** (IDE for Enterprise Java Developers)
- Similar recent Eclipse versions may work but are not guaranteed

### Environment Setup

First ensure your Eclipse environment is properly configured:
1. Follow the [Eclipse Setup Guide](setup.md)
2. Verify Java and Maven are correctly configured
3. Have Eclipse IDE for Enterprise Java Developers installed

## Installation Process

### Step 1: Install Jersey Dependencies

Jersey libraries are required for Lyo OSGi bundles.

1. **Open Install New Software**
   - Select **Help → Install New Software...**

2. **Add Orbit Repository**
   - Set **Work With:** to:
     ```
     https://download.eclipse.org/tools/orbit/downloads/drops/R20201130205003/repository
     ```

3. **Select Jersey Features**
   - ☑️ **jersey-core-common**
   - ☑️ **jersey-core-client** 
   - ☑️ **jersey.inject-hk2**

4. **Complete Installation**
   - Follow installation wizard
   - Restart Eclipse when prompted

### Step 2: Install Lyo OSGi Bundles

1. **Open Install New Software**
   - Select **Help → Install New Software...**

2. **Add Lyo Bundle Repository**
   - Set **Work With:** to:
     ```
     https://download.eclipse.org/lyo/bundle/p2/stable/
     ```

3. **Select Lyo Components**
   
   Choose the bundles you need:

   | Bundle | Description | Use Case |
   |--------|-------------|----------|
   | **Lyo Core** | Core OSLC functionality | Essential for any OSLC development |
   | **Lyo Client** | OSLC client capabilities | When consuming OSLC services |
   | **Lyo Store** | RDF storage and querying | When building OSLC providers |

4. **Complete Installation**
   - Follow installation wizard
   - Restart Eclipse when prompted

## Bundle Details

### Lyo Core Bundle
- **Purpose**: Core OSLC4J functionality
- **Includes**: Resource shapes, annotations, basic services
- **Required for**: All OSLC applications

### Lyo Client Bundle  
- **Purpose**: OSLC client capabilities
- **Includes**: HTTP client, resource parsing, query support
- **Use cases**: Consuming OSLC services, building integration clients

### Lyo Store Bundle
- **Purpose**: RDF persistence and SPARQL querying
- **Includes**: Jena integration, query processors
- **Use cases**: Building OSLC providers that need persistence

## Development Workflow

Once installed, you can use Lyo bundles in Eclipse plugin projects:

1. **Create Plugin Project**
   - **File → New → Other → Plug-in Development → Plug-in Project**

2. **Add Lyo Dependencies**
   - Open `MANIFEST.MF`
   - Add required Lyo bundles to **Dependencies**

3. **Use Lyo APIs**
   ```java
   import org.eclipse.lyo.oslc4j.core.annotation.OslcName;
   import org.eclipse.lyo.oslc4j.core.annotation.OslcResourceShape;
   // ... use Lyo annotations and APIs
   ```

## Bleeding Edge Builds

!!! danger "Use at Your Own Risk"
    Development builds may contain breaking changes and are not recommended for production use.

### Available Update Sites

| Repository | Stability | Description |
|------------|-----------|-------------|
| **Edge** | Weekly builds | Latest development features |
| **Super Edge** | Daily builds | Cutting-edge, highly unstable |

#### Edge Repository
```
https://download.eclipse.org/lyo/bundle/p2/edge/
```

#### Super Edge Repository  
```
https://download.eclipse.org/lyo/bundle/p2/superedge/
```

### Using Bleeding Edge

1. **Add Update Site**
   - **Help → Install New Software...**
   - Use one of the repositories above

2. **Install with Caution**
   - Test in development environment first
   - Have backup of working configuration
   - Monitor for compatibility issues

## Troubleshooting

### Common Issues

!!! bug "Bundle Resolution Errors"
    **Problem**: Bundles fail to resolve dependencies
    
    **Solutions**:
    - Ensure Jersey bundles are installed first
    - Check Eclipse version compatibility
    - Verify all required dependencies are present

!!! bug "ClassNotFoundException"
    **Problem**: Lyo classes not found at runtime
    
    **Solutions**:
    - Check bundle activation in **Run Configurations**
    - Verify correct bundle versions
    - Ensure proper Import-Package declarations

### Debugging Bundle Issues

1. **Check Bundle Status**
   - **Window → Show View → Other → PDE → Plug-ins**
   - Verify Lyo bundles are active

2. **View Dependencies**
   - Right-click bundle → **Open Dependencies**
   - Check for missing or conflicting dependencies

3. **OSGi Console**
   - Add `-console` to VM arguments
   - Use `ss` command to check bundle states
   - Use `diag` command for resolution issues

## Limitations

!!! warning "Current Limitations"
    - **Eclipse Version Dependency**: Limited to specific Eclipse versions
    - **Experimental Status**: Not officially supported for production
    - **Limited Documentation**: Fewer examples than standard Lyo usage
    - **Complex Setup**: More complex than Maven/Gradle dependencies

## Alternative Approaches

Consider these alternatives for Lyo development:

- **[Standard Maven Setup](setup.md)** - Recommended for most projects
- **[Lyo Designer](designer.md)** - Code generation and modeling
- **[Standalone Applications](../samples.md)** - Independent of Eclipse IDE

## Getting Help

- **[Lyo Forum](https://forum.open-services.net/)** - Community support
- **[GitHub Issues](https://github.com/eclipse/lyo/issues)** - Bug reports
- **[Eclipse Lyo Mailing List](https://dev.eclipse.org/mailman/listinfo/lyo-dev)** - Developer discussions

## Related Topics

- [Eclipse Lyo Overview](index.md)
- [Setup Development Environment](setup.md)
- [Lyo Designer](designer.md)
- [Sample Applications](../samples.md)
