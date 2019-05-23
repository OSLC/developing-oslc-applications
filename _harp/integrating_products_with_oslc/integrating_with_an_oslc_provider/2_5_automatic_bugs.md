# Implementing automated bug creation 

In this section we'll be building the foundations for a Java service that can automatically create a new bug in Bugzilla whenever a build or a test (from another program) fails. Here's roughly how the entire system would work:

1. The build scripts (or testing programs) will be configured to report bugs against a product in Bugzilla; with the ID for the product, these applications can retrieve the OSLC Service Provider that represents that product.
2. The build scripts will retrieve the Service Provider for the product and then parse it to find the Creation Factory URL, or the URL to which you can POST to create new bugs
3. The scripts will create an RDF/XML representation of a new bug to be created; if there is an OSLC Resource Shape, they will use that to determine any required fields
4. The script will send the RDF/XML representation to the Creation Factory URL using HTTP POST; the adapter will then interact with Bugzilla to create a new bug.

As with the last section, we won't create an entire service; instead, we'll focus on the OSLC-specific parts, like parsing RDF resources and POSTing to an OSLC Creation Factory.

## Using a Service Provider Catalog to find a Service Provider.

For our OSLC-CM Bugzilla Adapter (or any OSLC provider), the starting point for exploring OSLC capabilities is the [Service Provider Catalog document](http://archive.open-services.net/resources/tutorials/oslc-primer/serviceprovidercatalog). 

You can read more about [implementing Service Provider Catalogs for our Bugzilla Adapter here](/integrating_products_with_oslc/implementing_an_oslc_provider/1_2_providing_service_resources/). In short, we represent every Bugzilla Product as a [Service Provider resource](http://archive.open-services.net/resources/tutorials/oslc-primer/serviceprovider), and we collect all of those Service Providers in one Service Provider Catalog. 

The general principle is that clients should only need to know the URL for the Catalog; from the Catalog, clients can navigate to the other OSLC services. In other words, _clients should not have to hard-code URLs to individual OSLC services_.

Here's a sample Service Provider Catalog document. You can see something similar if you're running the Bugzilla Adapter and run an HTTP GET request to `http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton` with an `Accept` header of `application/rdf+xml`:

	<?xml version="1.0"?>
	<rdf:RDF xmlns:oslc="http://open-services.net/ns/core#" 
	  xmlns:dcterms="http://purl.org/dc/terms/" 
	  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
	  <oslc:ServiceProviderCatalog rdf:about="http://localhost:8080/OSLC4JBugzilla/catalog">
		<dcterms:title>OSLC-CM Adapter/Bugzilla Service Provider Catalog</dcterms:title>
		<dcterms:description>
		Enables navigation to Service Provider for each Product
		against which bugs may be reported.
		</dcterms:description>
		<oslc:domain rdf:resource="http://open-services.net/ns/cm#"/>
  
		<oslc:serviceProvider>
		  <oslc:ServiceProvider rdf:about=
			"http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/2">
			<dcterms:title>FoodReplicator</dcterms:title>  
		  </oslc:ServiceProvider>
		</oslc:serviceProvider>
   
		<oslc:serviceProvider>
		  <oslc:ServiceProvider rdf:about=
			"http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/19">
			<dcterms:title>Sam's Widget</dcterms:title>
		  </oslc:ServiceProvider>
		</oslc:serviceProvider>
	 
	  </oslc:ServiceProviderCatalog>
	</rdf:RDF>

The above example catalog has two `oslc:serviceProvider` values (i.e. <http://open-services.net/ns/core#ServiceProvider>). The URL of each provider is specified in the `rdf:about` attribute, and its title is specified as a `dcterms:title` property value. For example, the OSLC Service Provider resource for the FoodReplicator product is located at `http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/2`.

As we discussed in the previous section, you should use an RDF parser like Jena to parse these documents programmatically.


## Using a Service Provider to find a Creation Factory 

Once we've navigated from a Catalog to a Service Provider resource, here's a sample of what you might see (as an RDF/XML document):

	<?xml version="1.0" encoding="UTF-8"?>
	<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"    
	  xmlns:dcterms="http://purl.org/dc/terms/"
	  xmlns:oslc="http://open-services.net/ns/core#">
	  <oslc:ServiceProvider rdf:about="http://localhost:8080/OSLC4JBugzilla/services/serviceProviders/2">
		<dcterms:title>OSLC-CM Adapter/Bugzilla Service Provider:
		   Product FakePortal(2)</dcterms:title>
		<dcterms:description>
		   Enables navigation to OSLC-CM Resource Creator and Selector Dialogs
		</dcterms:description>
		<oslc:service>  <!-- (1) -->
		  <oslc:Service>
			<oslc:domain rdf:resource="http://open-services.net/ns/cm#"/>

			<!-- selection and creation dialog information deleted -->

			<oslc:creationFactory> <!-- (2) -->
			  <oslc:CreationFactory>
				<dcterms:title>Change Request Creation Factory</dcterms:title>
				<oslc:resourceType rdf:resource=  <!-- (3) -->
				   "http://open-services.net/ns/cm#ChangeRequest"/>
				<oslc:label>CreationFactory</oslc:label>
				<oslc:creation rdf:resource=  <!-- (4) -->
				   "http://localhost:8080/OSLC4JBugzilla/services/2/changeRequests"/>
				<oslc:resourceShape rdf:resource=  <!-- (5) -->
				   "http://localhost:8080/OSLC4JBugzilla/services/resourceShapes/changeRequest"/>
				<oslc:usage rdf:resource=  <!-- (6) -->
				   "http://open-services.net/ns/core#default"/>
			  </oslc:CreationFactory>
			</oslc:creationFactory>
		  </oslc:Service>
		</oslc:service>
	  </oslc:ServiceProvider>
	</rdf:RDF>
	
You can read more about [implementing Service Providers](/integrating_products_with_oslc/implementing_an_oslc_provider/1_2_providing_service_resources/) and [implementing creation factories](/integrating_products_with_oslc/implementing_an_oslc_provider/1_7_factory/) for our Bugzilla adapter.

Of most interest to our team developing a way to automatically create bugs are the contents of the `<oslc:service>` element (**(1)**). The Service has an `oslc:creationFactory` property (**(2)**) with a value of `oslc:CreationFactory`. The creation factory has values that indicate it is for creating Change Requests (**(3)**), the URI for posting new Change Requests (**(4)**), and the URI of the [Resource Shape](http://archive.open-services.net/resources/tutorials/oslc-primer/resourceshapes) (**(5)**) that lists the required fields for bug creation. The usage value (**(5)**) indicates that this is the default Creation Factory to use.

With this information, the build and testing scripts can parse the Service Provider document and discover the Creation Factory URL, which is the URL for posting new bugs.

First, though, let's explore the Resource Shape document.


## Using a Resource Shape to determine required properties

It's not enough to just know the URL to POST bugs to; the testing scripts must also create a properly formatted OSLC-CM Change Request representation with the required property values and property values that are valid. Each Product defined in Bugzilla might have different required fields, custom fields and different allowed values.

It's entirely possible confer with the Bugzilla system's administration and figure out the required and allowed values, _or_ you could use the OSLC OSLC Creation Factory's [Resource Shape document](http://archive.open-services.net/resources/tutorials/oslc-primer/resourceshapes), which provides the same information.

An example Resource Shape document in RDF/XML form is below (you can see the Resource Shape from our Bugzilla Adapter at <http://localhost:8080/OSLC4JBugzilla/services/resourceShapes/changeRequest>):

	<?xml version="1.0" encoding="UTF-8"?>
	<oslc:Shape xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	   xmlns:dc="http://purl.org/dc/terms/"
	   xmlns:oslc="http://open-services.net/xmlns/oslc-core#"
	   xmlns:oslc_cm="http://open-services.net/xmlns/cm/1.0/"
	   rdf:about="http://localhost:8080/OSLC4JBugzilla/shape?productId=2">

	   <dc:title>This is the resource shape for a new Bugzilla Bug</dc:title>

	   <oslc:property>
		<oslc:Property>
		 <oslc:name>title</oslc:name>
		 <oslc:propertyDefinition rdf:resource=
		  "http://purl.org/dc/terms/title" />
		 <oslc:valueType rdf:resource=
		  "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral" />
		 <oslc:occurs rdf:resource=
		  "http://open-service.net/ns/core#Exactly-one" />
		</oslc:Property>
	   </oslc:property>

	   <oslc:property>
		<oslc:Property>
		 <oslc:name>component</oslc:name>
		 <oslc:propertyDefinition rdf:resource=
		  "http://www.bugzilla.org/rdf#component" />
		 <oslc:valueType rdf:resource=
		  "http://www.w3.org/2001/XMLSchema#string" />
		 <oslc:occurs rdf:resource=
		  "http://open-service.net/ns/core#Exactly-one" />
		 <oslc:allowedValue>Installer</oslc:allowedValue>
		 <oslc:allowedValue>User Interface</oslc:allowedValue>      
		 </oslc:Property>
	  </oslc:property>

	  <!-- other properties omitted -->

	</oslc:Shape>

Inside the root `oslc:Shape` element is the `dc:title` of the shape, which tells us the shape's purpose (1). Next there is a series of property values for the `oslc:property` property. Each one describes the requirements for the property at creation time. In the listing, we omit all but two of the property values: `dc:title` and `bugz:component`.

Each property has a name (`oslc:name`), a link to the property definition (`oslc:propertyDefinition`), the acceptable type of value (`oslc:valueType`) and the cardinality (`oslc:occurs`), and allowed values (`oslc:allowedValue`). In our example above, the `component` property accepts `String` values; the `occurs` value of `Exactly-one` indicates that it is required; and the allowed values are either `Installer` or `User Interface`.

With this information from the Resource Shape document, we can now create and post new bugs.


## Forming an RDF/XML representation of a Bugzilla bug

<div class="callout-box guidance">
<p><strong>Note</strong>: The following discusses using an RDF/XML parser. If you are writing Java, you could also use – in fact, we recommend using – <a href="http://wiki.eclipse.org/Lyo/LyoOSLC4J">OSLC4J</a> to handle conversions between RDF/XML and plain old Java objects. Consider the following to be guidance if you choose to approach this another way.</p>
</div>


Although you could generate RDF/XML through a variety of techniques, we recommend using a dedicated RDF toolkit like [Jena](http://jena.apache.org/). 

We'll create a very simple method below: it accepts strings of various property values and returns an RDF/XML representation of a new bug.

To follow along, open the file `NewDefect.java` in the **org.eclipse.lyo.samples.ninacrm.examples** package and search for the `formNewBug()` method.

First, OSLC-CM requires Change Requests to have an RDF Type and a title:

	Property bugType =
	  new PropertyImpl("http://open-services.net/ns/cm#ChangeRequest");

	Property titleProp =
	  new PropertyImpl("http://purl.org/dc/terms/title");

Next, we know from the Resource Shape document that new bugs must have property values for the Bugzilla bug properties product, version, component, platform and operating system. So we set up Jena property objects for each of those:

	Property versionProp = 
	  new PropertyImpl("http://www.bugzilla.org/rdf#version");

	Property componentProp = 
	  new PropertyImpl("http://www.bugzilla.org/rdf#component");

	Property platformProp = 
	  new PropertyImpl("http://www.bugzilla.org/rdf#platform");

	Property opsysProp = 
	  new PropertyImpl("http://www.bugzilla.org/rdf#opsys");

<div class="note">
We are hard-coding required Bugzilla properties here. It would be better – more flexible and future-proof – to programmatically locate and parse a Resource Shape document to determine the required properties; for simplicity's sake, we do not do so here. We leave that as an exercise for the reader.
</div>

Note that **we did not set the Bugzilla Product**: the product can be determined by the choice of service that you use to post the new bug. (In other words, every Bugzilla product will have its own OSLC Creation Factory.)

Next, we set up a Jena Model object and adds namespace prefixes. These are not strictly necessary, but they will make the RDF/XML a little more readable and make it look more like the examples in the OSLC specifications, which is useful.

	Model model = ModelFactory.createDefaultModel();
	model.setNsPrefix("bugz",    "http://www.bugzilla.org/rdf#");
	model.setNsPrefix("dcterms", "http://purl.org/dc/terms/");
	model.setNsPrefix("oslc_cm", "http://open-services.net/ns/cm#");

Once the Model is set up, we create a Resource object using a base URI that is the empty string. We won't know the URI of the new bug until the OSLC-CM provider has created it and tells us the new URI via the HTTP Location header. 

    com.hp.hpl.jena.rdf.model.Resource resource = model.createResource("");

Once we have a Resource, we are ready to add property values for each of the required properties:

	resource.addProperty(RDF.type,     bugType);
	resource.addLiteral(titleProp,     title);
	resource.addLiteral(versionProp,   version);
	resource.addLiteral(componentProp, component);
	resource.addLiteral(platformProp,  platform);
	resource.addLiteral(opsysProp,     opsys);

Finally, we write out the RDF model in RDF/XML format and return it in string form:

	StringWriter sw = new StringWriter();
	RDFWriter writer = model.getWriter();
	writer.write(model, sw, "/");
	sw.flush();
	return sw.toString();



## Using HTTP to POST a new bug

With the ability to build RDF/XML representations of a bug in place, we can write a simple example that posts an RDF/XML representation of a new bug to an OSLC-CM Provider:

	public static void postNewBug(
					   String creationURL,
					   String title, 
					   String version, 
					   String component, 
					   String platform, 
					   String opsys) {

	  String bug = formNewBug(title, version, component plaform, opsys); // (1) 
	  
	  try {
		 URL createURL = new URL(creationURL);  // (2)
		 
		 HttpURLConnection conn = (HttpURLConnection)createURL.openConnection();
		 conn.setRequestMethod("POST"); // (3) 
		 conn.setDoOutput(true);
		 conn.setRequestProperty("Content-Type", "application/rdf+xml");  // (4)

		 BufferedOutputStream out = new BufferedOutputStream(conn.getOutputStream());
		 out.write(bug.getBytes("UTF-8")); // (5)
		 out.close();

		 BufferedReader in = new BufferedReader( // (6)
		  new InputStreamReader(conn.getInputStream()));          
		 String s;
		 while ((s = in.readLine()) != null) {
		   System.out.println(s);
		 }
		 in.close();

		 int rc = conn.getResponseCode(); // (7)
		 System.out.println("Return status: " + rc);
		 System.out.println("Location: " + conn.getHeaderField("Location")); // (8)
	   }
	   catch (IOException e) {
		 e.printStackTrace();
	   }
	}

The above method accepts as arguments the URL for the creation factory and the required attributes. 

First, we use the `formNewBug()` method (discussed above) to build the RDF/XML representation of the new bug from the passed property values (**(1)**).

Next, we create a URL object with the URL of the target Change Request Creation Factory (**(2)**) and use it to open an HTTP connection. We configure that connection for HTTP POST (**(3)**) and set the HTTP Content-Type to inform the server that we are sending RDF/XML data (**(4)**).

Finally, we write out the bug to the server (**(5)**). To confirm that the POST worked, we write out the results (**(6)**) and the response code (**(7)**) and the Location header (**(8)**). If all went well, the response code should be `201`, which means `Created`, and the Location will be the URI of the newly created bug.

<div class="notice tip">
<div class="header">
<h3 class="title">Try it out!</h3>
</div>
<div class="body">If you'd like to more details or want to try to post a bug using RDF/XML, see <a href="/integrating_products_with_oslc/implementing_an_oslc_provider/1_7_factory/">our walkthrough of implementing a Creation Factory for our Bugzilla adapter</a>.
</div>
</div>

