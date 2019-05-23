## Running the example applications

This section explains how to run the OSLC4J Bugzilla Adapter and the NinaCRM example application.

## Installing prerequisites

Make sure your environment is setup for OSLC4J development as instructed on [Eclipse Setup for Lyo-based Development](../eclipse_lyo/eclipse-setup-for-lyo-based-development)

## [Optional] Create an account at Bugzilla Landfill

Landfill is an always-running, open Bugzilla server that you can use if you don’t want to use your own Bugzilla application or set up a new one.

[Create an account here](https://landfill.bugzilla.org/bugzilla-4.2-branch/createaccount.cgi).


## Importing the tutorial projects

The Eclipse Lyo tutorial documentation Git repository has the Bugzilla Adapter and NinaCRM sample applications.

1.  In Eclipse, open the Git Repositories view. (**Window** &rarr; **Show View** &rarr; **Other**, search for `Git repo` and click **OK**.)
2.  Click **Clone a Git Repository**.
3.  In the Clone Git Repository window, in the **URI** field paste the following [https://github.com/eclipse/lyo.docs](https://github.com/eclipse/lyo.docs). The **Host** and **Repository** fields will autofill. Leave the **Username** and **Password** fields empty.
4.  Click **Next**.
5.  On the Branch Selection page, select **master** and click **Next**.
6.  For the **Destination**, select a folder for the files or accept the default of your Eclipse workspace.
7.  Click **Finish**. `lyo.docs` will appear in the Git Repositories view.

Next, import the projects:

1.  In the Git Repositories view, right-click **lyo.docs** and click **Import Projects**.
2.  In the Import Projects from Git Repository wizard, select **Import existing projects** and click **Next**.
3.  Make sure the "Search for nested projects" option is enabled.
4.  Select the 2 projects **lyo.docs\lyo-rest-workshop\Lab6** and **lyo.docs\lyo-rest-workshop\ninacrm** and click **Finish**.

## Configuring the Bugzilla adapter

Configure the Bugzilla adapter to point to your Bugzilla application.

1.  In Eclipse, open the Project Explorer view. (**Window** &rarr; **Show View** &rarr; **Project Explorer**)
2.  In the Project Explorer view, find and edit the file `src/main/resources/bugz.properties` in the Lab6 project.
3.  Edit the `bugzilla_uri` property to the URL of your Bugzilla server. If you’re using Bugzilla Landfill, it will look similar to this:

     `bugzilla_uri=https://landfill.bugzilla.org/bugzilla-4.2-branch`

     There are multiple versions of Bugzilla running at landfill.bugzilla.org; be sure to select the version where you have a user ID.
4.  For the `admin` property, provide your Bugzilla user ID. For Bugzilla Landfill, it will be the email address you used when you created your account:

     `admin=you@example.com`

     (This is the ID you will use to log in to the OAuth application).
5.  Save `bugz.properties`.


## Update the applications

Update the project configurations for the projects.

1.  In Eclipse, open the Package Explorer view. (**Window** &rarr; **Show View** &rarr; **Package Explorer**)
2.  In the Package Explorer view, select the following packages:

    *   **ninacrm**
    *   **Lab6**

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
