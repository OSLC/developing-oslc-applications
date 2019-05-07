Introduction
============
With Lyo Designer, you can graphically model your domain specifications according to the OSLC Core specification. A **Domain Specification** defines the types of resources, their properties and relationships, according the [OSLC Core Specification](https://archive.open-services.net/bin/view/Main/OslcCoreSpecification) and the [Resource Shape constraint language](https://archive.open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#oslc_ResourceShape_Resource).

From such a model, you can produce a library of Java classes, with the appropriate Lyo OSLC4J annotations to reflect the defined OSLC Resources, and their properties. These classes can then be further used in the development of OSLC applications using the Lyo OSLC4J SDK.

A domains model can also be imported into a toolchain model, to model a complete toolchain, as well as a single server and/or client. (see [Toolchain Modelling Workshop](toolchain-modelling-workshop) for details).

Bug Reporting
-------------

Please send any bug reports, questions or suggestions to the project mailinglist lyo-dev@eclipse.org, or report Bugs/features on [Github](https://github.com/eclipse/lyo.designer/issues)

Eclipse Setup
=============

First, make sure your Eclipse environment is setup as expected for general OSLC4J development, as instructed in [Eclipse Setup for Lyo-based Development](./eclipse-setup-for-lyo-based-development)

Then, make sure you [install Lyo Designer](install-lyo-designer)

Create a Modelling Project
==========================
Projects layout
---------------

You will need to create an Eclipse (modelling) project within which you will create the specification model. In this model, you will potentially define a number of domain specifications.

You may also choose to distribute the domain specifications into a number of different Java libraries, each of which is itself an Eclipse project.

So, a recommended structure of your projects is the following:

    oslc-project/
        oslc-model-project/
        domain1-project/
        domain2-project/

Where

* The top `oslc-project` directory may be a git repository root
* `oslc-model-project` is the Lyo Designer modelling project, where your model is managed.
* each `domain-project` contains the java classes corresponding to one or more domain specifications, generated from the definitions in `oslc-model-project`.


Create a Domain Specification Modelling Project
------------------------------------------------
1.  In your Eclipse workspace, switch to the **Modeling** perspective
1.  Create a new modelling project
    1.  Select **New &gt; Modelling Project**
    1.  Choose a project name
1.  Create a Specification model
    1.  Right click the newly created project, and select **New &gt; other…**
    1.  In the Wizards window, navigate and select *Lyo Designer &gt; OSLC Domain Model*, then press **Next**
    1.  choose a suitable file name (say *domain.xml*) for the model, then press **Next**
    1.  Set **Model Object** to *Specification*
    1.  Press **Finish**
    1.  Right-click the project again, and select **Viewpoints selection**
    1.  select **ToolChainViewpoint**
    1.  Press **OK**
1.  View the initial diagrams
    1. In the Model Explorer, by pressing the triangle/arrow to the left of the *domain.xml* file , expand the file structure until the
        *SpecificationDiagram* entry is visible.
        * *Note:* Do not double-click on the file. This will instead open the file in an xml editor.
    1.  You can now open and edit any of these views, by double-clicking on the desired entry.

Model OSLC Domain Specifications
===================

You are now ready to graphically specify the OSLC domain specifications.

For general instructions on Lyo Designer, the reader is referred to the general [Lyo Designer manual](./toolchain-modelling-workshop).

In the *SpecificationDiagram*, you can define a set of domain specifications, within which you define *Resources* and
*Resource Properties*.

![An example domain specification
diagram](./images/LyoToolchainModel-SpecificationDiagram.png "An example domain specification diagram")

1.  Using the **tools pallet** (located on the right), create any number
    of **Domain Specifications**.
1.  For each such **Domain Specification**, set the domain properties -
    *Name*, *Namespace Prefix* and *Namespace URI* – as desired.
    1.  For example, the OSLC RM domain specification defines the
        namespace URI of *<http://open-services.net/ns/rm#>* with a
        preferred namespace prefix of *oslc\_rm*.
    1.  **Note**: To set the *Namespace Prefix* property, right-click on the domain, and select the context menu entry **OSLC Lyo Designer &gt; Set Domain Prefix**.

1.  Inside each **Domain Specification**, use the tools pallet to create
    any number of **Resource** elements.
    1.  Select the operation **CreateResource** from the tools pallet,
        and then select the containing **Domain Specification** in
        the diagram.
    1.  Set the required attributes for each **Resource** (such as its
        *name*) in the **Properties** window.
    1.  Once created, a **Resource** can be moved to another Domain by a
        simple drag-and-drop action.
1.  Inside each **Domain Specification**, use the tools pallet to create
    any number of (a) **LiteralProperty**, (b) **ReferenceProperty**,
    and (c) **LocalReferenceProperty** elements.
    1.  Select the desired operation from the tools pallet, and then
        select the **Properties** list within the desired **Domain
        Specification** in the diagram.
    1.  Set the required attributes for each **Property** (such as
        *Occurs*, *description*, *range*, …) in the
        **Properties** window.
    1.  Once created, a **LiteralProperty** can be changed to a
        **ReferenceProperty** (or vice versa), by simply changing the
        *Range* and **value type** values of the property in the
        **Properties** window.
1.  To relate a **Property** to a **Resource**, drag-and-drop the
    property from the **Properties** list to the desired resource.
    -   A relation to a **LiteralProperty** is listed inside the
        **Resource** element it is allocated to.
    -   A relation to a **ReferenceProperty** is shown as an arrow
        between the **Resource** and the **Resource** the
        **ReferenceProperty** refers to.
    -   **Note**: A **Resource** can refer to **Properties** (Literal
        or Reference) from any other **Domain Specification**.

Handling Large Models
==================
To manage large models, Lyo Designer supports two model structuring techniques, which will be detailed in the following subsections:

* Creating multiple diagrams within the same model file
* Composing a model into multiple model files

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
---------------------------------------
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
---------------------------------------
You can import and use a previously defined model, through the addition of *Project Dependencies*:

1. In the *Model Explorer* view, right-click on the *Project Dependencies* entry within the modelling project, and select **Add Model**.
1. select **Browse Workspace**
1. Navigate and select the desired model.
1. Press **OK**.
1. In your own SpecificationDiagram, you can now create relationships to the imported Domain Specifications (or their contained Resources and Resource Properties).
    1. Expand the imported Specification model (under the the *Project Dependencies* entry) until the Domain Specification entries are visible.
    1. You can drag-drop any Domain Specification into an existing SpecificationDiagram to visualize its content.
    1. Also, when selecting the Resource Properties of a Resource, you will notice that all imported Resource properties are available as well.


Generate OSLC4J Java code
=========================

Once the Specification model is defined, you can choose to generate the set of Java classes, with the appropriate Lyo OSLC4J annotations to reflect the defined OSLC Resources, and their properties. These classes can then be further used in the development of OSLC applications using the Lyo OSLC4J SDK.

You first need to create the necessary OSLC4J project(s), onto which the code will be generated. We here assume the following parameters, which you will need to adjust for your particular project:

* Project Name: *domain-project*
* Base Package Name for Java Classes: *com.domain.resources*

1. Create the OSLC4J library project. For example using mvn:
    * **mvn archetype:generate -DgroupId=domain-project-group -DartifactId=domain-project -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false**
1. Add the necessary maven dependencies by following the instructions under [Setup an OSLC Provider/Consumer Application](./setup-an-oslc-provider-consumer-application).
    * At the least the `oslc4j-core` dependency is necessary.
1. Configure the Specification model's settings to generate code within the newly created OSLC4J project.
    1. Right-click inside the Specification Diagram (without selecting any Domain Specification) and select the context menu item **OSLC Lyo Designer > Set Java Generation Settings**
    1. Enter a relative file path, to which the Java classes will be generated.
        * Relative to what? anything you desire. In the comming steps, you get to define the absolute path of the defined relative path.
        * **Tips:** the relative path can be the path *within* your OSLC4J project (such as *domain-project/src/main/java*), while the absolute path (defined in next step) relates to the path up until the OSLC4J project.
    1. Enter the package name (*com.domain.resources*) of the Java classes to be generated.
1. Generate the Java code.
    1. Right-click inside the Specification Diagram (without selecting any Domain Specification) and select the context menu item **OSLC Lyo Designer > Generate Specification Java Code**
    1. You will now be prompted to enter the base path to which all relative generation paths relate.
        * **NOTE:** Alternatively, you can define this path through a "generationPath" property in a "generator.properties" file. The properties file is expected in the same location as the model file.
    1. Press **OK**
1. Once successful, you will be prompted with a dialog that confirms generation completion.

(Advanced) Define generation settings per Domain Specification
----------------------------------

You can also generate OSLC Resources classes into multiple Java projects, by specifying generation settings for each Domain Specification in your model.

To configure a Domain Specification's generation settings:

1. Right-click on a specific Domain Specification element and select the context menu item **OSLC Lyo Designer > Set Java Generation Settings**
1. Enter (a) relative file path (b) the package name of the Java classes to be generated.

The generation settings of a Domain Specification override those set for the overall Specification model.

**Important to note** that when related Java classes are distributed into different Java projects, it is necessary to set dependencies betweeen these Java projects, in order for the code to compile. For example Resource *oslc:Requirement* contains a reference property *dcterms:creator*, whose range is Resource *foaf:Person*. If the *OSLC* and *FOAF* Domain Specifications are generated into different maven projects, the *OSLC* maven project should include a maven dependency to the *FOAF* maven project.

Browsing the generated code
---------------------------
For each OSLC-resource in each of the Domain Specifications, a corresponding Java class is is produced. The class includes the appropriate OSLC annotations, instance attributes, getters, setters, etc.

The generated classes contain placeholders that allow the developer to insert additional code and hence modify the generated default code where necessary. such manual code remains intact after subsequent generations, if modifications are placed within the designated placeholders. This allows for the incremental development of the model, and its resulting code.

To illustrate, open a class file, and note the following placeholder:

    // Start of user code imports
    // End of user code

Any code entered between these two lines of code is maintained across subsequent generations. In this example, the placeholder is intended for developer-specific imports, but any Java code can be inserted.
