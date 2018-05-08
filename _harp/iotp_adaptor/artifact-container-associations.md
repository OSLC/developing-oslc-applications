# Artifact Container Associations

Tells the project area that there is a project area in another application. This is used in the selection dialog to know which application you actually want to look at.  The association also describes the relationship i.e. what kind of links would exist between them. So when you create a specific link type, the list is scoped based on the associations for that type of relationship.

This could be an association to an organization, or maybe it could  be a single connection to / and the IotOrganization is something that can be navigated in the CE4IoTConnector. No, use the organization as the service provider and create the project area -> organization association because they are both the unit of user login and authentication.  In this case, it might help to think about what is the "container" of artifacts on the IoTP side - is it the organization (seems logical), or would it be anything lower than that? 

Table 1. Associations and links by application
Application Name	Associations	Links
Change and Configuration Management
Provides: Implementation Requests
Provides: Related Change Requests
Provides: Requirements Change Requests
Tracks Requirement
Implements Requirement
Affects Requirement
Related Change Request
Quality Management
Uses: Defect
Uses: Requirement
Test Development Items
Validates Requirements
DOORS Next Generation
Provides: Related Requirements
References
