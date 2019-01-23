---
title: Client Plugin API
permalink: /api/client/
toc: true
class: configuration
---

We created a set of utilities to make it easier to create and add functionality to plugins.
Feel free to check all the utilities here:  `talk/plugin-api`.

## Actions
#### Admin
* `viewUserDetail`

#### Auth
* `setAuthToken`
* `handleSuccessfulLogin`
* `logout`

#### Notification
* `notify`

#### Stream
* `setSort`
* `showSignInDialog`

### Import 
```
import {notify} 'plugin-api/beta/actions';
```

### Usage 
```js
// Trigger a notification
notify('success', t('suspenduser.notify_suspend_until', username, timeago(until))

// mapDispatchToProps
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      notify,
    },
    dispatch
  ),
});

```


## Components
* `Slot`
You probably won’t need to use the `<Slot/>` component in your plugin. But there’s a chance you might want to add a Slot so another plugin gets injected in your plugin.

### Props
* `fill ` :  <String | Array> Name of the slot
* `defaultComponent` : <Element | Array> The default component if no plugin component is provided to the Slot
* `size` : <Number | Array> - How many components this Slot should show -  Slot size or an Array of slot size
* `passthrough`: <Object> - The properties that you want to pass to the Slot, therefore to the plugins.
* `className` :  <String> - Slot’s class name

### Import 
```
import {Slot} 'plugin-api/beta/components';
```

### Usage
```js
const slotPassthrough = {
  clearHeightCache,
  root,
  asset,
  comment,
};

<Slot
  fill="adminCommentContent"
  className={className}
  defaultComponent={CommentFormatter}
  size={1}
  passthrough={slotPassthrough}
/>
```

* `IfSlotIsEmpty`

### Import 
```
import {IfSlotIsEmpty} 'plugin-api/beta/components';
```

### Usage
```js
<IfSlotIsEmpty
  slot="adminCommentContent"
  passthrough={slotPassthrough}
/>
```

* `IfSlotIsNotEmpty`

### Import 
```
import {IfSlotIsNotEmpty} 'plugin-api/beta/components';
```

### Usage
```js
<IfSlotIsNotEmpty
  slot="adminCommentContent"
  passthrough={slotPassthrough}
/>
```

* `ClickOutside`
This utility handle click events outside the component. 

### Props
* `onClickOutside` :  Takes handler function

#### Import
```js
import { ClickOutside } from 'plugin-api/beta/client/components';
```

#### Usage
```js
<ClickOutside onClickOutside={this.handleClickOutside}>
	// Your component
</ClickOutside>
```

* `CommentAuthorName`
* `CommentTimestamp`
* `CommentDetail`
* `CommentContent`
* `ConfigureCard`
* `StreamConfiguration`
* `Recaptcha`

## HOCS - Higher Order Components
*`withGraphQLExtension`* 

This HOC allows components to register GraphQLExtensions for the framework. IMPORTANT: The extensions are only picked up when the component is used in a slot.

### Import 
```js
import { withGraphQLExtension } from 'plugin-api/beta/hoc';
```

### Usage
```js
withGraphQLExtension({
  mutations: {
    UpdateNotificationSettings: () => ({
      update: proxy => {...}
    })
  },
  fragments: {...},
  query: {...},
})(MyComponent);
```

And then update your  `my-plugin/client/index.js`

```js
export default {
  mySlot: [MyComponent],
}
```

*  `withReaction`
Provides you utilities to create components that interact with Reactions.

Check this tutorial to know more about the usage of `withReaction` [Creating a Basic Pride Reaction Plugin | Talk Documentation](https://docs.coralproject.net/talk/building-basic-plugin/)

### Import 
```js
import { withReaction } from 'plugin-api/beta/hoc';
```

### Usage 
```js
export default withReaction('pride')(PrideButton);
```


* `withTags`
Provides you utilities to create components that interact with Tags.

### Import 
```js
import { withTags } from 'plugin-api/beta/hoc';
```

### Usage 
```js
export default withTags('featured')(FeaturedButton);
```


* `withSortOption`
* `withEmit`
* `excludeIf`
* `withFragments`
* `withMutation`
* `withForgotPassword`
* `withSignIn`
* `withSignUp`
* `withResendEmailConfirmation`
* `withSetUsername`
* `withEnumValues`
* `withVariables`
* `withFetchMore`
* `withSubscribeToMore`
* `withRefetch`
* `withIgnoreUser`
* `withBanUser`
* `withUnbanUser`
* `withStopIgnoringUser`
* `withSetCommentStatus`
* `compose`

## Services

* `t`
To manage translations.

### Import
```js
import { t } from 'coral-framework/services/perms';
```

* `timeago`
Handle time with [timeago](https://github.com/hustcc/timeago.js)

### Import
```js
import { timeago } from 'coral-framework/services/perms';
```

* `can`
A permissions utility.

### Import
```js
import { can } from 'coral-framework/services/perms';
```

### Usage
```js
{can(currentUser, 'UPDATE_CONFIG') && (
  <Link
    className={cn('talk-admin-nav-configure', styles.navLink)}
    to="/admin/configure"
    activeClassName={styles.active}
  >
    {t('configure.configure')}
  </Link>
)}
```

## Coral UI
Coral UI is a set of components to help you build your UI. This powers our core.

### Import 
```js
import {Button} from 'plugin-api/beta/client/components/ui';
```

### Components
* `Alert`
* `Dialog`
* `CoralLogo`
* `FabButton`
* `TabBar`
* `Tab`
* `TabCount`
* `TabContent`
* `TabPane`
* `Button`
* `Spinner`
* `Tooltip`
* `PopupMenu`
* `Checkbox`
* `Icon`
* `List`
* `Item`
* `Card`
* `TextField`
* `Success`
* `Paginate`
* `Wizard`
* `WizardNav`
* `SnackBar`
* `TextArea`
* `Drawer`
* `Label`
* `FlagLabel`
* `Dropdown`
* `Option`
* `BareButton`
