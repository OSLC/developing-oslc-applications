<a name="configure-service-url"></a>Configuring the URLs of JAX-RS web services
==================

For each **ServiceProviderCatalog**, **ServiceProvider** and **Service** in the model, there will be a corresponding JAX-RS web service, that responds to web requests on a specific relative URL. If you want to control the relative URLs of these web services, specify the following optional properties:

For the **ServiceProvider** web Service:

1.  *serviceNamespace* - specifies the relative URL for the
    ServiceProvider JAX-RS Service. For example, *projects*
    will lead to the url
    *http://localhost:8080/YourAdaptor/services/projects*. The
    default is *serviceProviders* (leading to the default
    *<http://localhost:8080/YourAdaptor/services/serviceProviders>*).
1.  *instanceID* - specifies the relative URL of a single
    service provider, including the parameter variables
    necessary to identify a specific service provider. For
    example, *{projectId}* leads to the url
    *http://localhost:8080/YourAdaptor/services/projects/1*
    mapping the value 1 to the *projectId* parameter in the
    java code. Other IDs can be
    *collectionName/{collectionName}/project/{projectName}*. The
    default is *{serviceProviderId}*.

For the **Service** web Service:
1.  *serviceNamespace* - specifies whether the relative URL of the
    web service should build upon the URL of its managing
    service provider (*relativeToServiceProvider*), or it should be
    standalone (*independantOfServiceProvider*).

<a name="handling-large-models"></a>Handling Large Models
==================
To manage large models, Lyo Designer supports two model structuring techniques, which will be detailed in the following subsections:

1. Creating multiple diagrams within the same model file
1. Composing a model into multiple model files

Common Domains
---------------
But first a sample model that can be used to illustrate the suggested techniques.

A model of the OSLC and other common domains is already available for reuse. To reuse these common specifications:

1. Clone the [Github lyo.domains](https://github.com/eclipse/lyo.domains) git repository
1. Import the project *org.eclipse.lyo.tools.domainmodels*.
    * This project models many of the OSLC domains across a number of diagrams.
1. Navigate the model as any other Domain Specification model.

In the next subsections, you will learn how to import this model into other models for reuse.

Creating multiple diagrams within the same model file
---------------
Within a single model, you can create any number of diagrams, each of which can contain any number of (overlapping) Domain Specifications.

1. Open the Model Explorer view.
1.  Expand the *domainModel.xml* file until the
    *Specification* entry is visible. (Do not double-click on the file. Instead, press the triangle/arrow to the left of the file entry.)
1.  right-click the *Specification* entry, and select **New Representation &gt; New SpecificationDiagram**.

You can define your Domain Specifications in any of these diagrams. Note the following:

* A Diagram can contain any number of Domain Specifications.
* A Domain Specification can be viewed in any number of Specification diagrams.
    * Once defined in a diagram, you can drag-drop a Domain Specification from the Model Explorer view into any other diagram to represent that domain in additional diagrams.
* a change to a model entity (a Domain Specification, Resource, Resource Property) are reflected in all diagrams.

Composing a model into multiple model files
---------------
You can import and use a previously defined model, through the addition of *Project Dependencies*:

1. In the *Model Explorer* view, right-click on the *Project Dependencies* entry within the modelling project, and select **Add Model**.
1. select **Browse Workspace**
1. Navigate and select the desired model.
1. Press **OK**.
1. In your own SpecificationDiagram, you can now create relationships to the imported Domain Specifications (or their contained Resources and Resource Properties).
    1. Expand the imported Specification model (under the the *Project Dependencies* entry) until the Domain Specification entries are visible.
    1. You can drag-drop any Domain Specification into an existing SpecificationDiagram to visualize its content.
    1. Also, when selecting the Resource Properties of a Resource, you will notice that all imported Resource properties are available as well.

<a name="controlling-generation-parameters"></a>Controlling the generation parameters of Domain Specification(s)
=========================

By default, the Java classes corresponding to the OSLC Resources of Domain Specification are generated under the same destination folder path as the containing overall model. Similarly, the java package name is the same as that of the containing model.

It may sometimes be desired to generate OSLC-resource Java classes into a separate java library, which is then included in multiple OSLC projects. For example, you might want to generated the classes from each Domain Specification into a separate Java (maven) projects.

Lyo Designer allows you to control the generation settings of each individual Domain Specification and/or all Domain Specifications. Such settings will override the *java Class Base Namespace* and *Java Files Base Path* settings of an adaptor.

Lyo Designer allows you even to model Domain Specification(s) without necessarily generating them. This can be useful if:
* you want to model existing implemented Domain Specifications so that they can be used in the model. That is, you can define OSLC services on such Java classes, but you don't necessarily want to generate these classes.
* You have previously generated domain specificaitons, and have done manual modifications that you don't want to overrride. 

To configure the generation settings for a single Domain Specification:

1.  Select **Generation Setting** from the tools pallet, and then select a **Domain Specification** in the diagram.
1. Set the generation properties as desired.
    * *Java Files Path* - The relative file path to be used to save the generated Java classes.  
    * *Java class Package Name* - The package name of the generated Java classes.
    * *Do Not Generate* - whether the Java classes should be generated at all.

To configure the generation settings for all Domain Specifications:
1.  Select **Generation Setting** from the tools pallet, and then select an empty area in the Specification Diagram (that is, do not select any Domain Specification).
1. Set the generation properties as above.

The following rules applies when generation settings are set at different levels in the model:
* The generation settings of a specific Domain Specification (if defined) override those set for the overall Specification model.
* The generation settings of the overall Specification model (if defined) override those set for a specific Tool Adaptor.

**Important to note** that when related Java classes are distributed into different Java projects, it is necessary to set dependencies betweeen these Java projects, in order for the code to compile. For example Resource *oslc:Requirement* contains a reference property *dcterms:creator*, whose range is Resource *foaf:Person*. If the *OSLC* and *FOAF* Domain Specifications are generated into different maven projects, th   e *OSLC* maven project should include a maven dependency to the *FOAF* maven project.
