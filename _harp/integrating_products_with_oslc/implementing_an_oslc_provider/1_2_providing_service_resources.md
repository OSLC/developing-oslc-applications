# Providing Service Providers and Catalogs 

The next step in implementing the OSLC Change Management specification is to determine what high-level organizational concept in your product best maps to [OSLC Service Providers](https://open-services.net/resources/oslc-primer/#serviceprovider) – the central organizing concept of OSLC that represents a "container" of resources.

In Bugzilla, bugs are organized by Product. Before you can use Bugzilla, you have to tell the system which Products exist in order to report bugs against them.

Given that, in our adapter each Bugzilla Product will be represented by an OSLC Service Provider REST service. Each Service Provider will include URIs for [a Delegated UI for bug selection](1_5_ui_selection), a [Delegated UI for bug creation](1_6_ui_creation), a Query Capability so that bugs can be queried via HTTP GET, and [a Creation Factory](1_7_factory) so that new bugs can be created via HTTP POST.

To enable client programs to find the Service Providers provided by Bugzilla (and because one Bugzilla instance can have multiple Products), we'll use [an OSLC Service Provider Catalog](https://open-services.net/resources/oslc-primer/#serviceprovidercatalog). When a client wants to connect to Bugzilla, it first fetches the catalog, which provides a list of Service Providers. In the end, a client can start with the URI of the one Service Provider Catalog offered by Bugzilla and navigate to the Service Providers (one per Product in Bugzilla).

Here are the URLs that will be supported with our adapter (running at `/OSLC4JBugzilla/`) for our OSLC-CM implementation:

+ `http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton`  
    This URL will return the [OSLC Service Provider Catalog](https://open-services.net/resources/oslc-primer/#serviceprovidercatalog)
+ `http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/{product_id}`  
    Returns the [OSLC Service Provider](https://open-services.net/resources/oslc-primer/#serviceprovider) for the Product identified by {product_id} number
+ `http://localhost:8080/OSLC4JBugzilla/services/{product_id}/changeRequests`
    If using HTTP GET, returns a list of bugs in the product identified by {product_id}; if using HTTP POST, initiates the Creation Factory for creating a new bug and returns that new bug
+ `http://localhost:8080/OSLC4JBugzilla/services/{product_id}/changeRequests/{change_request_id}`
    Returns the Change Request identified by ID {change_request_id}, in a variety of content-types
+ `http://localhost:8080/OSLC4JBugzilla/services/{product_id}/changeRequests/selector`
    This URL is for the delegated UI selection dialog for the Product identified by ID {product_id}
+ `http://localhost:8080/OSLC4JBugzilla/services/{product_id}/changeRequests/creator`
    Returns Delegated UI creation dialog for the Product identified by ID {product_id}
+ `http://localhost:8080/OSLC4JBugzilla/services/resourceShapes/changeRequest`
    Returns the creation and query [Resource Shape](https://open-services.net/resources/oslc-primer/#resourceshapes) for Bugzilla bugs

Each of of the URLs above will be handled by a JAX-RS annotated method and our code will have to be able to form all of those types of URLs. That brings us to an important point about OSLC:

## Clients don't need to form URLs

With OSLC, there's rarely any need to form URLs. Clients should not be constructing URLs, or making assumptions about how URLs are formed; __instead they should be able to navigate__ to all of the other REST service URLs by following links from a Service Provider Catalog.


## Basic application architecture

On the OSLC4J Bugzilla application, all REST services are handled by a Bugzilla Application JAX-RS servlet, which is mapped to the URL pattern `/services/*` in `OSLC4JBugzilla/src/main/webapp/WEB-INF/web.xml`:

    <servlet>
      <servlet-name>JAX-RS Servlet</servlet-name>
      <servlet-class>org.apache.wink.server.internal.servlet.RestServlet</servlet-class>   
      <init-param>
        <param-name>javax.ws.rs.Application</param-name>
        <param-value>org.eclipse.lyo.oslc4j.bugzilla.services.BugzillaApplication</param-value>
      </init-param>
      <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
      <servlet-name>JAX-RS Servlet</servlet-name>
      <url-pattern>/services/*</url-pattern>
    </servlet-mapping>

## Providing a Service Provider Catalog

In our adapter, we use a simple pattern to implement OSLC REST services: for each operation, a JAX-RS method will accept incoming requests, load the data necessary to render a response, perform the requested operation, and then render the resulting RDF or other representations.

The Service Provider Catalog is defined in **ServiceProviderCatalogService** (in the **org.eclipse.lyo.oslc4j.bugzilla.services** package). The catalog is available at the URL `http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton` and will list the OSLC Service Providers (one per Bugzilla product).

### Defining a JAX-RS method for the Service Provider Catalog

In the file `ServiceProviderCatalogService.java` (in the **org.eclipse.lyo.oslc4j.bugzilla .servlet** package), view the JAX-RS annotation which defines the class that will run at `http://localhost:8080/OSLC4JBugzilla/services/catalog/`:

	@Path("catalog")
	public class ServiceProviderCatalogService
	{
		[ServiceProviderCatalog code]
	}

That class has a variety of methods that will return a Service Provider Catalog in a variety of formats. More on those later on.

### Retrieving Bugzilla product IDs

To build our catalog, we register the Bugzilla product IDs with the **ServiceProviderCatalogSingleton** class (in the **org.eclipse.lyo.oslc4j.bugzilla.servlet** package). The major activity happens in the **initServiceProvidersFromProducts()** method.

First, we create a connection to Bugzilla:

    BugzillaConnector bc = BugzillaManager.getBugzillaConnector(httpServletRequest);

If there's a valid connection, we fetch a list of Bugzilla products:

    GetAccessibleProducts getProductIds = new GetAccessibleProducts();
    bc.executeMethod(getProductIds);
    Integer[] productIds = getProductIds.getIds();
    
    String basePath = BugzillaManager.getBugzServiceBase();
    
Then for each Bugzilla product, we register an OSLC Service Provider:

	for (Integer p : productIds) {
		String productId = Integer.toString(p);
		
		if (! serviceProviders.containsKey(productId)) {
					
			GetProduct getProductMethod = new GetProduct(p);
			bc.executeMethod(getProductMethod);
			String product = getProductMethod.getProduct().getName();
		
		
			Map<String, Object> parameterMap = new HashMap<String, Object>();
			parameterMap.put("productId",productId);
			final ServiceProvider bugzillaServiceProvider = BugzillaServiceProviderFactory.createServiceProvider(basePath, product, parameterMap);
			registerServiceProvider(basePath,bugzillaServiceProvider,productId);
		}
	}

(Of particular note is the `parameterMap` HashMap, which will be used to add the Bugzilla productId to the URLs of our services in the **BugzillaChangeRequestService** class. More on that later.)

### Displaying the Service Provider Catalog as HTML

Back in the file `ServiceProviderCatalogService.java` (in the **org.eclipse.lyo.oslc4j.bugzilla.services** package), view the **getHtmlServiceProvider()** method, which forwards the `catalog` object to a JSP template to produce the HTML:

	if (catalog !=null )
	{
		httpServletRequest.setAttribute("bugzillaUri", BugzillaManager.getBugzillaUri());
		httpServletRequest.setAttribute("catalog",catalog);
	
		RequestDispatcher rd = httpServletRequest.getRequestDispatcher("/cm/serviceprovidercatalog_html.jsp");
		try {
			rd.forward(httpServletRequest, httpServletResponse);
		} catch (Exception e) {				
			e.printStackTrace();
			throw new WebApplicationException(e);
		} 
	}

Next, view the file `src/main/webapp/cm/serviceprovidercatalog_html.jsp`, which is the JSP template for displaying the catalog in HTML. It's a pretty typical HTML page and it reuses stylesheets from the Bugzilla application. 

Of particular note are the dynamic segments. First, near the top of the file, the catalog variable is set from the passed catalog attribute:

	String bugzillaUri = (String) request.getAttribute("bugzillaUri");
	ServiceProviderCatalog catalog = (ServiceProviderCatalog)request.getAttribute("catalog");

And near the bottom of the file, we loop through the service providers in the catalog and output a heading with the name of the product (**getTitle()**) and a link (__getAbout()__):

	<% for (ServiceProvider s : catalog.getServiceProviders()) { %>
	<h3>Service Provider for Product <%= s.getTitle() %></h3>
	<p><a href="<%= s.getAbout() %>">
			<%= s.getAbout() %></a></p>
	<% } %>

If you're running the example applications, you can see this in action at <http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton>.

![Screen capture of the Service Provider Catalog in a web browser](http://open-services.net/uploads/resources/serviceprovidercatalog-html.png)

## Retrieving and displaying details about a Service Provider

Next, we'll display the details for each product as an OSLC Service Provider in an HTML page. 

Similar to the Service Provider Catalog, the __ServiceProviderService__ class in the **org.eclipse.lyo.oslc4j.bugzilla.services** package defines the URL structure:

    @Path("serviceProviders")
	public class ServiceProviderService
	{
	  [ServiceProviderClass code]
	}

The class **ServiceProviderService** has several methods that fetch the appropriate data and present it in a variety of formats. For the moment, we'll explore the **getHtmlServiceProvider()** method:

	@GET
	@Path("{serviceProviderId}")
	@Produces(MediaType.TEXT_HTML)
	public void getHtmlServiceProvider(@PathParam("serviceProviderId") final String serviceProviderId)
	{
		ServiceProvider serviceProvider = ServiceProviderCatalogSingleton.getServiceProvider(httpServletRequest, serviceProviderId);
		
		Service [] services = serviceProvider.getServices();
		
		if (services !=null && services.length > 0)
		{
			//Bugzilla adapter should only have one Service per ServiceProvider
			httpServletRequest.setAttribute("bugzillaUri", BugzillaManager.getBugzillaUri());
			httpServletRequest.setAttribute("service", services[0]);
			httpServletRequest.setAttribute("serviceProvider", serviceProvider);
	
			RequestDispatcher rd = httpServletRequest.getRequestDispatcher("/cm/serviceprovider_html.jsp");
			try {
				rd.forward(httpServletRequest, httpServletResponse);
			} catch (Exception e) {				
				e.printStackTrace();
				throw new WebApplicationException(e);
			} 
		}
	}

Like the Service Provider Catalog class, we retrieve information from Bugzilla; however, here we only retrieve information about a single Product (from the URL /serviceProviders/{ProductId}). We then dispatch `serviceprovider_html.jsp` to display information about it in HTML.

### Displaying the Service Provider as HTML

In `src/main/webapp/cm/serviceprovider_html.jsp`, view near the top of the file where we assemble all the URLs for OSLC services (which we'll cover later) such as query capability, delegated dialogs, and resource shapes:

	<%
	String bugzillaUri = (String) request.getAttribute("bugzillaUri");
	Service service = (Service)request.getAttribute("service");
	ServiceProvider serviceProvider = (ServiceProvider)request.getAttribute("serviceProvider");
	
	//OSLC Dialogs
	Dialog [] selectionDialogs = service.getSelectionDialogs();
	String selectionDialog = selectionDialogs[0].getDialog().toString();
	Dialog [] creationDialogs = service.getCreationDialogs();
	String creationDialog = creationDialogs[0].getDialog().toString();
	
	//OSLC CreationFactory and shape
	CreationFactory [] creationFactories = service.getCreationFactories();
	String creationFactory = creationFactories[0].getCreation().toString();
	URI[] creationShapes = creationFactories[0].getResourceShapes();
	String creationShape = creationShapes[0].toString();
	
	//OSLC QueryCapability and shape
	QueryCapability [] queryCapabilities= service.getQueryCapabilities();
	String queryCapability = queryCapabilities[0].getQueryBase().toString();
	String queryShape = queryCapabilities[0].getResourceShape().toString();	

	%>

And towards the bottom, you'll find the HTML where we display those URLs:

	<h2>OSLC-CM Resource Selector Dialog</h2>
	<p><a href="<%= selectionDialog %>">
				<%= selectionDialog %></a></p>
	
	<h2>OSLC-CM Resource Creator Dialog</h2>
	<p><a href="<%= creationDialog %>">
				<%= creationDialog %></a></p>
	
	<h2>OSLC-CM Resource Creation Factory and Resource Shape</h2>
	<p><a href="<%= creationFactory %>">
				<%= creationFactory %></a></p>
	<p><a href="<%= creationShape %>">
				<%= creationShape %></a></p>
	
	<h2>OSLC-CM Resource Query Capability and Resource Shape</h2>
	<p><a href="<%= queryCapability %>">
				<%= queryCapability %></a></p>
	<p><a href="<%= queryShape %>">
				<%= queryShape %></a></p>


### Browsing the Service Provider Catalog and Service Providers

If you're running the example applications, browse to <http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton>.

Click on the link for any Service Provider (the number of Service Providers you'll see depends on the number of available Products on your Bugzilla server). You should see an HTML page with links to the available REST services, similar to this:

![Screen capture of a Service Provider in a web browser](http://open-services.net/uploads/resources/serviceprovidercatalog-html.png)



## Providing RDF+XML or JSON representations of Service Providers and Service Provider Catalogs 

Although the HTML representations we created above are useful as an educational and debugging tool, to connect to another tool (and comply with the specification!) we'll need to also create machine-readable formats, specifically RDF+XML and JSON.


### Providing RDF+XML or JSON representations manually

One way you could create RDF+XML or JSON representations of these OSLC resources would be nearly the same as the HTML representation: build and gather the data for the resource and dispatch a JSP template to output it in the proper format.

Your JSP template for RDF+XML for the ServiceProvider might look similar to this:

	<?xml version="1.0" encoding="UTF-8"?>
	<%@ page contentType="application/rdf+xml" language="java"%>
	<%@ page import="java.net.URI" %>
	<%@ page import="jbugz.base.Product" %>  
	<%
	// Load up the data sent in with the JSP template
	String bugzillaUri = (String) request.getAttribute("bugzillaUri");
	Service service = (Service)request.getAttribute("service");
	ServiceProvider serviceProvider = (ServiceProvider)request.getAttribute("serviceProvider");
	
	// Build the OSLC dialogs here
	// ...
	
	%>
	<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
			xmlns:dcterms="http://purl.org/dc/terms/"
			xmlns:oslc="http://open-services.net/ns/core#">
	
	<oslc:ServiceProvider
		rdf:about="<%= serviceProvider.getAbout() %>">
	<dcterms:title>OSLC-CM Adapter/Bugzilla Service Provider: 
	Product <%= serviceProvider.getTitle() + "(" + serviceProvider.getIdentifier() + ")" %></dcterms:title>
	<dcterms:description>
	Enables navigation to OSLC-CM Resource Creator and Selector Dialogs
	</dcterms:description>
	
	<oslc:service>
		<oslc:Service>        
			<oslc:domain rdf:resource="http://open-services.net/ns/cm#" />
			<!-- URLs to your OSLC services (dialogs, etc.) will go here -->
		</oslc:Service>
	</oslc:service>
	
	</oslc:ServiceProvider>
	</rdf:RDF>

Although using another JSP template gives you complete control over the output, you have a higher risk of creating improperly formatted output. There are other options:

+ **Use an RDF API**: build an RDF graph of triples and then serialize it into RDF+XML. This ensures proper formatting, but it's another API to work with.
+ **Use an XML DOM API**: build up a DOM and then serialize it to XML. 

Use whatever you're most comfortable with. However, with Eclipse Lyo there's an easier way.

### Providing RDF+XML or JSON representations with OSLC4J

Open the `ServiceProviderService.java` class in the **org.eclipse.lyo.oslc4j.bugzilla.services** package and check out the **getServiceProvider** method:

	@GET
	@Path("{serviceProviderId}")
	@Produces({OslcMediaType.APPLICATION_RDF_XML, OslcMediaType.APPLICATION_XML, OslcMediaType.APPLICATION_JSON})
	public ServiceProvider getServiceProvider(@PathParam("serviceProviderId") final String serviceProviderId)
	{
		httpServletResponse.addHeader("Oslc-Core-Version","2.0");
		return ServiceProviderCatalogSingleton.getServiceProvider(httpServletRequest, serviceProviderId);
	}

That's it for outputting Service Providers in a XML, RDF+XML, and JSON! You'll find similar code for the Service Provider Catalog in the `ServiceProviderCatalogService.java` file.

What's happening is the OSLC4J toolkit includes JAX-RS message body writers that serialize the Java representation of the Service Provider (or any OSLC resource) to RDF+XML, JSON, or XML. Likewise, it can convert OSLC resources in any of those formats back into Java objects. We'll explore this more in the next topic.

#### Viewing the machine-readable formats of a Service Provider Catalog

Let's try it out!

1. In Firefox or Chrome, open the Poster plugin. Poster is a browser plugin (for [Firefox](https://addons.mozilla.org/en-us/firefox/addon/poster/) and [Chrome](https://chrome.google.com/webstore/detail/chrome-poster/cdjfedloinmbppobahmonnjigpmlajcd)) which can be used to send HTTP REST requests with full control over HTTP headers and their values.
2. For the __URL__ field, type the URL for the Service Provider Catalog: 

        http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton
3. For the __User Auth__ fields, type your Bugzilla username and password.
4. On the Headers tab, for the **Name** type `Accept` and for the **Value** type any of the following:
	  + `application/rdf+xml`
	  + `application/json`
	  + `application/xml`

     Then, click **Add/Change** to add the `Accept` header.
5. Click **Get** to execute the HTTP GET method. You should receive the complete Service Provider Catalog in the format you requested via `Accept` header. OSLC4J and JAX-RS produce the correct serialization based on the `Accept` header.

Next, try it with the URL for one of the Service Providers. (The exact URL will depend on the Product ID of the products on your Bugzilla server.)

Now, a client can start with a single URL (for the catalog) and navigate to all of the Service Providers. A client could use this to show a list of Products to a user and allow them to pick which ones to report bugs against, or query for existing bugs.

[Next: Part 1.3, Intro to the Lyo SDK](1_3_intro_to_oslc4j)
