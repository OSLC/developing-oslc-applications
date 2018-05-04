# JUnit Tests

Sample JUnit tests are provided to test the CRUD operations on the IoT Platform DeviceType resource in `com.ibm.oslc.adaptor.tests.CE4IoTConnectorTests.java`. This can be used as a pattern to develop tests for other resources as they are supported.



There are a few considerations to address in implementing these JUnit test cases that are covered in this section. 

There are also opportunities to introduce other automated tests for the generated Web UI, especially for the creation and selection dialogs, and the small and large preview dialogs. These tests are currently done manually. 

## OslcClient login

The OSLC4J OslcClient provides OAuth and Jazz FORM based login, and these are what is supported by the jazz.net apps. But does not directly support pre-emptive login with user credentials which is required by the IBM Watson IoT Platform. There's no constructor `OslcClient(String userId, String password)`. These a straightforward work around demonstrated in the following code fragment (which comes from C4IoTConnectorTests.java). The workaround is to construct a simple OslcClient, and then add an Authorization header that will be included on all requests.

```
		try {
			client = new OslcClient();
			// Add a receptor to set the Authorization header as a default 
			// header for all requests
			Header header = new BasicHeader(HttpHeaders.AUTHORIZATION,  
			    "Basic "+Base64.encode((userId+":"+password).getBytes()));
			List<Header> headers = new ArrayList<Header>();
			headers.add(header);
			RequestDefaultHeaders defaultHeaders = new RequestDefaultHeaders(headers);
			((DefaultHttpClient)client.getHttpClient()).addRequestInterceptor(defaultHeaders);

			String catalogUrl = serverUrl + "/services/catalog/singleton";
			
			String orgTitle = "IoT Platform Service Provider: "+orgId+"(/"+orgId+")";
			String serviceProviderUrl = client.lookupServiceProviderUrl(catalogUrl, orgTitle);

			queryCapability = client.lookupQueryCapability(serviceProviderUrl,
					Oslc_iotDomainConstants.IOT_PLATFORM_NAMSPACE, Oslc_iotDomainConstants.DEVICETYPE_TYPE);

			creationFactory = client.lookupCreationFactory(serviceProviderUrl,
					Oslc_iotDomainConstants.IOT_PLATFORM_NAMSPACE, Oslc_iotDomainConstants.DEVICETYPE_TYPE);
		} catch (Exception e) {
			e.printStackTrace();
		}
```

At some point, this simple approach should be migrated into the eclipse/Lyo Java client API. 

You will probably get deprecated code warnings in this code because OSLC4J OslcClient needs to be updated to use the updated HttpClient


## A Typical Resource Test Case

The tests for CRUD operations on resources follow a typical pattern:

1. Create a new resource
2. Read the resource you just created
3. Update the resource
4. Read back the resource and make sure the update was applied
5. Delete the created resource

This test pattern doesn't require much prior setup, and leaves the data source unchanged after it runs successfully.

Here's the implementation of this typical pattern on Watson IoT Platform DeviceType:

```
	@Test
	public void testDeviceType() throws Exception {
		String uri = creationFactory.replace("devicetype", "iotDeviceTypes") + "/TestDeviceType";

		// Create
		DeviceType deviceType = new DeviceType(new URI(uri));
		deviceType.setIdentifier("TestDeviceType");
		deviceType.setTitle("TestDeviceType");
		// TODO: add values to all the supported properties
		deviceType.setDescription("This is a test device that will be deleted");
		ClientResponse response = client.createResource(creationFactory, deviceType, OSLCConstants.CT_RDF);
		assertEquals(response.getStatusCode(), HttpStatus.SC_CREATED);
		logger.info("Created DeviceType: " + deviceType.getTitle());
		response.consumeContent();

		// Read
		deviceType = client.getResource(uri).getEntity(DeviceType.class);
		assertEquals("TestDeviceType", deviceType.getIdentifier());
		// TODO: Check all the read properties to be sure they are what was set when the resource was created
		logger.info("Read DeviceType: " + deviceType.getTitle());
		response.consumeContent();

		// Update
		deviceType.setDescription("This is the updated description");
		// TODO: make changes to more of the properties
		response = client.updateResource(uri, deviceType, OSLCConstants.CT_RDF);
		assertEquals(response.getStatusCode(), HttpStatus.SC_OK);
		logger.info("Updated DeviceType: " + deviceType.getTitle());
		response.consumeContent();
		
		// Read back the DeviceType that was just updated
		deviceType = client.getResource(uri).getEntity(DeviceType.class);
		// TODO: Check that all of the updated properties have the expected values
		assertEquals(deviceType.getDescription(), "This is the updated description");
		logger.info("Read updated DeviceType: " + deviceType.getTitle());
		response.consumeContent();

		// Delete
		response = client.deleteResource(uri);
		assertEquals(response.getStatusCode(), HttpStatus.SC_OK);
		logger.info("Deleted DeviceType: " + uri);
		response.consumeContent();
	}
```
Eventually test cases for all supported IoT Platform Resources should be implemented. But since this is intended to be incomplete sample code for the purposes of enhancing the OSLC Developer Guide, these details are not covered.
