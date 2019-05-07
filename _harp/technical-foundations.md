To build software that supports OSLC, you should be familiar with the following concepts:

### Linked data

[Linked data](http://www.w3.org/DesignIssues/LinkedData.html) is the main technical foundation of all of our specifications. The video below provides a brief overview of the value of linked data and how we implement it with OSLC:

<iframe width="640" height="480" src="//www.youtube.com/embed/40mjwqGEKBU" frameborder="0" allowfullscreen></iframe>

If you're new to linked data and RDF, we've put together [a playlist of videos](http://open-services.net/resources/videos/linked-data-and-rdf-overview-playlist/) that can help you catch up.


### RESTful web architecture and HTTP

You should be familiar with designing [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints) applications.

For a quick primer, we recommend [“Learn REST” by Dr. M. Elkstein](http://rest.elkstein.org/), particularly these sections:

1. [What is REST?](http://rest.elkstein.org/2008/02/what-is-rest.html)
2. [REST as Lightweight Web Services](http://rest.elkstein.org/2008/02/rest-as-lightweight-web-services.html)
3. [How Simple is REST?](http://rest.elkstein.org/2008/02/how-simple-is-rest.html)
4. [More Complex REST Requests](http://rest.elkstein.org/2008/02/more-complex-rest-requests.html)
5. [REST Server Responses](http://rest.elkstein.org/2008/02/rest-server-responses.html)

For OSLC implementations, you must use [HTTP protocol](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).


### RDF, Turtle, JSON, and HTML

We require services and resources to be represented in [**RDF**](http://www.w3.org/RDF/), but you might prefer to supplement that with a variety of machine-readable and human-readable formats like Turtle, JSON, or HTML.

Instead of string parsing and regular expressions, you will definitely want to explore using an RDF parser such as [Apache Jena](http://jena.apache.org/).


### OAuth

OSLC does not require OAuth, but it is the most common approach for managing authentication between clients.
