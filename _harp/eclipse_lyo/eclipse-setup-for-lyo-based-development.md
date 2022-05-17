You first need to setup an Eclipse environment for general Lyo
development:

1.  Unless already installed, you need to first install the JDK 11 to use Lyo
    5.0 or newer. Older versions of Lyo and Lyo-based applications may require
    JDK 8 to run.
1.  Install [Eclipse IDE for Java EE
    Developers](https://www.eclipse.org/downloads/packages/release/2022-03/r/eclipse-ide-enterprise-java-and-web-developers)
    distribution. Alternatively, you need to install the plugins included in
    the JEE release, such as *Eclipse Java EE Developer Tools* and *Eclipse
    Java Web Developer Tools*.
1.  Once Eclipse is installed, you need to make sure the `JAVA_HOME`
    environment variable is set to the installed JDK (instead of the default
    JRE).
    1.  Select *Window➞Preferences*.
    1.  Select *Java➞Installed JREs*.
    1.  Click *Add...*
    1.  In the new window that appears,
        1.  Choose *Standard VM* as JRE Type.
        1.  Click *Next*.
        1.  As *JRE home* choose the installation dir of your JDK.
        1.  Click *Finish*.
    1.  Back to the preferences screen:
        1.  Select the old JRE.
        1.  Click *Remove*.
        1.  Check the newly added JDK, and
        1.  Click *OK*.
