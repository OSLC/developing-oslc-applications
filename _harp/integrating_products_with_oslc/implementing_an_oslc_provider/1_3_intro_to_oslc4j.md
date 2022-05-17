# Providing OSLC representations of Bugzilla bugs using Lyo

In the [previous section](1_2_providing_service_resources) we noted that we used Eclipse Lyo to transform Plain Old Java Object (POJO) representations of OSLC resources into RDF, XML, and JSON formats. In this section, we'll look more closely at how Eclipse Lyo defines OSLC resources. Then we'll make Bugzilla Bugs available as OSLC Change Management resources in a variety of formats.

## What is Eclipse Lyo?

[Eclipse Lyo](../../eclipse_lyo/eclipse-lyo) is a Java SDK for developing OSLC provider or consumer implementations. OSLC resources can be modeled with plain old Java objects (POJOs) which are annotated to provide the information Eclipse Lyo needs to create resource shapes, service provider documents, and to serialize/de-serialize OSLC resources from Java to representations such as RDF or JSON.

## Defining OSLC resources with Eclipse Lyo

Eclipse Lyo comes with a sample Change Management application that includes the Eclipse Lyo-annotated Java class representing a Change Request (as defined in the OSLC Change Management v2 specification).

The Eclipse Lyo Bugzilla adapter includes that class (**ChangeRequest**) and extends it with Bugzilla-specific attributes (for example, "Product", "Platform", or other attributes that are not part of the OSLC CM specification); this extended change request is called a **BugzillaChangeRequest**.

### Exploring the Eclipse Lyo ChangeRequest class

Open the file `ChangeRequest.java` in the **org.eclipse.lyo.oslc4j.bugzilla.resources** package and explore the variables and methods. For reference, [here is the definition of a Change Request in the OSLC Change Management specification](http://open-services.net/bin/view/Main/CmSpecificationV2#Resource_ChangeRequest).

First, observe the private variables at the top of the __ChangeRequest__ class. These are the attributes of an OSLC CM V2.0 Change Request. Here are first several, which represent the relationships between Change Requests and other OSLC artifacts:

	private final Set<Link> affectedByDefects           = new HashSet<Link>();
	private final Set<Link> affectsPlanItems            = new HashSet<Link>();
	private final Set<Link> affectsRequirements         = new HashSet<Link>();
	private final Set<Link> affectsTestResults          = new HashSet<Link>();
	private final Set<Link> blocksTestExecutionRecords  = new HashSet<Link>();

Further down are the primitive attributes of a Change Request:

	private Boolean  approved;
	private Boolean  closed;
	private Date     closeDate;
	private Date     created;
	private String   description;

Further down, each attribute has an associated getter method. For example, here's the `getIdentifier()` method:

	@OslcDescription("A unique identifier for a resource. Assigned by the service provider when a resource is created. Not intended for end-user display.")
	@OslcOccurs(Occurs.ExactlyOne)
	@OslcPropertyDefinition(OslcConstants.DCTERMS_NAMESPACE + "identifier")
	@OslcReadOnly
	@OslcTitle("Identifier")
	public String getIdentifier()
	{
		return identifier;
	}

Note the OSLC-specific annotations before the method. These are used to not only automatically create OSLC resource shape documents, service provider documents, and service provider catalogs, but also assist with the serialization of Java objects to RDF or JSON:

+ `@OslcOccurs` provides the cardinality of the attribute. 
+ `@OslcPropertyDefinition` providers the namespace qualified attribute name
+ `@OslcReadOnly` indicates this attribute should appear in the resource shape as read only

Because the *default type in Lyo is a string*, there is no type annotation. Look for other attributes with the `@OslcValueType` annotation for examples of attributes that are not strings. 


### Extending ChangeRequest with Bugzilla attributes

Open the file `BugzillaChangeRequest.java` in the **org.eclipse.lyo.oslc4j.bugzilla.resources** package and explore the variables and methods for the Bugzilla-specific attributes.

As with the **ChangeRequest** class, the various getter methods (for example, `getVersion()`) have OSLC annotations.

#### Mapping Bugzilla attributes to OSLC-CM properties

To represent a Bugzilla bug as an RDF/XML document for an OSLC Change Management resource, we must map Bugzilla bug attributes to [OSLC-CM ChangeRequest properties](http://open-services.net/bin/view/Main/CmSpecificationV2#Resource_ChangeRequest). The following attributes line up fairly clearly:

| Bugzilla Bug field | Maps to RDF predicate | Prefixed name*
| ------------------ | --------------------- | --------------
| id | <http://purl.org/dc/terms/identifier> | dcterms:identifier
| summary | <http://purl.org/dc/terms/title> | dcterms:title
| status | <http://open-services.net/ns/cm#status> | oslc_cm:status
| assigned_to | <http://purl.org/dc/terms/contributor> | dcterms:contributor
| creation_time | <http://purl.org/dc/terms/created> | dcterms:created
| last_change_time | <http://purl.org/dc/terms/modified> | dcterms:modified

<small>(* Prefix may be different depending on namespace prefix declaration in the XML)</small>

In the **BugzillaChangeRequest** class, the `fromBug()` method sets these properties. Near the top of the method, here is the code that sets the properties `dcterms:identifier`, `dcterms:title`, and `oslc_cm:status` properties from (respectively) the ID, Summary, and Status of the Bugzilla bug:

	BugzillaChangeRequest changeRequest = new BugzillaChangeRequest();
	changeRequest.setIdentifier(bug.getID());
	changeRequest.setTitle(bug.getSummary());
	changeRequest.setStatus(bug.getStatus());

Bugzilla bugs also have attributes that do not map to any OSLC Change Management properties but that are required for Bugzilla. We should make these available in our RDF/XML representations by using the RDF predicates that [Bugzilla defines for Bug lists](http://www.bugzilla.org/docs/2.18/html/faq.html#faq-phb-data), and we'll use the unique namespace `bugz` as a prefix (defined in `Constants.java` as shorthand for <http://www.bugzilla.org/rdf#>):

| Bugzilla Bug field | Maps to RDF predicate | Prefixed name*
| ------------------ | --------------------- | ---------------
| product | http://www.bugzilla.org/rdf#product | bugz:product
| component | http://www.bugzilla.org/rdf#component | bugz:component
| version | http://www.bugzilla.org/rdf#version | bugz:version
| priority | http://www.bugzilla.org/rdf#priority | bugz:priority
| platform | http://www.bugzilla.org/rdf#platform | bugz:platform
| op_sys | http://www.bugzilla.org/rdf#op_sys | bugz:operatingSystem

<small>(* Prefix may be different depending on namespace prefix declaration in the XML)</small>

We set these properties in the `fromBug()` method in the **BugzillaChangeRequest** class. Here's the code that sets `bugz:product` and `bugz:component`:

	changeRequest.setProduct(bug.getProduct());
	changeRequest.setComponent(bug.getComponent());

You can explore the `fromBug()` method to see how the other properties are set.


## Providing OSLC representations of Bugzilla bugs

Like with the **ServiceProviderService** and **ServiceProviderCatalogService** (discussed in [in more detail in the previous section](1_2_providing_service_resources)), the **BugzillaChangeRequestService** class has many JAX-RS methods to handle both collections of BugzillaChangeRequests and individual BugzillaChangeRequests with a a variety of HTTP requests and output formats.

Open `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.oslc4j.bugzilla.services** package. 

Note the `@Path` annotation near the top of the class:

    @Path("{productId}/changeRequests")

Recall that in `ServiceProviderCatalogSingleton.java` we registered a Service Provider for every Bugzilla product and used the product ID of the product in the URL for the Service Provider. So if the ID of a Bugzilla product is **2**, our base URL for the **BugzillaChangeRequestService** methods will be: 

    http://hostname:8080/OSLC4JBugzilla/services/2/changeRequests

### Providing representations of Bugzilla Bugs as RDF+XML or JSON 

As with Service Providers and the Service Provider Catalog, with Eclipse Lyo we do not have to write manually code the RDF or JSON representation of a bug; the message body writers in Eclipse Lyo automatically serialize the Java object into the appropriate machine-readable format.

The output is handled by the following methods in the __BugzillaChangeRequestService__ class:

+ `getChangeRequests()`: RDF/XML, XML (legacy) and JSON (legacy) representation of a change request collection
+ `getChangeRequest()`: RDF/XML, XML (legacy), and JSON (legacy) representation of a single change request 

Without Eclipse Lyo you could __dispatch a JSP template__, or use an __RDF API__ provided by Jena, for example, to generate the appropriate output format. 

#### Viewing the RDF+XML or JSON representation of a collection of Bugzilla bugs

The following assumes the Bugzilla adapter is running at `localhost:8080/OSLC4JBugzilla`

In Firefox or Chrome, open the Poster plugin.

for the __URL__ field, type the URL for a list of all the bugs for a product:

    http://localhost:8080/OSLC4JBugzilla/services/{productId}/changeRequests

For example, with a product ID of **1**:

    http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests

For the __User Auth__ fields, type your Bugzilla username and password.

On the Headers tab, for the **Name** type `Accept` and for the **Value** type any of the following:

+ `application/rdf+xml`
+ `application/json`
+ `application/xml`

Then, click **Add/Change** to add the `Accept` header.

Click **Get** to execute the HTTP GET method and you should receive the collection of bugs in the format you requested via `Accept` header. Eclipse Lyo and JAX-RS produce the correct serialization based on the `Accept` header.

#### Viewing the RDF+XML or JSON representation of a Bugzilla bug

Follow the procedure above for a collection of bugs, but for the __URL__ field, type the URL for a single bug: 

    http://localhost:8080/OSLC4JBugzilla/services/{productId}/changeRequests/{bugId}

For example, with a Product ID of **1** and a Bug ID of **10**:

    http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests/10

Click **Get** and you should receive the bug in the format you requested via `Accept` header. 

### Displaying a collection of Bugzilla bugs as HTML

Eclipse Lyo can simplify providing collections of bugs in machine-readable formats, but we should also provide a more human-friendly HTML listing of Bugzilla bugs.

In `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.oslc4j.bugzilla.services** package find the `getHtmlCollection()` method.

	@GET
	@Produces({ MediaType.TEXT_HTML })
	public Response getHtmlCollection( @PathParam("productId") final String productId, […] ) throws ServletException, IOException
	{
		/* [code for returning a list of bugs with HTML] */
	}

This method's basic activity is to retrieve a list of bugs for a Bugzilla product…

	final List<BugzillaChangeRequest> results =
	  BugzillaManager.getBugsByProduct(
	    httpServletRequest, 
	    productId, 
	    page, 
	    limit,
	    where, 
	    prefixMap, 
	    propMap, 
	    orderBy,
		searchTerms);

… and dispatch that list to a template (`/cm/changerequest_collection_html.jsp`):

    httpServletRequest.setAttribute("results", results);
    
    /** 
     * … 
     */
    
    RequestDispatcher rd = httpServletRequest.getRequestDispatcher(
    "/cm/changerequest_collection_html.jsp"
    );
	rd.forward(httpServletRequest,httpServletResponse);   

There are multiple parameters for this function that allow you to filter the collection with queries, paginate the results, and change the sort order. The Bugzilla Adapter does not use all of these parameters; however they are necessary for full support of [OSLC Queries](http://open-services.net/bin/view/Main/OSLCCoreSpecQuery).

Open the file `/src/webapp/cm/changerequest_collection_html.jsp` in **org.eclipse.lyo.oslc4j.bugzilla**. The HTML layout is nearly identical to that of the Service Providers and Catalog. 

Towards the top, you'll see that we receive the data:

	<%
	  List<BugzillaChangeRequest> changeRequests = (List<BugzillaChangeRequest>) request.getAttribute("results");
	  ServiceProvider serviceProvider = (ServiceProvider) request.getAttribute("serviceProvider");
	  String bugzillaUri = (String) request.getAttribute("bugzillaUri");
	  String queryUri = (String)request.getAttribute("queryUri");
	  String nextPageUri = (String)request.getAttribute("nextPageUri");
	%>

And towards the bottom of the file, we loop through the list of bugs and output the title/summary and a link as HTML:

	<h1>Query Results</h1>

	<% for (BugzillaChangeRequest changeRequest : changeRequests) { %>                
	<p>Summary: <%= changeRequest.getTitle() %><br /><a href="<%= changeRequest.getAbout() %>">
	  <%= changeRequest.getAbout() %></a></p>
	<% } %>
	
#### Browsing all the bugs for a Bugzilla Product

Let's try it out! From the Service Provider Catalog, you can navigate to a list of all bugs for a product.

1. If you’re running the example applications, browse to <http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton>.
2. Click on the link for any Service Provider for a product (for example, if the product ID is "1": <http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/1>.
3. Then click on the first link under the **OSLC-CM Resource Query Capability and Resource Shape** heading. For example, if the product ID is "1":     <http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests>

You should see a page with links to the bugs, similar to this:

![An HTML page in a browser showing a list of Bugzilla bugs](http://open-services.net/uploads/resources/collection-of-bugs-html.png)

### Forwarding HTML requests for single Bugzilla bugs

The Bugzilla application itself can create an HTML page with all the details about a bug – that's one of its primary features – so why recreate the wheel? 

In the **BugzillaChangeRequestService** class, note the `getHtmlChangeRequest()` method:

	@GET
	@Path("{changeRequestId}")
	@Produces({ MediaType.TEXT_HTML })
	public Response getHtmlChangeRequest(@PathParam("productId")       final String productId,
									 @PathParam("changeRequestId") final String changeRequestId) throws ServletException, IOException, URISyntaxException
	{	
		String forwardUri = BugzillaManager.getBugzillaUri() + "show_bug.cgi?id=" + changeRequestId;
		httpServletResponse.sendRedirect(forwardUri);
		return Response.seeOther(new URI(forwardUri)).build();			
	}

Simple enough: given the ID number (`{changeRequestId}`) for a particular bug, the OSLC Bugzilla adapter will forward you directly to the web page for the bug in Bugzilla (`show_bug.cgi?id={changeRequestId}`). For example, a request from the adapter for bug 531 in Product 1 at the following URL…

    http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests/531
    
… will forward you to the Bugzilla page for the bug at this URL (if you are running Bugzilla using the provided Docker instructions):

    http://localhost/bugzilla/show_bug.cgi?id=531

That's useful on its own, but OSLC also specifies a [method called UI Preview ](https://archive.open-services.net/bin/view/Main/OslcCoreUiPreview.html) for showing preview information about a resource in another tool. We'll tackle these rich preview formats in the next section.

[Next: Part 1.4, UI Preview](1_4_ui_preview)