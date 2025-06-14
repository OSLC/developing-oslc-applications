# Setup an OSLC Provider/Consumer Application

!!! warning "Content Under Migration"
    This page is being updated to reflect the latest Eclipse Lyo versions (5.x, 6.x, 7.x). The current content covers older versions and may contain outdated information.

The steps below guide you through the necessary steps of creating a Java project with the necessary configurations to develop any OSLC server/client using Eclipse Lyo. The instructions assume you are using a modern IDE but should be valid for any development environment.

## Prerequisites

### System Requirements

- **JDK 17+** (JDK 17 is the baseline for Eclipse Lyo 6.0+)
- **Maven 3.6+**
- **IDE** (IntelliJ IDEA, Eclipse, VS Code, etc.)

### Latest Lyo Versions

- **Current Version**: 7.0.0-SNAPSHOT
- **Latest Stable**: 6.0.0

## Quick Start

### 1. Create a Maven Project

```xml
<groupId>com.example</groupId>
<artifactId>my-oslc-app</artifactId>
<version>1.0.0-SNAPSHOT</version>
<packaging>war</packaging>

<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <lyo.version>6.0.0</lyo.version>
    <jersey.version>3.1.5</jersey.version>
</properties>
```

### 2. Add Lyo Dependencies

```xml
<dependencies>
    <!-- Core Lyo -->
    <dependency>
        <groupId>org.eclipse.lyo.oslc4j.core</groupId>
        <artifactId>oslc4j-core</artifactId>
        <version>${lyo.version}</version>
    </dependency>
    
    <!-- Jena Provider -->
    <dependency>
        <groupId>org.eclipse.lyo.oslc4j.core</groupId>
        <artifactId>oslc4j-jena-provider</artifactId>
        <version>${lyo.version}</version>
    </dependency>
    
    <!-- Jakarta EE -->
    <dependency>
        <groupId>jakarta.servlet</groupId>
        <artifactId>jakarta.servlet-api</artifactId>
        <version>6.1.0</version>
        <scope>provided</scope>
    </dependency>
    
    <!-- Jersey (Jakarta EE) -->
    <dependency>
        <groupId>org.glassfish.jersey.core</groupId>
        <artifactId>jersey-server</artifactId>
        <version>${jersey.version}</version>
    </dependency>
</dependencies>
```

## Migration from Older Versions

!!! info "Migration Guides Available"
    - [Migrating from Lyo 4.x to 5.x](migration-4x-5x.md)
    - [Migrating from Lyo 5.x to 6.x](migration-5x-6x.md)
    - [Migrating from Lyo 6.x to 7.x](migration-6x-7x.md)

### Key Changes in Recent Versions

#### Lyo 6.0 (Jakarta EE Migration)
- **Package Migration**: `javax.*` → `jakarta.*`
- **JDK Requirement**: JDK 17+ baseline
- **Jersey Upgrade**: 3.1.5 (Jakarta EE compatible)

#### Lyo 7.0 (Current Development)
- **Security Update**: Apache Jena 4.10 (addresses CVE-2023-32200)
- **Removed**: `oslc4j-json4j-provider` (deprecated)
- **Enhanced**: OSLC Query ResponseInfo handling

## Example Application Structure

```
src/main/java/
├── com/example/oslc/
│   ├── Application.java           # JAX-RS Application
│   ├── ServiceProviderFactory.java
│   ├── resources/
│   │   ├── Requirement.java       # OSLC Resource
│   │   └── RequirementService.java # REST Service
│   └── servlet/
│       └── ServletListener.java   # Initialization
└── resources/
    └── log4j2.xml
```

## Next Steps

1. **Define your OSLC domain model** - Create POJOs with Lyo annotations
2. **Implement REST services** - Create JAX-RS services for CRUD operations  
3. **Configure service providers** - Set up OSLC service discovery
4. **Add authentication** - Implement OAuth or other auth mechanisms
5. **Test your implementation** - Use the OSLC reference implementation for testing

## Complete Examples

For working examples, see:
- **[Reference Implementation](../samples.md#oslc-reference-implementation)** - Complete OSLC servers
- **[Lyo Designer](designer.md)** - Code generation from models
- **[Client Examples](../samples.md#lyo-client-samples)** - OSLC client implementations

---

*This guide will be expanded with detailed step-by-step instructions. Check back for updates as we complete the migration to the latest Lyo versions.*
