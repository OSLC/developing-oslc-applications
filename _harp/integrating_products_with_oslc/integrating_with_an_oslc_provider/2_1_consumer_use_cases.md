# Sample use cases for an OSLC-CM Consumer

Our NinaCRM sample application presents a number of use cases that could benefit from OSLC.

NinaCRM is a [Customer Relationship Management](http://en.wikipedia.org/wiki/Customer_relationship_management) system that allows employees to store and track interactions with customers. First, let's explore how a typical interaction between a customer and a support representative:

1. Customer calls with a problem
2. Support rep brings up the record for the Customer, or creates one if necessary
3. Support rep finds the last incident involving the customer, or creates a new one if necessary.
4. Support rep searches for the customer's problem in the company's defect system (Bugzilla). If found, add the defect ID number to the Incident record.
5. If Defect includes work-around or fix, give it to the Customer
6. If the customer is satisfied with the solution, close the Incident

A better integration between Bugzilla and the NinaCRM system will make the process work more smoothly and efficiently. Here are the top items we want to target with our integration work:

3. **Linking Incidents to bugs is too difficult**: It takes support reps too much time to leave the CRM web UI and search for solutions to customer problems manually using Bugzilla. First, we should use OSLC UI previews to allow reps to see more details about linked bugs without leaving the NinaCRM application. Then we should automate the process of entering bugs by modifying NinaCRM system to use OSLC Delegated UI and let support reps search, create, and link to bugss without leaving the CRM web UI.
2. **Customer notifications are a manual process**: Customers can request notification whenever a specific bug is updated. Customer reps have to set aside time each week to review customer requests and check on bug status. We can surely automate this entire process, including writing and sending an email notification to each customer.


## A Plan of Action

Here's our plan of action to add OSLC-CM support to NinaCRM.

### Milestone 1: Use links and OSLC UI Preview

+ Modify NinaCRM to enable OSLC UI Preview for links to Bugzilla bugs

### Milestone 2: Use OSLC Delegated UI for creating and selecting Bugzilla bugs to link to

+ Add to CRM's Incident page ability to link via Delegated UI

### Milestone 3: Use OSLC protocol to automate customer notifications

+ Create a program that can run as a scheduled job, e.g. via build system
+ This program will query NinaCRM for list of notification requests and check the associated bugs
+ If the bug has updated since last run, send an email to customer with summary

First up, we'll implement OSLC links and previews in NinaCRM.

[Next: Part 2.2, Links and Previews](2_2_links_and_previews)