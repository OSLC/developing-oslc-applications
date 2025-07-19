# Technical content A to Z

The technical content style guide covers the style, structure and terms you should use when writing content for technical users on GOV.UK.

## About the technical content style guide

It’s important that teams in government explain their technology clearly and concisely.

There’s a wide variety of people in government working on technical content that’s published on GOV.UK, external sites like the [National Cyber Security Centre (NCSC)](https://www.ncsc.gov.uk/), GitHub and beyond. A full technical style guide helps make technical content more consistent and usable across government.

Check the [GOV.UK style guide](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style) first for style conventions that apply to all content.

### Background

This style guide builds on:

*   existing GOV.UK style, content and accessibility guidance
*   evidence from user research
*   using the plainest language possible, avoiding idioms and ambiguous terms
*   existing style from user-focused style guides such as the [Google developer documentation style guide](https://developers.google.com/style)

You can search the style guide by:

1.  Selecting ‘show all sections’.
2.  Pressing Ctrl+f on your keyboard if you’re using a PC or ⌘+f if you’re using a Mac.
3.  Typing the word or search term that you’re looking for.

### Suggest a change or addition

If you have a suggestion for a new style point, or you have evidence that an existing style point does not meet the needs of users, email [technical-writers@digital.cabinet-office.gov.uk](mailto:technical-writers@digital.cabinet-office.gov.uk).

## A

### API

Do not expand the acronym for technical users.

### API endpoints

Use `methodname endpoint` for an API endpoint. Do not include the base path. Use {CAPS\_WITH\_UNDERSCORES\_INSIDE\_CURLY\_BRACKETS} for placeholder parameters in endpoints.

For example:

GET /v1/payments/{PAYMENT\_ID}/{REFUND\_ID}

Replace:

*   `{PAYMENT_ID}` with the ID of the payment you’re checking
*   `{REFUND_ID}` with the ID of the refund you’re checking

### API headers

There are lots of HTTP and API headers, so use code style and the exact name of API headers, to make it clear which header you mean. For example:

*   `Authorisation` header
*   `Content-type` header - not `Content header` because there are several different content headers

Example:

You must include an `Authorisation` header in your request.

### API key

Do not expand the acronym for technical users. Use:

*   create an API key - not generate
*   revoke an API key

### API parameters and fields

Use:

*   parameter for API request items, not ‘option’
*   field for API response items, not ‘variable’
*   object, not ‘dictionary’ or ‘array’ - for example: If the `status` in the `refund_summary` object is `available`…
*   key
*   value
*   key-value pair

Parameters are required or optional. Do not use ‘you do not need’ (which is ambiguous) or ‘you can leave out’.

### API requests

Use ‘API request’ not ‘API call’.

Tell users they can ‘include’ a parameter in an API request, not that they can ‘supply’ a parameter.

## B

### bold

Only use [bold in text from interfaces](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#bold).

### breaking changes

‘Breaking changes’ are changes to one part of your software system that may cause other parts to fail. Do not use this term without explaining it - user research shows not all technologists immediately understand what it means.

## C

### choose

Use ‘choose’ where there’s a genuine choice (like ‘choose what time you want your appointment’) and ‘select’ when you’re indicating the appropriate response (like ‘select your year of birth’).

### Cloud First policy

Capitalise Cloud First.

### Cloud Security Principles

Upper case.

### code samples

Format code samples or excerpts in a fixed width font. You usually do this by adding either:

*   backticks (\`\`\`) around code excerpts inside sentences
*   3 backticks (\`\`\`\`\`\`\`\`) above and below code blocks

### code styling

Use code styling for the following, which is based on the [code styling list in Google’s style guide](https://developers.google.com/style/code-in-text):

*   classes, methods and functions
*   terminal commands
*   fields - names and values
*   data types
*   filenames, extensions, paths and folders
*   HTML element names
*   HTTP status codes
*   HTTP methods - for example GET and PUT
*   placeholder variables

### conditions

Use:

*   ‘you must’ for a requirement
*   ‘you should’ for a recommendation
*   ‘you can’ for an option or possibility

Do not use:

*   it may be possible to - use ‘you can’
*   you may want to - use ‘you can’
*   where possible you - use ‘where you can’

Do not use block capitals. It’s an accessibility issue, and user research shows that it does not help users recognise and understand requirements.

### credential issuer

Write ‘credential issuer’ the first time you refer to a credential issuer. You can then use ‘issuer’ throughout the content.

Do not abbreviate ‘credential issuer’ to ‘CI’ or ‘CRI’.

### CSS

Do not expand the acronym.

### custom

We use this to mean “your own”, for example in:

*   add a custom paragraph
*   add custom metadata

## D

### data type

Not ‘datatype’.

### data

Use the following:

*   get data
*   store data
*   access data
*   share data - not exchange data, unless data is going both ways

[Treat data as a singular noun](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#data), so use ‘the data is accurate’ not ‘the data are accurate’.

### Digital Marketplace

Upper case

### disable

See turn on

### domain name

Lower case

### Domain Name System (DNS)

Upper case

### downtime

One word, lower case.

## E

### elements

For example:

Using the correct elements in your HTML helps users of assistive technologies navigate through your pages.

### example code

Before you give example code, describe what it does or how to use it, for example: ‘Run the following code to…’

### enable

See turn on.

### existing technology

Be clear whether you mean the user’s existing technology, existing third-party technology or something else.

## F

### filename

Not ‘file name’.

### fix

Not ‘address’.

### folder

Not ‘directory’.

### follow the guidance on

For example: follow the guidance on \[naming and registering government websites\] (link).

### frontend

Not ‘front-end’.

## G

### get

Use instead of ‘receive’ for API responses, emails and so on.

### get started

Not .quickstart. or .quick start. - words like ‘quick’ can demoralise users if they do not find the task quick.

### Git

Capital ‘G’ (as used on [Git’s own website](https://git-scm.com/about/small-and-fast)), unless it’s the `git` command within code.

### GitHub

Capital ‘G’, capital ‘H’ - as used on the [GitHub website](https://github.com/about).

### Google Chrome

Not ‘Chrome’.

### GOV.UK Design System

Upper case.

### GOV.UK Forms

Upper case.

### GOV.UK One Login

Upper case.

### GOV.UK Pay

Upper case.

### GOV.UK Platform as a Service

Write out in full for first mention, then GOV.UK PaaS.

### GraphQL

One word.

## H

### hackers

Use ‘hackers’ instead of ‘actors’ or ‘hostile actors’.

For example, ‘Set a password that hackers cannot guess’.

### HTTP status codes

For example, a `200` HTTP status code. Use code styling for the status code.

### HTTP Strict Transport Security (HSTS)

Write out in full on first mention, then HSTS.

## I

### Identity and Access Management (IAM)

Write out in full on first mention, then IAM.

### Internet Explorer

Not ‘IE’.

### iOS

Lower case i, capital OS.

### ID

Use ‘ID’ or ‘unique ID’, not ‘identifier’. Do not expand the acronym.

### information

*   store information
*   share information, not ‘exchange’
*   get information, not ‘access’
*   handle or contain information, not ‘hold’

### IP

Do not expand the acronym.

## J

### JavaScript

Capital J, capital S.

### JAWS

Not ‘Jaws’.

## L

### legacy

Make sure you explain what you mean by legacy.

For example: ‘Government uses a lot of older technology that’s tied into costly contracts. These technologies are known as legacy systems.’

## M

### macOS

Lower case m.

### meet needs

Not suit needs.

### microservices

Not micro services or micro-services.

### Mozilla Firefox

Upper case.

## N

### National Cyber Security Centre (NCSC)

Upper case.

### NVDA

NonVisual Desktop Access. Expand the acronym on first use, and consider linking to www.nvaccess.org/about-nvda/ or GDS documentation that explains its use.

## O

### onscreen

One word.

### Open Standards Board

Upper case.

### open standards

Lower case. For example: ‘use open standards’, or ‘follow open standards principles’.

## P

### PHP

Do not expand the acronym.

### placeholders

Use < CAPS\_WITH\_UNDERSCORES\_INSIDE\_ANGLE\_BRACKETS > for placeholders in sample code, and explain the placeholder under the code sample. For example:

\`\`\`

Authorization: < API\_KEY >

\`\`\`

Replace `API_KEY` with the API key we sent you.

### problems

Not ‘issues’ or ‘defects’.

### Progressive web apps (PWAs)

Expand the acronym on first use.

### Python

Upper case.

## R

### render

Use for HTML.

For example: ‘If the CSS or JavaScript fails, your user’s browser still renders the HTML correctly.’

### REST

Upper case. Do not expand the acronym if you’re writing for API developers.

Use ‘a REST API’ instead of ‘a RESTful API’. If you need to, include RESTful in brackets after the first use of REST. For example: ‘Our API follows REST principles (it’s ‘RESTful’)’.

### Ruby

Upper case.

### Ruby on Rails

If you say Ruby on Rails (‘Rails’) the first time, you can use just ‘Rails’ afterwards.

## S

### screen reader

Not ‘screenreader’.

### service

Avoid ‘online service’ unless you’re distinguishing it from other kinds of service.

### set up

Not ‘instantiate’, ‘spin up’ or ‘stand up’.

For example: ‘Set up a server by…’

### smoke test

Lower case.

### SOAP

Do not expand the acronym if you’re writing for API development teams.

### SQL

Do not expand the acronym.

## T

### (a) terminal

Not ‘the command-line’ or ‘the command-line interface’, or ‘Terminal’ (which is the macOS terminal specifically).

### test

Ask users to ‘run’ a test, not ‘conduct’, ‘execute’ or ‘perform’.

### test environment

Not ‘prototype environment’ - user research shows this causes confusion.

### third parties

For conciseness use only ‘a third party’ instead of ‘a third-party organisation’.

### Technology Code of Practice (TCoP)

Upper case. Write out in full for first mention, then use TCoP.

### turn on

Use:

*   ‘turn on’, not ‘enable’
*   ‘turn off’, not ‘disable’, ‘mute’ or ‘silence’

## U

### uptime

One word, lower case.

## V

### verifiable credential (VC)

Lower case.

### version

To avoid ambiguity, use:

*   the latest version
*   the latest stable version
*   the previous version
*   an earlier version
*   a later version

### VoiceOver

One word.

## W

### Web Content Accessibility Guidelines (WCAG)

Use the full name the first time on a page. Where you need to, specify the version, for example: “Public sector websites and applications must meet the Web Content Accessibility Guidelines (WCAG) version 2.1 AA standard”.

### Words to avoid

*   action as a verb - use ‘do’
*   action as a noun - use ‘task’
*   allow - use ‘let’
*   assets - use ‘files’ or ‘documents’
*   consult - use ‘check’
*   detail (as a verb) - use ‘explain’ or ‘tell’
*   easy or easily - this can demoralise users if they do not find it easy
*   enable - use ‘help’
*   ensure - use ‘make sure’
*   examine - use ‘check’, ‘assess’ or ‘review’
*   fulfil - use ‘meet’
*   in order to - use ‘so you can’
*   inform - use ‘show’ or ‘tell’
*   interrogate - use ‘monitor’ or ‘track’
*   periodically - try to be specific
*   quick - this can demoralise users if they do not find it quick
*   refer to - use ‘Read more about \[xxx\]’ for an internal link or ‘You can find out how to \[xxx\] on the yyy website’ for an external link
*   regularly - try to be specific
*   requires - use ‘needs’
*   should the - use ‘if the’
*   simple - this can demoralise users if they do not find it simple
*   take place - use ‘happen’, or use active voice to start with the verb
*   underlying - this can usually be removed without losing the sentence’s meaning

---

###bold

Only use bold to indicate interface elements in text that are explicitly telling the user what to do, for example:

Select **Start**.
Enter your information then select **Done**.
Use inverted commas when referring to interface elements in non-instructional contexts, for example: “The ‘Done’ button will always be at the bottom of the page.”

Use bold sparingly - using too much will make it difficult for users to know which parts of your content they need to pay the most attention to.

Do not use bold in other situations, for example to emphasise text.

To emphasise words or phrases, you can:

front-load sentences
use headings
use bullets