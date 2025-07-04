# Integrating with an OSLC provider

In this section, we'll integrate a sample homegrown Customer Relationship Management (CRM) with Bugzilla. Because Bugzilla (via our adapter that we built in the last section) is now an OSLC Change Management Provider, we can integrate NinaCRM with Bugzilla by making NinaCRM an OSLC-CM _Consumer_.

!!! note "Why is the sample application called 'NinaCRM'?"
    In older versions of this tutorial, we had a fictional protagonist named Nina who "designed" these applications. I've removed her story from this tutorial, but her legacy lives on in our sample application.

The code for the final NinaCRM application is found under [OSLC/lyo-adaptor-ninacrm](https://github.com/OSLC/lyo-adaptor-ninacrm) on Github.

First up, we'll discuss the specific use cases that we want to support.
