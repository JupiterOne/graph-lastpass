# Development

LastPass provides API access for Enterprise users. Some documentation is
provided
[here](https://support.lastpass.com/help/use-the-lastpass-provisioning-api-lp010068).
The Postman Collection is useful for discovering how requests should be built.
You can find it
[here](https://support.lastpass.com/help/use-the-lastpass-enterprise-api-postman-collection).

## Prerequisites

In order to use the LastPass API, you will need to have admin access to an
Enterprise account. You will also need a CompanyId (aka Account Number) and a
Provisioning Hash.

## Authentication

Login at admin.lastpass.com. Next, locate your Company ID. Navigate to the
Dashboard tab. Once there, the Company ID (sometimes labeled Account number) is
displayed at the top of the page. Next,
[navigate](https://lastpass.com/company/#!/settings/enterprise-api) to
Advanced > Provisioning API. Generate a Provisioning Hash.

Here is some 3rd party
[docs](https://support.bettercloud.com/s/article/Integrating-LastPass-with-BetterCloud-bc45459?#)
that may help.

With a Company ID and Provisioning Hash, you can create a `.env` and add your
values.
