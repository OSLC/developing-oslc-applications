# Migrating from Lyo 4.x to 5.x

!!! note "Content generated with LLM assistance"
    This guide was produced based on the private migration notes, CHANGELOGs, git diffs of previous commits, among others. LLM was used to collate the information below. All output was reviewed by a human. However, proceed carefully. If in doubt, see _Additional resources_ links at the bottom of the page or propose changes to this page by hitting the _Edit this page_ button above on the right.

!!! info "Major JDK and Dependency Updates"
    Lyo 5.x removes JDK 8 support, upgrades Jena to 4.5.0, and removes several deprecated components. Plan for testing with JDK 11+.

## Overview

Migration from Lyo 4.x to 5.x involves:

- **JDK**: Minimum JDK 11 (JDK 8 support removed)
- **Apache Jena**: 3.x → 4.5.0 (addresses CVE-2021-41042)
- **Component Removal**: Several deprecated components removed
- **TRS Changes**: BigInteger support for `trs:order` properties
- **Client Changes**: Old `oslc-java-client` completely removed

## Prerequisites

### Version Dependencies

| Component | Lyo 4.x | Lyo 5.x |
|-----------|---------|---------|
| **JDK** | 8+ | 11+ (17+ recommended) |
| **Apache Jena** | 3.x | 4.5.0 |
| **Jersey** | 2.25+ | 2.35+ |

### Breaking Changes Summary

- ❌ **JDK 8 support removed**
- ❌ **`oslc-java-client` removed** (use new client from Lyo 4.0+)
- ❌ **`oslc4j-wink` removed**
- ❌ **`oslc4j-registry` removed**
- ❌ **Direct TDB1 backend support removed from Store**
- ⚠️ **TRS `trs:order` now uses BigInteger**
- ⚠️ **Jena `RDFReader/RDFWriter` renamed to `RDFReaderI/RDFWriterI`**

## Step-by-Step Migration

### Phase 1: Environment Preparation

#### 1.1 Update JDK
```bash
# JDK 11 minimum, JDK 17+ recommended
java -version  # Should show 11 or 17+
```

Update Maven compiler properties:
```xml
<properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
    <maven.compiler.release>11</maven.compiler.release>
</properties>
```

#### 1.2 Validate Dependencies
Ensure you're not using removed components:

```bash
# Check for removed dependencies
grep -r "oslc-java-client" pom.xml
grep -r "oslc4j-wink" pom.xml
grep -r "oslc4j-registry" pom.xml
```

=== "PowerShell"
    ```powershell
    # Check for removed dependencies
    Select-String -Path "pom.xml" -Pattern "oslc-java-client" -Recurse
    Select-String -Path "pom.xml" -Pattern "oslc4j-wink" -Recurse
    Select-String -Path "pom.xml" -Pattern "oslc4j-registry" -Recurse
    ```

### Phase 2: Incremental Migration Approach

Follow the recommended incremental migration path:

#### 2.1 Lyo 5.0.0.alpha1 → Check JDK and Component Usage
```xml
<properties>
    <lyo.version>5.0.0.alpha1</lyo.version>
</properties>
```

**What to test:**
- Application builds without removed Lyo artifacts
- No usage of old Wink-based client
- JDK 11+ compatibility

#### 2.2 Lyo 5.0.0.alpha2 → Jena 4.0 Compatibility
```xml
<properties>
    <lyo.version>5.0.0.alpha2</lyo.version>
</properties>
```

**What to test:**
- Jena 4.0 API changes compatibility
- Any custom Jena code still works

#### 2.3 Lyo 5.0.0.alpha3 → Jersey Upgrade
```xml
<properties>
    <lyo.version>5.0.0.alpha3</lyo.version>
    <jersey.version>2.35</jersey.version>
</properties>
```

**What to test:**
- Jersey 2.25 → 2.35 compatibility
- JAX-RS functionality still works

#### 2.4 Lyo 5.0.0.alpha4 → SPARQL Changes
```xml
<properties>
    <lyo.version>5.0.0.alpha4</lyo.version>
</properties>
```

**What to test:**
- [SPARQL-related changes in Jena 4.3](https://jena.apache.org/documentation/sparql-apis/#changes)
- Any custom SPARQL code still works

#### 2.5 Lyo 5.0.0.Final → Production Release
```xml
<properties>
    <lyo.version>5.1.1.Final</lyo.version>
</properties>
```

### Phase 3: Code Changes

#### 3.1 Client Migration (if using old client)
Replace any remaining old client usage:

```java
// OLD: oslc-java-client (completely removed in 5.0)
// This will cause build failures in Lyo 5.0

// NEW: Use Lyo 4.0+ client
import org.eclipse.lyo.client.OslcClient;
import org.eclipse.lyo.client.OSLCConstants;

OslcClient client = new OslcClient(OSLCConstants.OSLC2_0);
```

#### 3.2 TRS BigInteger Migration
Update TRS code to handle BigInteger for order properties:

```java
// OLD: 32-bit int for trs:order
// int order = changeEvent.getOrder();

// NEW: BigInteger for trs:order
import java.math.BigInteger;

BigInteger order = changeEvent.getOrder();
```

#### 3.3 Jena RDF Reader/Writer Updates
Update deprecated Jena interfaces:

```java
// OLD: Deprecated in Jena 4.x
// import org.apache.jena.rdf.model.RDFReader;
// import org.apache.jena.rdf.model.RDFWriter;

// NEW: Updated interfaces
import org.apache.jena.rdf.model.RDFReaderI;
import org.apache.jena.rdf.model.RDFWriterI;

// Update usage accordingly
RDFReaderI reader = model.getReader();
RDFWriterI writer = model.getWriter();
```

#### 3.4 Store Implementation Updates
If using direct TDB1 backend, migrate to SPARQL approach:

```java
// OLD: Direct TDB1 backend (removed)
// StoreFactory.inMemory();
// StoreFactory.onDisk();

// NEW: SPARQL-based approach
import org.eclipse.lyo.store.SparqlStoreImpl;
import org.eclipse.lyo.store.internals.query.DatasetQueryExecutorImpl;
// import org.apache.jena.tdb.TDBFactory; // TDB1

Dataset dataset = TDBFactory.createDataset(); // or your dataset
DatasetQueryExecutorImpl executor = new DatasetQueryExecutorImpl(dataset);
SparqlStoreImpl store = new SparqlStoreImpl(executor);
```

### Phase 4: Security Updates

#### 4.1 CVE-2021-41042 Mitigation
Lyo 5.0 addresses CVE-2021-41042 by upgrading Jena. Ensure you're not bypassing security measures:

- Don't process untrusted RDF/XML inputs without validation
- Review any custom RDF parsing code
- Test with malicious RDF/XML samples if applicable

### Phase 5: Testing and Validation

#### 5.1 Build and Test Each Phase
```bash
# Test each alpha version
mvn clean compile
mvn test
mvn package
```

#### 5.2 Common Migration Issues

**Issue: Build fails with missing JDK 8**
```
[ERROR] Source option 8 is no longer supported. Use 11 or later.
```
**Solution:** Update JDK to 11+ and update Maven compiler properties.

**Issue: TRS order type mismatch**
```
java.lang.ClassCastException: java.lang.Integer cannot be cast to java.math.BigInteger
```
**Solution:** Update TRS code to use BigInteger for order properties.

**Issue: Jena reader/writer not found**
```
java.lang.NoSuchMethodError: org.apache.jena.rdf.model.Model.getReader()
```
**Solution:** Update to use RDFReaderI/RDFWriterI interfaces.

**Issue: Store implementation not available**
```
java.lang.NoClassDefFoundError: JenaTdbStoreImpl
```
**Solution:** Migrate to SparqlStoreImpl with DatasetQueryExecutorImpl.

## Migration from Lyo 2.4.0

If migrating directly from Lyo 2.4.0:

1. **First migrate to Lyo 4.x** following [2.x to 4.x migration guide](migration-2x-4x.md)
2. **Then follow this guide** to migrate from 4.x to 5.x

This two-step approach is recommended for better testing and validation.

## Next Steps

After successful migration to Lyo 5.x:

1. **Validate All Features**: Test OSLC operations, TRS, client usage
2. **Performance Testing**: Verify performance with Jena 4.5.0
3. **Security Review**: Validate security measures are working
4. **Plan for 6.x**: Consider [Jakarta EE migration](migration-5x-6x.md) for future compatibility

## Additional Resources

- **[Lyo 5.0 Release Notes](https://github.com/eclipse/lyo/releases/tag/v5.0.0)**
- **[Jena 4.x Migration Guide](https://jena.apache.org/documentation/notes/migrate-jena3-jena4.html)**
- **[CVE-2021-41042 Details](https://nvd.nist.gov/vuln/detail/CVE-2021-41042)**
- **[OSLC Community Forum](https://forum.open-services.net/c/sdks/lyo/9)**
