## Running the example applications

This section explains how to setup the development environment to run the OSLC4J Bugzilla Adapter and the NinaCRM example application.

## Eclipse Setup

Make sure your environment is setup for OSLC4J development as instructed on [Eclipse Setup for Lyo-based Development](../eclipse_lyo/eclipse-setup-for-lyo-based-development)

## Bugzilla Setup

Unless you have a Bugzilla system (with admin access) you can integrate against, you need to setup a running [Bugzilla system using Docker](https://hub.docker.com/r/bugzilla/bugzilla-dev/) for the purposes of this tutorial.

1. [Set up your Docker environment](https://docs.docker.com/get-started/). This is beyound the scope of this tutorial. 

1. Pull the official Bugzilla image from the docker registery
    ```bash
	docker pull bugzilla/bugzilla-dev
    ```

1. Launch the Bugzilla container, assigning it a convenient name 'bugzilla-dev'.
    ```bash
	docker run -p 80:80 --name bugzilla-dev bugzilla/bugzilla-dev
    ```
 
1. This will start the docker container, with a Bugzilla server. But Bugzilla first needs to be configured before it can be used. In a new shell, login to the container
    ```bash
    docker exec -it bugzilla-dev bash
    ```
1. Now it is time to configure Bugzilla. You can configure Bugzilla by modifying the file /var/www/html/bugzilla/localconfig as desired. We will here simply assume the initial values without any modifications. If you choose to make changes to the localconfig file, make sure you adjust the commands below accordingly.

1. Login to the Mysql server as root
    ```bash
	mysql -h localhost -u root
    ```

1. Create a new user account (with details matching those defined in the bugzilla localconfig file).
    ```bash
	create user 'bugs'@'localhost' identified by 'bugs';
    ```

1. Create a database 'bugs'
    ```bash
	create database bugs;
    ```

1. Grant the 'bugs' account all privileges to the 'bugs' database
    ```bash
	grant all privileges on bugs.* to bugs;
    ```

1. Exist Mysql and relogin again to make sure the 'bugs' account has access to the 'bugs' database
    ```bash
	exit
    mysql -u bugs -D bugs -p
	exit
    ```
	
1. Now run the ‘checksetup.pl’ script to initlize the Bugzilla application. Among other things, you will be prompted to create an administration account for Bugzilla.
	```bash
    cd /var/www/html/bugzilla/
	./checksetup.pl
    ```

1.  Once the script is successfully terminated, you can now browse to the Bugzilla homepage at http://localhost/bugzilla. At the very least, you should be able to login given the admin account.

## Importing the tutorial projects into Eclipse

The [Lyo documentation](https://github.com/eclipse/lyo.docs) Git repository contains all the necessary code for this tutorial.

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
    1.  Select the 2 projects **\lyo-rest-workshop\Lab6** and **\lyo-rest-workshop\ninacrm** and click **Finish**.

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
