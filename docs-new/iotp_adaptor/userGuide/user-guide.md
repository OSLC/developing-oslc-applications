# User Guide

## Configuration 

### Step 1: Configure the Adaptor Server

The Adaptor is a REST service that provides the OSLC Resources. Like any REST service, the adaptor is configured with a base URL, on which all the OSLC URLs are built. The base URL is set through the file **adaptor.properties** that you find under the **configuration** folder. Simply update the **baseURL** property according to your needs.

### Step 2: Configure Adaptor for the Toolchain Models

The adaptor needs to know what the toolchain model look like. For this purpose, the adaptor reads model files. The model defines what resources are exposed as OSLC Resources. And for each such resource, the model defines the properties that are exposed (as OSLC Properties), and possibly how the properties are connected to OSLC (or external) resources.

To configure the adaptor according to your models, place the model files under the **models** folder. Model files have a *ttl* extension.

To better understand how models are defined, examine the provided sample models. Further instructions are provided on the [toolchain model tutorial](../toolchain-model.md).

### Step 3: Define & Configure the IoT Platform connections

The adaptor can read data from a number of different IoT Platforms. To do so, the adaptor needs to first be told what platforms to connect to, and how to connect to those platforms. This can be done in a couple of ways:

1. **Through the configuration file.** The file **platforms.properties** lists the different platforms to connect to.
2. **Dynamically through the REST interface.** The adaptor provides REST services to add a platform connection on the fly.

In this instruction, we stick to the first approach.

1. Examine the file **platforms.properties**. It provides a sample connection to a Watson IoT Platform.
2. Update the file to meet your needs.

Note that each Platform connection is assigned a unique (arbitrary) identifier. In the sample file, *sampleWatsonIoTConnector* is the identifier assigned to the Platform connector. The remaining properties for that connector has that identifier as a prefix.

Also note that the last property (i.e. *sampleWatsonIoTConnector.TripletStoreHandler.resourceFactory.maxSize*) controls the max number of cached resources. For a large number of IoT instances, make sure this number is big enough.

### Step 4: Start the Adaptor

Start the adaptor by running the script **start.bat** (on Windows) or **start.sh** (on Linux).

Note that the adaptor will first try to connect to the platforms defined in step 3. If the adaptor cannot connect to any platform (possibly due to the lack of, or wrong, credentials), then the adaptor will fail to start.

Assuming the connection to the platforms is successful, the adaptor is now ready to receive OSLC requests.

## Where to go from here?

Test that the adaptor is running correctly by accessing the Service Provider Catalog. Point your browser to: *${baseURL}/services* 

For a sample hands-on tutorial, go [here](../IoTP-Adaptor-Howto.md).
