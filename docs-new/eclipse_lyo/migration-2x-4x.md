# Migrating from Lyo 2.x to 4.x

!!! note "Content generated with LLM assistance"
    This guide was produced based on the private migration notes, CHANGELOGs, git diffs of previous commits, among others. LLM was used to collate the information below. All output was reviewed by a human. However, proceed carefully. If in doubt, see _Additional resources_ links at the bottom of the page or propose changes to this page by hitting the _Edit this page_ button above on the right.

!!! danger "Major Architecture Changes"
    This migration involves significant architectural changes including Jena and JAX-RS framework upgrades. Plan adequate time for testing and validation.

## Overview

Migration from Lyo 2.x to 4.x requires several major upgrades:

- **JAX-RS**: 1.1 → 2.0 (Apache Wink → Jersey/other JAX-RS 2.0 implementation)
- **Apache Jena**: 2.x → 4.x (Package changes: `com.hp.hpl.jena` → `org.apache.jena`)
- **JDK**: 7 → 8+ (minimum)
- **Repository**: Eclipse Maven → Maven Central

## Prerequisites

### Version Dependencies

| Component | Lyo 2.x | Lyo 4.x |
|-----------|---------|---------|
| **JDK** | 7+ | 8+ (11+ recommended) |
| **JAX-RS** | 1.1 (Wink) | 2.0 (Jersey) |
| **Apache Jena** | 2.x | 4.x |
| **Maven Repository** | Eclipse | Maven Central |

### Project Assessment

Before starting migration:

1. **Identify Lyo Components**: Determine which Lyo artifacts your project uses
2. **JAX-RS Framework**: Check if using Apache Wink (must be replaced)
3. **Custom Jena Code**: Review any direct Jena API usage
4. **JDK Version**: Ensure JDK 8+ is available

## Step-by-Step Migration

### Phase 1: Environment Preparation

#### 1.1 Update JDK
```bash
# Minimum JDK 8, recommended JDK 11+
java -version  # Should show 1.8+ or 8+
```

#### 1.2 Clean Maven Repositories
Remove old Eclipse repositories from your `pom.xml`:

```xml
<!-- REMOVE: Old Eclipse repositories -->
<repository>
    <id>lyo-releases</id>
    <url>https://repo.eclipse.org/content/repositories/lyo-releases/</url>
</repository>
```

### Phase 2: Dependency Updates

#### 2.1 Update Lyo Versions
Update your `pom.xml` dependency versions:

```xml
<properties>
    <!-- OLD: Lyo 2.x versions -->
    <!-- <lyo.version>2.4.0</lyo.version> -->
    
    <!-- NEW: Lyo 4.x versions -->
    <lyo.version>4.1.0</lyo.version>
    <jersey.version>2.25</jersey.version>
</properties>
```

#### 2.2 Replace Apache Wink with Jersey
If using Apache Wink, replace with Jersey 2.x:

```xml
<!-- REMOVE: Apache Wink dependencies -->
<!--
<dependency>
    <groupId>org.apache.wink</groupId>
    <artifactId>wink-server</artifactId>
    <version>1.4</version>
</dependency>
-->

<!-- ADD: Jersey 2.x dependencies -->
<dependency>
    <groupId>org.glassfish.jersey.core</groupId>
    <artifactId>jersey-server</artifactId>
    <version>${jersey.version}</version>
</dependency>

<dependency>
    <groupId>org.glassfish.jersey.containers</groupId>
    <artifactId>jersey-container-servlet</artifactId>
    <version>${jersey.version}</version>
</dependency>

<dependency>
    <groupId>org.glassfish.jersey.inject</groupId>
    <artifactId>jersey-hk2</artifactId>
    <version>${jersey.version}</version>
</dependency>
```

#### 2.3 Update Lyo Dependencies
Replace old Lyo artifacts with new ones:

```xml
<!-- Core Lyo dependencies -->
<dependency>
    <groupId>org.eclipse.lyo.oslc4j.core</groupId>
    <artifactId>oslc4j-core</artifactId>
    <version>${lyo.version}</version>
</dependency>

<dependency>
    <groupId>org.eclipse.lyo.oslc4j.core</groupId>
    <artifactId>oslc4j-jena-provider</artifactId>
    <version>${lyo.version}</version>
</dependency>

<!-- Client (if used) -->
<dependency>
    <groupId>org.eclipse.lyo</groupId>
    <artifactId>oslc-client</artifactId>
    <version>${lyo.version}</version>
</dependency>
```

### Phase 3: Code Changes

#### 3.1 Apache Jena Package Changes
Update all Jena imports from HP Labs packages to Apache packages:

```java
// OLD: HP Labs Jena packages
// import com.hp.hpl.jena.rdf.model.*;
// import com.hp.hpl.jena.vocabulary.*;

// NEW: Apache Jena packages
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.*;
```

**Common Package Mappings:**
```
com.hp.hpl.jena.rdf.model    → org.apache.jena.rdf.model
com.hp.hpl.jena.vocabulary   → org.apache.jena.vocabulary
com.hp.hpl.jena.query        → org.apache.jena.query
com.hp.hpl.jena.util         → org.apache.jena.util
```

#### 3.2 JAX-RS Application Class
Update from Wink to Jersey:

```java
// OLD: Wink Application
// import org.apache.wink.server.utils.RegistrationUtils;

// NEW: Jersey Application
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/services")
public class MyOslcApplication extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        // Add your service classes
        classes.add(MyOslcService.class);
        return classes;
    }
}
```

#### 3.3 Web.xml Updates
Update servlet configuration for Jersey:

```xml
<!-- OLD: Wink servlet -->
<!--
<servlet>
    <servlet-name>Apache Wink RESTful Web Service</servlet-name>
    <servlet-class>org.apache.wink.server.internal.servlet.RestServlet</servlet-class>
</servlet>
-->

<!-- NEW: Jersey servlet -->
<servlet>
    <servlet-name>Jersey</servlet-name>
    <servlet-class>org.glassfish.jersey.servlet.ServletContainer</servlet-class>
    <init-param>
        <param-name>javax.ws.rs.Application</param-name>
        <param-value>com.example.MyOslcApplication</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>Jersey</servlet-name>
    <url-pattern>/services/*</url-pattern>
</servlet-mapping>
```

### Phase 4: Client Migration

#### 4.1 Replace Old Lyo Client
If using the old `oslc-java-client`, migrate to the new client:

```java
// OLD: oslc-java-client (removed in Lyo 4.0)
// import org.eclipse.lyo.client.java.oslc.OslcClient;

// NEW: Lyo 4.0 client
import org.eclipse.lyo.client.OslcClient;

// Create client with OSLC version specification
OslcClient client = new OslcClient(OSLCConstants.OSLC2_0);
```

### Phase 5: Testing and Validation

#### 5.1 Build and Test
```bash
# Clean and rebuild
mvn clean compile

# Run tests
mvn test

# Package application
mvn package
```

#### 5.2 Common Issues and Solutions

**Issue: Missing JAX-RS classes**
```
java.lang.ClassNotFoundException: javax.ws.rs.core.Application
```
**Solution:** Add JAX-RS API dependency:
```xml
<dependency>
    <groupId>javax.ws.rs</groupId>
    <artifactId>javax.ws.rs-api</artifactId>
    <version>2.1.1</version>
</dependency>
```

**Issue: Jena package not found**
```
java.lang.NoClassDefFoundError: com/hp/hpl/jena/rdf/model/Model
```
**Solution:** Update all Jena imports to use `org.apache.jena.*` packages.

**Issue: Jersey injection problems**
```
java.lang.IllegalStateException: ServiceLocatorImpl has been shut down
```
**Solution:** Add Jersey HK2 dependency as shown in step 2.2.

**JAX-RS 1.x to 2.0 API Changes:**
```
java.lang.NoSuchMethodError: javax.ws.rs.core.Response.created()
```
**Solution:** Make sure you do not have transitive deps to JAX-RS 1.x and all transitive deps were compiled targeting JAX-RS 2 API. Run `mvn dependency:tree` to check.

**Jena 2.x to 3.x Package Migration:**

```
java.lang.ClassNotFoundException: com.hp.hpl.jena.rdf.model.Model
```

**Solution:** Check if any transitive dependencies rely on old Jena versions. 

**ServletContext Initialization Issues:**

```
java.lang.IllegalStateException: ServletContext attribute 'lyo.store' not found
```

**Solution:** Update web.xml to use Jersey ServletContainer.

**Problem:** MessageBodyWriter not found for collections with Jersey 3.x

```
javax.ws.rs.core.NoContentException: MessageBodyReader not found for media type=application/rdf+xml, 
type=class java.util.ArrayList$SubList, genericType=java.util.List<Resource>
```

**Root Cause:** Jersey has different collection handling than Wink.

**Solution Steps:**

   ```java
   // ❌ Jersey may not handle SubLists properly
   @GET
   @Produces(MediaType.APPLICATION_XML)
   public List<Resource> getResources() {
       return allResources.subList(0, 10);  // SubList issue
   }
   
   // ✅ Use proper ArrayList for Jersey
   @GET
   @Produces(MediaType.APPLICATION_XML)
   public List<Resource> getResources() {
       List<Resource> subset = new ArrayList<>(allResources.subList(0, 10));
       return subset;
   }
   ```

## Advanced Migration Topics

### Custom JAX-RS Providers
If you have custom JAX-RS providers, ensure they work with JAX-RS 2.0:

```java
// Update provider annotations if needed
@Provider
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MyCustomProvider implements MessageBodyReader<MyClass> {
    // Implementation updated for JAX-RS 2.0
}
```

### Configuration Management
Review configuration patterns - some Wink-specific configurations need Jersey equivalents.

### Performance Considerations
- Jersey 2.x has different performance characteristics than Wink
- Test thoroughly under expected load conditions
- Review memory usage patterns

## Next Steps

After successful migration to Lyo 4.x:

1. **Validate Functionality**: Test all OSLC operations thoroughly
3. **Plan Next Migration**: Consider migrating to [Lyo 5.x](migration-4x-5x.md) for additional improvements

## Additional Resources

- **[Lyo 4.0 Release Notes](https://github.com/eclipse/lyo/releases/tag/v4.0.0)**
- **[Jersey Migration Guide](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/migration.html)**
- **[Apache Jena Migration](https://jena.apache.org/documentation/notes/migrate-jena2-jena3.html)**
- **[OSLC Community Forum](https://forum.open-services.net/c/sdks/lyo/9)**
