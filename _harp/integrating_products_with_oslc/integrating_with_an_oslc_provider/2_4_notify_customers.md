# Implementing a "Customers to notify" page 

In this section, we'll explore how the ability to parse OSLC resources can help us add the ability to automatically notify customers of bugs that have changed.

Our plan for automating customer notifications is pretty straight forward. 

When our support reps create Incidents, customers are allowed to request notification for critical bugs, and this is recorded in the CRM system. To automatically send notifications to our customers when there are changes to bugs, we must do the following:

1. Query the CRM system to get all Notification Requests; each specifies the URL of a bug, date of last update and the customer's notification email address.
3. For each Notification Request, check the associated bug to see if it has been updated, using HTTP Conditional GET to avoid retrieving and parsing bugs that have not been updated.
2. If a bug has been updated, then format a nice notification email and include a summary of the bug.

We can write a program that can run as a scheduled task on a Build Automation system or just plain old UNIX cron.

In this tutorial we won't try to explain the whole program. We'll focus on the OSLC-specific parts, which are retrieving an OSLC resource via HTTP GET and how to parse an OSLC resource to get property values like title, status, modification date and others. 


## Fetching an OSLC resource with HTTP GET

First, as a prerequisite, we have to set up our Notification program to run on a schedule and provide it with whatever network addresses, credentials and other information necessary to connect to the CRM system, Bugzilla, and the Email system. We won't cover these details here.

Next, we need to write the code necessary to query the CRM system and get all Notification Requests and code that loops through the list. Then, For each bug, we wants to check and see if the bug has been updated since the last time the program ran. If the bug has been updated, then we want to fetch the bug in RDF/XML form and parse out the information need to form a notification email to the interested customer. 


### Exploring the RDF/XML form of a Bugzilla Bug

For this section, start the sample Bugzilla Adapter application. We assume it's running at `localhost:8080`.

With the adapter running, navigate to the following URL in a browser: <http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests/17>

(You might have to substitute different ID numbers for the product and bug)

In a browser, you'll be forwarded to the HTML page in Bugzilla for the bug. That's nice for us, but not so useful for a program that must parse the data. How can we request an RDF/XML representation of a bug?

OSLC providers are required to provide an RDF/XML representation of resources; however, the normal rules of HTTP and Content Negotiation apply. **If you want RDF/XML then you should ask for it.** Specifically, use `Accept` headers. We recommend [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/) as a REST client.

If you send the same request with an `Accept` header with the content `application/rdf+xml`, you should receive RDF/XML back from the adapter.

You can explore this further using Postman, Insomnia, or another REST client, as well as the Bugzilla adapter [where we implemented OSLC representations of Bugzilla bugs](../implementing_an_oslc_provider/1_3_intro_to_oslc4j).

Here's a sample Bugzilla bug represented as an RDF/XML BugzillaChangeRequest resource:

    <?xml version="1.0" encoding="UTF-8"?>
    <rdf:RDF
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:oslc_data="http://open-services.net/ns/servicemanagement/1.0/"
      xmlns:oslc_rm="http://open-services.net/ns/rm#"
      xmlns:oslc="http://open-services.net/ns/core#"
      xmlns:bugz="http://www.bugzilla.org/rdf#"
      xmlns:oslc_scm="http://open-services.net/ns/scm#"
      xmlns:foaf="http://xmlns.com/foaf/0.1/"
      xmlns:oslc_qm="http://open-services.net/ns/qm#"
      xmlns:dcterms="http://purl.org/dc/terms/"
      xmlns:oslc_cm="http://open-services.net/ns/cm#"
      xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" > 
      <rdf:Description rdf:about="http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests/17">
      <dcterms:contributor rdf:resource="http://localhost:8080/OSLC4JBugzilla/person?mbox=tara%40bluemartini.com"/>
      <bugz:operatingSystem>Windows NT</bugz:operatingSystem>
      <rdf:type rdf:resource="http://open-services.net/ns/cm#ChangeRequest"/>
      <oslc_cm:status>RESOLVED</oslc_cm:status>
      <oslc:serviceProvider rdf:resource="http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/1"/>
      <bugz:platform>PC</bugz:platform>
      <bugz:version>1.0</bugz:version>
      <dcterms:created>2000-06-29T22:07:00.000-04:00</dcterms:created>
      <dcterms:title rdf:datatype="http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral">Albright Overseas</dcterms:title>
      <bugz:component>PoliticalBackStabbing</bugz:component>
      <oslc_cm:severity>Unclassified</oslc_cm:severity>
      <dcterms:modified>2009-11-14T14:36:54.000-05:00</dcterms:modified>
      <bugz:priority>P4</bugz:priority>
      <dcterms:identifier>17</dcterms:identifier>
      </rdf:Description>
      <rdf:Description rdf:about="http://localhost:8080/OSLC4JBugzilla/person?mbox=tara%40bluemartini.com">
      <rdf:type rdf:resource="http://xmlns.com/foaf/0.1/Person"/>
      </rdf:Description>
    </rdf:RDF>

Note the variety of namespace definitions near the top of the document that define short prefix names for properties (e.g., `dcterms`).

Inside the `<rdf:RDF>` root element, there is an `<rdf:Description>` element with an attribute of `rdf:about` that is the URI of the Change Request. The `<rdf:type>` element indicates that this is an OSLC CM request. Each XML element represents a property value of the Change Request.

OSLC resources use Dublin Core defined properties, like `title`, `description`, and `id`. They also use OSLC defined properties like `status`, `closed`, and `inprogress`. You can find a listing of the different types of properties allowed and required in the [OSLC-CM specification](https://docs.oasis-open-projects.org/oslc-op/cm/v3.0/os/change-mgt-spec.html). There are also Bugzilla specific properties like `component` and `priority`. 

You can learn more about how our OSLC Bugzilla Adapter generates these representations [here](../implementing_an_oslc_provider/1_3_intro_to_oslc4j).


## Parsing an OSLC resource

<div class="notice tip">
<p><strong>Note</strong>: The following discusses using an RDF/XML parser. If you are writing Java, you could also use – in fact, we recommend using – <a href="http://wiki.eclipse.org/Lyo/LyoOSLC4J">OSLC4J</a> to convert RDF/XML representations into Java objects, which will most likely be easier to work with. Consider the following to be guidance if you choose to approach this another way.</p>
</div>

If you've parsed XML before, then the XML above probably does not look too challenging. **We strongly discourage parsing RDF/XML graphs using XML parsers.** XML adheres to the document model and extra processing is needed to interpret XML trees of the RDF/XML documents *as graphs.*


### Why you need an RDF parser

You can see the flexibility of RDF/XML in action if you compare the RDF/XML for the Change Request above to the [RDF/XML sample Change Request](http://open-services.rtp.raleigh.ibm.com/bin/view/Main/CmSpecificationV2Samples#Request_with_no_parameters_as_ap) in the [OSLC-CM specification](http://open-services.rtp.raleigh.ibm.com/bin/view/Main/CmSpecificationV2).

RDF/XML allows RDF property values to be serialized in a variety of ways. For example, property values about a Change Request could be nested inside an `<oslc_cm:ChangeRequest>` element, as you see in the OSLC-CM samples, where the element itself indicates the Resource Type. Or they could be nested inside an `<rdf:Description>` element, as you see above, and the type indicated by an `<rdf:type>` value. Both are valid forms of RDF/XML and allowed by OSLC, so you will have to accept both forms in any parser code that you write. That's only one example.

Another reason to use an RDF parser is that RDF/XML is only one way to serialize RDF. Right now RDF/XML is the popular format and the one required by OSLC, but there are other formats including Turtle, N3 and soon an official RDF serialization for JSON. By using a full-featured RDF parser like Jena, which we discuss below, you can read and write any format with the same code.


### Finding an RDF/XML parser

Instead of trying to write your own RDF/XML parser using XML tools, a better approach is to use an existing RDF/XML parser. There is one for every programming language and most are free and/or open source software. Below is a list of the more popular open source RDF tool-kits, the platform and licensing used by each.

+ [Apache Jena](https://jena.apache.org) (Java)
+ [RDF4J](https://rdf4j.org/) (Java; formerly known as OpenRDF / Sesame) 
+ [Ruby RDF](https://ruby-rdf.github.io/) (Ruby; aka RDF.rb)
+ [RDFlib](https://rdflib.readthedocs.io/en/stable/) (Python)
+ [N3 and others](https://rdf.js.org/) (Javascript)
+ [dotNetRDF](https://dotnetrdf.org/) (C# and other .NET languages)

All of the above libraries support RDF parsing and serialization, some form of triple-store RDF storage, and SPARQL query... more than you'll need for a typical OSLC implementation.

For our implementation, we'll be using Jena.


### How to use Jena to parse RDF/XML resource

Apache Jena is an open source Java library that offers a wide variety of RDF tools including a parser that can handle RDF/XML and other RDF serializations. Using Jena is straight-forward and should be easy for a Java developer.

Before you start coding, you must get [add Jena dependencies](https://jena.apache.org/download/maven.html) to your Maven POM file.

Let's attempt to GET an OSLC Change Request via HTTP, but this time we will do it in Java. When we get the results, we will parse them with Jena and pull out the properties that Nina needs: the OSLC-CM `fixed` value and the Dublin Core Terms `modified` date value.

> **NOTE:** If you see `com.hp.hpl.jena` package references in your code, it's an old "pre-Apache" version of Jena from the v2 branch. Current Jena major version is v4. Lyo dropped support for Jena 2 in Lyo 2.3.0. Please refer to the [Lyo migration guide](https://github.com/eclipse/lyo/wiki/Lyo-5.0-migration-notes) to upgrade your code.

Note that the following is not a complete Java class:

    import java.net.HttpURLConnection; // (1)
    import java.net.URL;
    import org.apache.jena.rdf.model.Model;
    import org.apache.jena.rdf.model.ModelFactory;
    import org.apache.jena.rdf.model.Property;
    import org.apache.jena.rdf.model.Resource;
    import org.apache.jena.rdf.model.Statement;

    // class declaration and other things omitted

    String resourceURI = "http://localhost:8080/OSLC4JBugzilla/services/1/ChangeRequests/1";
    URL url = new URL(resourceURI);  // (2)
    HttpURLConnection conn = (HttpURLConnection)url.openConnection();
    conn.setRequestProperty("Accept", "application/rdf+xml");  // (3)
          
    Model model = ModelFactory.createDefaultModel();                
    model.read(conn.getInputStream(), resourceURI); // (4)

    Resource resource = model.getResource(resourceURI); // (5)

    // (6)
    Property fixedProp = model.getProperty("http://open-services.net/ns/cm#fixed");

    Statement fixed = model.getProperty(resource, fixedProp); // (7)
    System.err.println("Fixed = " + fixed.getString()); // (8)

    // (9)
    Property modifiedProp = model.getProperty("http://purl.org/dc/terms/modified");
    Statement modified = model.getProperty(resource, modifiedProp);
    System.err.println("Modified = " + modified.getString());

Here's what it does:

1. Import the Java classes required for the example. Again, this is an incomplete Java class, so we've left out the class declaration, method declaration, and other bits;
2. Build a URL to a specific change request (hard-coded in the example);
3. Open a connection to that URL with an `Accept` header of `application/rdf+xml`;
4. Create a new Jena model and have it read the response. We pass in the `resourceURI` so Jena will know how to resolve relative links;
5. We use the Jena model to get the `Resource` for the the Change Request URI
6. We use the Jena model to get the Property object for the OSLC-CM `fixed` property by passing in the [URL for the `fixed` property](http://open-services.net/ns/cm#fixed);
7. We get the value for the `fixed` property;
8. And output that value to `stdout`;
9. We repeat the same process to get the Dublin Core `modified` property.

With the ability to parse OSLC Change Request resources in RDF/XML form, you can fairly easily figure out the remainder of the application that will automatically notify customers if there have been any updates to critical bugs.

## The power of OSLC representations

The real power of OSLC on display here is that although we've written this code with our  OSLC-CM Adapter for Bugzilla in mind, it will work _equally well for any other application that provides data according to the OSLC-CM specification_. Because OSLC Providers should all expose the same types of data in the same standard formats, you can build integrations _for the OSLC standards and specifications_ that should work with any compatible software. It's a different way of thinking about integrations that should help you make powerful, flexible, and future-proof ways to connect software. Cool stuff.

Next, now that we have a simple understanding of Jena, we'll use it to help us automatically create Bugzilla bugs – no human involvement required.

[Next: Part 2.5, Automatic Bugs](2_5_automatic_bugs)
