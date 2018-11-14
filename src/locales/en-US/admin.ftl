### Localization for Admin

## General

general-brandName = { -product-name }

## Navigation
navigation-moderate = moderate
navigation-community = community
navigation-stories = stories
navigation-configure = configure
navigation-signOutButton = Sign Out

## Login

login-login-signInTo = Sign in to
login-login-enterAccountDetailsBelow = Enter your account details below

login-signIn-emailAddressLabel = Email Address
login-signIn-emailAddressTextField =
  .placeholder = Email Address

login-signIn-passwordLabel = Password
login-signIn-passwordTextField =
  .placeholder = Password

login-signIn-signIn = Sign in


## Configure

configure-unsavedInputWarning =
  You have unsaved input.
  Are you sure you want to leave this page?
configure-sideBarNavigation-auth = Auth
configure-sideBar-saveChanges = Save Changes

# Auth

configure-auth-authIntegrations = Auth Integrations
configure-auth-clientID = Client ID
configure-auth-clientSecret = Client Secret
configure-auth-configBoxEnabled = Enabled
configure-auth-targetFilterAdmin = Admin
configure-auth-targetFilterEmbedStream = Embed Stream
configure-auth-redirectURI = Redirect URI
configure-auth-registration = Registration
configure-auth-registrationDescription =
  Allow users that have not signed up before with this authentication integration to register for a new account.
configure-auth-registrationCheckBox = Registration

configure-auth-facebook-loginWith = Login with Facebook
configure-auth-facebook-toEnableIntegration =
  To enable the integration with Facebook Authentication,
  you need to create and set up a web application.
  For more information visit: <link></link>
configure-auth-facebook-useLoginOn = Use Facebook login on

configure-auth-google-loginWith = Login with Google
configure-auth-google-toEnableIntegration =
  To enable the integration with Google Authentication you need
  to create and set up a web application. For more information visit:
  <link></link>
configure-auth-google-useLoginOn = Use Google login on

configure-auth-sso-loginWith = Login with SSO
configure-auth-sso-useLoginOn = Use SSO login on
configure-auth-sso-key = Key
configure-auth-sso-regenerate = Regenerate
configure-auth-sso-regenerateAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateWarning =
  Regenerating a key will invalidate any existing user sessions,
  and all signed-in users will be signed out

configure-auth-local-loginWith = Login with Local Auth
configure-auth-local-useLoginOn = Use Local Auth login on

configure-auth-displayNamesConfig-title = Display Names
configure-auth-displayNamesConfig-explanationShort =
  Some AUTH integrations include a Display Name as well as a User Name.
configure-auth-displayNamesConfig-explanationLong =
  A User Name has to be unique (there can only be one Juan_Doe, for example),
  whereas a Display Name does not. If your AUTH provider allows for Display Names,
  you can enable this option. This allows for fewer strange names (Juan_Doe23245) –
  however it could also be used to spoof/impersonate another user.
configure-auth-displayNamesConfig-showDisplayNames = Show Display Names (if available)
configure-auth-displayNamesConfig-hideDisplayNames = Hide Display Names (if available)

configure-auth-oidc-loginWith = Login with OIDC
configure-auth-oidc-toLearnMore = To learn more: <link></link>
configure-auth-oidc-redirectDescription =
  For OIDC, your Redirect URI will not appear until you after you save this integration
configure-auth-oidc-providerName = Provider Name
configure-auth-oidc-providerNameDescription =
  The provider of the OIDC integration. This will be used when the name of the provider
  needs to be displayed, e.g. “Log in with <Facebook>”
configure-auth-oidc-issuer = Issuer
configure-auth-oidc-issuerDescription =
  After entering your Issuer information, click the Discover button to have Talk complete
  the remaining fields. You may also enter the information manually
configure-auth-oidc-authorizationURL = authorizationURL
configure-auth-oidc-tokenURL = tokenURL
configure-auth-oidc-jwksURI = jwksURI
configure-auth-oidc-useLoginOn = Use OIDC login on
