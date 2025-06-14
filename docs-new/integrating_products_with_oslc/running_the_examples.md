## Running the example applications

This section explains how to setup the development environment to run the OSLC4J Bugzilla Adapter and the NinaCRM example application.

## Environment Setup

Make sure your environment is set up for Lyo development as instructed on [Eclipse Setup for Lyo-based Development](../eclipse_lyo/eclipse-setup-for-lyo-based-development). The tutorial requires JDK 8 to be used. The code may run on JDK 11 with the warnings, and certain parts may fail to run on JDK 17 as of 2022-05.

## Bugzilla Setup

Unless you have a Bugzilla system (with admin access) you can integrate against, you need to setup a running [Bugzilla system using Docker](https://hub.docker.com/r/smarx008/bugzilla-dev-lyo) for the purposes of this tutorial.

1. [Set up your Docker environment](https://docs.docker.com/get-started/). This is beyond the scope of this tutorial. You should be able to use [Rancher Desktop](https://rancherdesktop.io/) as well.

1. Launch the Bugzilla container that will be destroyed once you stop it:
    ```bash
	docker run --rm -p 80:80 --name bugzilla-dev smarx008/bugzilla-dev-lyo
    ```
 
1.  You can now browse to the Bugzilla homepage at http://localhost/bugzilla and use `admin:password` as admin credentials.

## Importing the tutorial projects into Eclipse

The [Lyo documentation](https://github.com/eclipse/lyo.docs) Git repository contains the necessary code for this tutorial, while https://github.com/OSLC/lyo-adaptor-ninacrm contains the sample application, NinaCRM, which is used to demonstrate how a 3rd-party tool would integrate with a newly developed OSLC Server. **The finished OSLC Server can be found under [OSLC/lyo-adaptor-bugzilla](https://github.com/OSLC/lyo-adaptor-bugzilla)**

1. Clone the [Lyo documentation](https://github.com/eclipse/lyo.docs) Git repository
    1.  In Eclipse, open the Git Repositories view. (**Window** &rarr; **Show View** &rarr; **Other**, search for `Git repo` and click **OK**.)
    2.  Click **Clone a Git Repository**.
    3.  In the Clone Git Repository window, in the **URI** field paste the following [https://github.com/eclipse/lyo.docs](https://github.com/eclipse/lyo.docs). The **Host** and **Repository** fields will autofill. Leave the **Username** and **Password** fields empty.
    4.  Click **Next**.
    5.  On the Branch Selection page, select **master** and click **Next**.
    6.  For the **Destination**, select a folder for the files or accept the default of your Eclipse workspace.
    7.  Click **Finish**. `lyo.docs` will appear in the Git Repositories view.

2. Next, import the tutorial projects into Eclipse
    1. In Eclipse, switch to the Java perspective. (**Window** &rarr; **Perspective** &rarr; **Open Perspective** &rarr; **Java**)
    1. Open the Project Explorer view. (**Window** &rarr; **Show View** &rarr; **Project Explorer**)
    1. Select **File** &rarr; **Import...**
    1. In the Import dialog that appears select **Maven** &rarr; **Existing Maven Projects**, and click **Next**.
    1. Browse to the root directory of the recently cloned git repository.
    1. Select the project **./lyo.docs/lyo-rest-workshop/Lab6** from the `lyo.docs` repo and click **Finish**.
    1. Repeat the steps above for the **./lyo-adaptor-ninacrm** project from the `lyo-adaptor-ninacrm` repo. 

## Configuring the Bugzilla adapter

Configure the Bugzilla adapter to point to your Bugzilla application.

1. In the Project Explorer view, find and edit the file `src/main/resources/bugz.properties` in the Lab6 project.
1.  Edit the `bugzilla_uri` property to the URL of your Bugzilla server. If you’re using the Bugzilla docker container, it will be:
     `bugzilla_uri=http://localhost/bugzilla`
1.  For the `admin` property, provide your Bugzilla user ID.
1.  Save `bugz.properties`.

## Update the applications

Update the project configurations for the projects.

1.  In Eclipse, open the Package Explorer view. (**Window** &rarr; **Show View** &rarr; **Package Explorer**)
2.  In the Package Explorer view, select the following packages:

    *   **ninacrm**
    *   **oslc4j-bugzilla-sample-lab6**

3.  Right-click and select **Maven** &rarr; **Update Project**.
4.  In the Update Maven Project window, verify that those projects are selected and click **OK**.

## Running the sample applications

### Starting the OSLC4J Bugzilla adapter:

1. In the Package Explorer view, expand **Lab6**.
2. Find the file **pom.xml**
3. Right-click on **pom.xml** and select **Run as** &rarr; **Maven Build...**. 
4. Enter **jetty:run** in the **Goals** field. 
5. Select **Run**

This will start the application. You will see a lot of messages in the Console view. The application will be running when you see this:

    [INFO] Started Jetty Server
    [INFO] Starting scanner at interval of 5 seconds.

In your web browser navigate to the OSLC Catalog at [http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton](http://localhost:8080/OSLC4JBugzilla/services/catalog/singleton)

Log in with your Bugzilla user ID and password.

### Starting NinaCRM

1. In the Package Explorer view, expand **ninacrm**.
2. Find the file **pom.xml**
3. Right-click on **pom.xml** and select **Run as** &rarr; **Maven Build...**. 
4. Enter **jetty:run** in the **Goals** field. 
5. Select **Run**

This will start the application. You will see a lot of messages in the Console view. The application will be running when you see this:

    [INFO] Started Jetty Server
    [INFO] Starting scanner at interval of 5 seconds.


When the server starts, in your web browser navigate to [http://localhost:8181/ninacrm](http://localhost:8181/ninacrm) to see the NinaCRM example.

Next: [Part 1, turning Bugzilla into a provider of the Change Management OSLC specification](implementing_an_oslc_provider/1_0_implementing_a_provider)
