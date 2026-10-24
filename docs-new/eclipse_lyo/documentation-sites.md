---
title: Documentation sites
---

Thoughts on how to organize various OSLC content. The goals are to get the content under control, reduce the redundancy, and provide simpler, more logical navigation for users to find things.

## Content Categorization

There are a number of categories of documentation we need to consider:
1. Developer documentation used to help develop OSLC4J and related eclipse/Lyo, OSLC4JS and other content
2. Repo README.md files that provide an introduction to developers for how to use the content of a particular OSLC GitHub repo
3. Published documentation for end-user documentation, tutorials, etc.
4. Community Collaboration Articles, Presentations, Videos, FAQs, 
5. OASIS Standards - http://docs.oasis-open.org 

## Guiding principles
1. Repo README.md files should be kept up to date. 
2. Developer document may be transient, useful as the repo is developed, but not necessarily maintained. 
3. Published documentation should be updated to reflect at least major releases, but may fall behind. README.md files should be considered normative repo documentation.
4. Community collaboration content should be considered as-is and unversioned
5. Any deprecated content or sites should be updated to indicate that status with links to the migrated content. This ensures any saved links to old sites will direct people to the proper place, not just disappear.
6. If a particular repo has many eclipse projects, each project should have its own README.md file that describes that project and how it relates to other projects as needed. This is especially true of sample code.

## Current storage/repo sites

There are a number of places where these things are or could be stored/published:
1. [eclipse/Lyo Wiki](https://wiki.eclipse.org/Lyo)
    * contains a lot of out of date content
    * uses a different technology
2. [OSLC GitHub Organization](https://github.com/OSLC) - open development community for OSLC related content
    * An organization of loosely related GitHub repos
    * Has limited governance and flexible, open licensing
    * Organization in which the following are developed
        * developing-oslc-applications - [OSLC Developer Guide GitHub pages](http://oslc.github.io/developing-oslc-applications/)
        * oslc-site-hugo - open-services.net
        * OSLC4JS - currently doesn't have a central repo like https://github.com/eclipse/lyo 
3. [OSLC Developer Guide GitHub pages](http://oslc.github.io/developing-oslc-applications/), 
    * uses Harp and HUGO
    * Currently in the OSLC GitHub organization
4. [eclipse/lyo](https://github.com/eclipse/lyo) GitHub repos
    * A common repo that provides links to all eclipse/Lyo repos
    * Can be a place to put information about Lyo as a whole, how it is organized, important links, etc.
5. [open-services.net](http://open-services.net) - 
    * [Developing OSLC Applications](https://open-services.net/resources/developing-oslc-applications/) Resources entry - clones root page of [OSLC Developer Guide](http://oslc.github.io/developing-oslc-applications/) GitHub pages, has many broken links to open-services.net content that moved to the archive
    * Also uses HUGO
    * Currently in the OSLC GitHub organization
6. [archive.open-services.net](http://archive.open-services.net)
    * contains old tutorial and specification content
    * Used two different Wiki technologies, now deprecated, read only and archived
7. OASIS docs - http://docs.oasis-open.org 
    * Managed by OASIS, OSLC TC or OP documents may get published here depending on the document status. 
    * No direct document publication
8. OASIS OSLC Open Project - https://github.com/eclipse/oslc-op
    * Not established yet
    * Will contain all content, issues, wiki, etc. for the OASIS OSLC Open Project
    * Initially that will be the OSLC Domains and Core TC specification content
    * We may decide to migrate OSLC4JS from the OSLC GitHub organization to the Open Project

## Recommendations

http://open-services.net - Primary entry point for all things OSLC
Use for all community collaboration content: articles, presentations, videos, FAQs, links to other related sites/content, etc.
- [ ] Convert resources/developing-oslc-applications.md to a short description and link to OSLC Developer Guide on http://oslc.github.io/developing-oslc-applications/ 
- [ ] remove resources/get-started-with-developing-oslc-applications.md
- [ ] add resources/eclipse-lyo.md with brief introduction to eclipse/Lyo and link to eclipse/lyo GitHub repos

http://oslc.github.io/developing-oslc-applications/ - Used for all published OSLC documentation
- [ ] Create a new home page that provides broader view of published documentation content, especially including contribution from lyo designer, validator, store, trs, separate OSLC client and server, etc.
- [ ] Reorganize root index based on the above
- [ ] Fix all broken links to old oslc-services.net content to archive.oslc-services.net 

https://github.com/eclipse/lyo - central location for README.md for all of eclipse/Lyo. 
Use for descriptions of Lyo repos organization, content and things that are cross-cutting across all the repos (e.g., contributing, links to open-services.net and http://oslc.github.io/developing-oslc-applications/, etc.)
- [ ] README.md for each repo should provide overview of what the repo contains, how to use it, and license. 
- [ ] Individual repo issues and wiki are used for development of the repo content (not its broad user documentation)
- [ ] Published User Guides for the repo content (if needed) should be on http://oslc.github.io/developing-oslc-applications/ 

https://github.com/OSLC - useful for non-eclipse/Lyo OSLC development as desired by the broader community. Ok for continued development of oslc-site-hugo and developing-oslc-applications content.