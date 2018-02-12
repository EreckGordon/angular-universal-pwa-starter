export interface LoginOptions {
    /**
     * Facebook FB.login options: https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11.
     */
    auth_type?: string; // Optional key, only supports one value: rerequest. Use this when re-requesting a declined permission.
    scope?: string; // Comma separated list of extended permissions
    return_scopes?: boolean; // When true, the granted scopes will be returned in a comma-separated list.
    enable_profile_selector?: boolean; // When true, prompt the user to grant permission for one or more Pages.
    profile_selector_ids?: string; // Comma separated list of IDs to display in the profile selector
    /**
     * Google gapi.auth2.ClientConfig: https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig.
     */
    client_id?: string; // Required. The app's client ID, found and created in the Google Developers Console.
    cookie_policy?: string; // The domains for which to create sign-in cookies. Either a URI, single_host_origin, or none. Defaults to single_host_origin if unspecified.
    fetch_basic_profile?: boolean; // Fetch users' basic profile information when they sign in. Adds 'profile', 'email' and 'openid' to the requested scopes. True if unspecified.
    hosted_domain?: string; // The G Suite domain to which users must belong to sign in. This is susceptible to modification by clients, so be sure to verify the hosted domain property of the returned user. Use GoogleUser.getHostedDomain() on the client, and the hd claim in the ID Token on the server to verify the domain is what you expected.
    openid_realm?: string; //	Used only for OpenID 2.0 client migration. Set to the value of the realm that you are currently using for OpenID 2.0, as described in OpenID 2.0 (Migration).
    ux_mode?: string; // The UX mode to use for the sign-in flow. By default, it will open the consent flow in a popup. Valid values are popup and redirect.
    redirect_uri?: string; // 	If using ux_mode='redirect', this parameter allows you to override the default redirect_uri that will be used at the end of the consent flow. The default redirect_uri is the current URL stripped of query parameters and hash fragment.
}
