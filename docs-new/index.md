Open Services for Lifecycle Collaboration (OSLC) is a community that writes specifications to integrate software. Learn more at [Why develop OSLC applications](why-develop-oslc-applications.md) and [at our main site](http://open-services.net/).

For a high-level overview of how to add OSLC support to software, we recommend our video "Getting started on implementing OSLC":

<iframe width="640" height="360" src="//www.youtube.com/embed/-oXqudLmNMI" frameborder="0" allowfullscreen></iframe>

## Explore our tutorial

For a more detailed look at what goes into OSLC support, read through our tutorials "[Integrating Products with OSLC](tutorials.md)", which walks you through building an adapter that adds OSLC support to the popular Bugzilla defect-tracking software. 

The concepts in the tutorial are broadly applicable to other software.

If you are **building an OSLC provider** (in other words, software that *outputs* OSLC resources), you'll learn how to

- [Provide Service Providers and catalogs](integrating_products_with_oslc/implementing_an_oslc_provider/1_2_providing_service_resources.md)
- [Represent Bugzilla bugs as OSLC Change Management resources](integrating_products_with_oslc/implementing_an_oslc_provider/1_3_intro_to_oslc4j.md)
- [Provide UI Previews](integrating_products_with_oslc/implementing_an_oslc_provider/1_4_ui_preview.md)
- [Provide a delegated UI for finding existing bugs](integrating_products_with_oslc/implementing_an_oslc_provider/1_5_ui_selection.md)
- [Provide a delegated UI for creating new bugs](integrating_products_with_oslc/implementing_an_oslc_provider/1_6_ui_creation.md)
- [Allow software to programmatically create new bugs](integrating_products_with_oslc/implementing_an_oslc_provider/1_7_factory.md)

If you are **building an OSLC consumer application**, you'll learn how to:

- [Link to OSLC resources in another application and display previews](integrating_products_with_oslc/integrating_with_an_oslc_provider/2_2_links_and_previews.md)
- [Find, select, and create bugs without leaving the application with delegated UIs](integrating_products_with_oslc/integrating_with_an_oslc_provider/2_3_delegatedUI.md)
- [Parse OSLC resources](integrating_products_with_oslc/integrating_with_an_oslc_provider/2_4_notify_customers.md)
- [Create new bugs automatically](integrating_products_with_oslc/integrating_with_an_oslc_provider/2_5_automatic_bugs.md)

The tutorial has working sample applications and [detailed instructions for running them](integrating_products_with_oslc/running_the_examples.md).

