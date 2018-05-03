# Exploring the generated code

## Implement IoTPOSLCAdaptorManager.getServiceProviderInfos

get a list of the organization IDs from the IoT Platform
Create a array of ServiceProviderInfos sized by the number of organizations returned
for each orgId by index do:
construct a ServiceProviderInfo and store it at the index position
serviceProviderInfo.name = orgId
serviceProviderInfo.serviceProviderId = orgId (same as the name in this case)

A ServiceProviderInfo has at least a name and serviceProviderId. There can be other extended attributes and methods if needed.

For IoT Platform, ServiceProviderInfo might include:
name = Organization name
serviceProviderId = Organization name


## Resource classes

## Services

## Web application and servlets

## The CE4IoTConnectorManager