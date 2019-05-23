# Planning out a partial implementation of OSLC-CM 

Our integration use cases that we want to add to Bugzilla require only a partial implementation of the [OSLC Change Management](http://open-services.net/bin/view/Main/CmSpecificationV2) specification:

+ __Service Provider and Catalogs__: These resources describe the services offered and make it possible for consumers of the OSLC CM service to find the ones they need. In Part 2, you will use these to help implement [Automated Bug Creation](../integrating_with_an_oslc_provider/2_5_automatic_bugs) so that the Testing team's build scripts can use Service Provider documents to locate a URL.
+ **OSLC representations for bugs**: This means making each Bug available at a stable URI as an OSLC-CM Change Request resource, with RDF/XML and UI Preview representations via content negotiation. In Part 2, these RDF/XML representations will help [automate customer notifications](../integrating_with_an_oslc_provider/2_4_notify_customers).
+ **Delegated UI for Creation & Selection**: Enables users of other systems to create and select bugs in Bugzilla without leaving the web UI of those other systems. You'll use these dialogs in Part 2's to [make it easy to link a customer incident to a Bugzilla bug](../integrating_with_an_oslc_provider/2_3_delegatedUI).
+ **Creation Factories for bugs**: Enables creation of new bugs by HTTP posting RDF/XML bug representations to the server. We also used this feature in Part 2 [for Automated Bug Creation](../integrating_with_an_oslc_provider/2_5_automatic_bugs).

Although this leaves out some seemingly critical parts of OSLC (including UPDATE and DELETE via HTTP and OSLC Query), that's OK. 

First, though, we need to decide how we'll add OSLC support to the existing applications.

## Different approaches to implementing OSLC support

There are (broadly) three different approaches to implementing an OSLC-CM provider for Bugzilla (or any other software):

+ The __Native Support__ approach is to add OSLC-CM support directly into Bugzilla, modifying whatever code is necessary to implement the OSLC-CM specification.
+ The __Plugin__ approach is add OSLC-CM support to Bugzilla by developing code that plugs-in to Bugzilla and uses its add-on API.
+ The __Adapter__ approach is to create new web application that acts as an OSLC Adapter, runs along-side of Bugzilla, provides OSLC-CM support and "under the hood" makes calls to the Bugzilla web APIs to create, retrieve, update and delete resources.

Although any of these approaches are valid approaches for an OSLC implementation, here are some of the pros and cons of each:

<table cellspacing="0" class="zebra">
	<thead>
		<tr>
			<th>Approach</th>
			<th>Pros</th>
			<th>Cons</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><strong>Native approach</strong></td>
			<td>
				<ul>
					<li>Complete control over the quality implementation</li>
					<li>Good approach for tool vendors shipping products with OSLC support</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>You need control over the application code</li>
					<li>You need to learn product's language and platform</li>
					<li>Not a good approach for customers who want to add OSLC support to a vendor's products</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td><strong>Plugin approach</strong></td>
			<td>
				<ul>
					<li>Uses established and supported mechanism to extend product and add OSLC support</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>Limitations on plugins may limit quality of OSLC implementation</li>
					<li>You need to learn product's language, platform, and plugin architecture</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>
				<strong>Adapter approach</strong></td>
			<td>
				<ul>
					<li>Can be implemented without modifying the product</li>
					<li>Can use your preferred platform and language</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>Limitations of product's API may limit quality of OSLC implementation</li>
					<li>May introduce redundant URL for product resources. For example, adapter-provided URLs must be used instead of native Bugzilla bug URLs</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

In short, the Native approach is the right approach for tool vendor who wants to add OSLC support to the products that they understand well. The Plugin and Adapter approaches are best for when you want to add OSLC support to a tool that you've bought from a tool vendor or obtained from an open source project. If the tool has a good Plugin API and you like the language/platform that it requires, then try the Plugin approach. If not, then an Adapter approach is probably best.

In our case, building an adapter makes the most sense.

## Architecture for the adapter

[Download the OSLC4J Bugzilla adapter](../running_the_examples). We'll be exploring the adapter instead of writing one from scratch.

The OSLC4J Bugzilla adapter is a RESTful web application built on Java EE with [JAX-RS](http://docs.oracle.com/javaee/6/tutorial/doc/giepu.html). It has the following additional dependencies:

+ [OSLC4J SDK part of Eclipse Lyo](../../eclipse_lyo/eclipse-lyo), OSLC4J is a Java toolkit that simplifies building OSLC applications
+ [J2Bugzilla](http://code.google.com/p/j2bugzilla/): Java wrapper classes for Bugzilla's XML-RPC based web services interface

In addition, it uses the following helper classes (in the `utils` directory):

+ **BugzillaHttpClient**: helper classes for doing HTTP GET requests against a Bugzilla server
+ **HttpUtils**: helper classes for working with HTTP requests and responses
+ **StringUtils**: helper classes for dealing with strings
+ **XmlUtils**: helper classes for XML processing

Finally, the JAX-RS resource definitions are in `org.eclipse.lyo.oslc4j.bugzilla.services`.

<div class="notice warning"><p>In older versions of this tutorial and Bugzilla adapter, we defined many  individual servlets in the application's <code>web.xml</code> file; now, the OSLC4J Bugzilla adapter uses JAX-RS to handle URLs, requests, and resources.</p></div>


Next: [Part 1.2, Providing Service Resources](1_2_providing_service_resources)