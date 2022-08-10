
Redash makes it easy to share your dashboards. Just click the `Publish` button on the upper right of the dashboard editor. Any logged-in member of your organization with adequate permissions can see your dashboard once it has been published. You can also share published dashboards with external users by clicking the share icon in the upper-right. A modal appears where you can generate a secret link to share safely outside your organization. External users can see the dashboard widgets but will not be able to navigate within the Redash application or view the underlying queries.

:::info

You can revoke access to a dashboard for external users by toggling `Allow public access`. This will break any links to this dashboard that were shared previously. If you toggle the switch again a new secret link will be generated.

:::

:::warning

Admins can globally disable all public URLs by setting the environment variable `REDASH_DISABLE_PUBLIC_URLS` to `"true"`.

:::

![](/static/images/docs/gitbook/turn-on-url-sharing.gif)

## Embedding Dashboards

Some users embed their dashboards outside of Redash using iframes. Redash provides a `Full Screen` view to improve this experience. Full screen mode removes everything but the widget UI. Just click the full screen button to the right of the `Refresh` button. Then copy the URL from your browser into your iframe embed code. Embedding a dashboard in this way will require users to be logged-in to Redash. To embed Redash for external users you can use the secret link method described above. Secret links to Redash dashboards are full screen by default.

![](/static/images/docs/gitbook/full_screen_button.png)

:::danger

Beginning with Redash V8, an embedded dashboard may use parameters. But _any user_ can modify them, which makes Redash the wrong tool for embedded analytics. Only share dashboards with trusted stakeholders.

:::
