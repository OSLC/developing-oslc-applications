# Lyo Core internals

## Annotation processing

Lyo allows (un)marshalling Java POJOs (but you will almost always want to extend an `AbstractResource`) from/to Jena models by processing objects and applying rules driven by class annotations ([Javadoc](https://download.eclipse.org/lyo/docs/core/latest/org/eclipse/lyo/oslc4j/core/annotation/package-summary.html)).

> Lyo Designer normally generates the code with the appropriate annotations. Right now, only the code for OSLC Shapes is generated, even though the Designer allows specifying models for both RDF classes (vocabularies) and OSLC Shapes (domain specifications).

The following annotations can be applied on the class level:

- `OslcName` (mandatory): defines the name of the RDF class.
- `OslcNamespace` (mandatory): defines the RDF namespace of the class.
- `OslcResourceShape` (mandatory)
- `OslcService`
- `OslcNotQueryResult`

The following annotations can be applied on a getter method:

- `OslcName` (mandatory): defines a property name.
- `OslcPropertyDefinition` (mandatory). URI of the property.
- `OslcOccurs` (mandatory)
- `OslcRange` (mandatory)
- `OslcReadonly`
- `OslcTitle`
- `OslcRepresentation`
- `OslcValueType`
- `OslcValueShape`
- `OslcAllowedValue` (NB! takes an array)
- `OslcAllowedValues` (NB! takes a single argument)
- `OslcDefaultValue`
- `OslcDescription`
- `OslcHidden`
- `OslcMaxSize`
- `OslcMemberProperty`

The following methods are allowed on the JAX-RS methods that accept or return instances of Lyo model classes:

- `OslcCreationFactory`
- `OslcDialog`

Additionally, `OslcSchema` may be applied on the package level (i.e. in the `package-info.java`) 