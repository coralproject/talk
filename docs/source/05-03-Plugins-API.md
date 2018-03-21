# Plugins API
This is a set of utilities that we expose to create or add functionality to the Plugins. Feel free to check all the utilities here at `talk/plugin-api`.

## Actions
### Import 
```
import {notify} 'plugin-api/beta/actions';
```

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
* `showSignInDialog``

## Components
### Import 
```
import {Slot} 'plugin-api/beta/components';
```


* `Slot`
You probably won’t need to use the `<Slot/>` component in your plugin. But there’s a chance you might want to add a Slot so another plugin gets injected in your plugin.

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

```js
<IfSlotIsEmpty
  slot="adminCommentContent"
  passthrough={slotPassthrough}
/>
```

* `IfSlotIsNotEmpty`
* `ClickOutside`
* `CommentAuthorName`
* `CommentTimestamp`
* `CommentDetail`
* `CommentContent`
* `ConfigureCard`
* `StreamConfiguration`
* `Recaptcha`

## HOCS - Higher Order Components
### Import 
```
import {withReaction} 'plugin-api/beta/hoc';
```

### Hocs
*`withGraphQLExtension`* 

This HOC allows components to register GraphQLExtensions for the framework. IMPORTANT: The extensions are only picked up when the component is used in a slot.

```js
import {withGraphQLExtension} 'plugin-api/beta/hoc';

// MyComponent.js
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

* `withTags`
Provides you utilities to create components that interact with Tags.

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

## Coral UI
### Import 
```
import {Button} 'plugin-api/beta/components/ui';
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

## Services
### Import 
```
import {t, timeago, can} 'plugin-api/beta/services';
```

* `t`
To manage translations.

* `timeago`
Handle time with [timeago](https://github.com/hustcc/timeago.js)

* `can`
A permissions utility.
