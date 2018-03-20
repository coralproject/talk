# Plugins y Slots
Los *Slots* son una parte muy importante para crear plugins. Estos nos permiten inyectar nuestros plugins en la interfaz visual de Talk.

Talk por defecto muestra varios plugins - Observemos el archivo `plugins.default.json` : 

```json
{
  "server": [
    "talk-plugin-auth",
    "talk-plugin-featured-comments",
    "talk-plugin-offtopic",
    "talk-plugin-respect"
  ],
  "client": [
    "talk-plugin-auth",
    "talk-plugin-author-menu",
    "talk-plugin-comment-content",
    "talk-plugin-featured-comments",
    "talk-plugin-flag-details",
    "talk-plugin-ignore-user",
    "talk-plugin-member-since",
    "talk-plugin-moderation-actions",
    "talk-plugin-offtopic",
    "talk-plugin-permalink",
    "talk-plugin-respect",
    "talk-plugin-sort-most-replied",
    "talk-plugin-sort-most-respected",
    "talk-plugin-sort-newest",
    "talk-plugin-sort-oldest",
    "talk-plugin-viewing-options",
    "talk-plugin-profile-settings"
  ]
}
```

La parte que nos interesa es  `client`, ya que estos son los plugins que van a utilizar los *slots* para meterse en distintas partes de Talk.

Por ejemplo: Si observamos el plugin `talk-plugin-respect`, que está dentro de la carpeta `plugins` vamos a notar que el `client/index.js` luce asi:

```js
import RespectButton from './RespectButton';
import translations from './translations.yml';

export default {
  translations,
  slots: {
    commentReactions: [RespectButton],
  },
};

```

Dentro de la propiedad `slots` especificamos qué *slots* utilizará el plugin. Ahí estamos diciendo que el componente `RespectButton` se incrustará en el slot `commentReactions`. 

Los slots reciben un /Array/ de componentes. Es decir, puede ser uno o varios.

### Anatomía del component Slot
En el core de Talk tenemos 32 slots declarados. El componente Slot tiene una propiedad `fill` donde establecemos el nombre del slot. Una declaración de un `<Slot>` luce así:

```js
<Slot 
  fill="commentReactions"
	{...props}
/>
```

Esto probablemente no lo utilices para desarrollar plugins, pero sí para buscar donde se va a embeber tu plugin.

### Lista de Slots

* `adminCommentDetailArea`
* `adminCommentMoreDetails`
* `adminCommentLabels`
* `adminModerationSettings`
* `adminStreamSettings`
* `adminTechSettings`
* `adminCommentInfoBar`
* `adminCommentContent`
* `adminSideActions`
* `adminModeration`
* `adminModerationIndicator`

* `commentInputDetailArea`
* `commentAvatar`
* `commentAuthorName`
* `commentAuthorTags`
* `commentTimestamp`
* `commentInfoBar`
* `commentContent`
* `commentReactions`
* `commentActions`
* `commentInputArea`

* `draftArea`
* `streamSettings`
* `historyCommentTimestamp`
* `profileSections`
* `embed`
* `stream`
* `streamFilter`
* `streamQuestionArea`
* `login`
* `userProfile`
* `userDetailCommentContent`

### Cómo sé donde colocar mi plugin?

Lo primero que debemos pensar es a qué componente afectará la funcionalidad del plugin. Por ejemplo, si queremos agregar funcionalidad a todos los comentarios que se renderizan en la lista total de comentarios, esto tendrá que ver con el componente `Comment`. 

Los slots habilitados para agregar funcionalidad a los comentarios tienen un prefix `comment` como el `commentContent` o el `commentReactions`, que vimos previamente.

### Deshabilitando plugins por configuración

Los plugins se eliminan borrando su entrada en el `plugins.json`. Pero si por alguna razón necesitamos hacerlo por configuración, podemos hacerlo.

Dentro de `views/article.ejs` embebemos Talk y notarás que podemos envialarle un objeto de configuración. Para deshabilitar visualmente a los plugins podemos utilizar la propiedad `disable_components` en `true`. y se utiliza de la siguiente forma:

```js 
plugins_config: {
  'talk-plugin-love': {
    disable_components: true,
   },
}
```

### Enviando información a los slots / plugins

Dentro de `plugins_config` podemos pasar todas las propiedades que queramos y los plugins las recibirán.

Por ejemplo: Si enviamos esto
```js 
plugins_config: {
  test: 'data'
}
```

El plugin recibirá por props un objeto config con las propiedades que le pasamos. Haciendo un console.log de `this.props` verás: 

```js
config: {test: 'data'}
```

### Debug Slots

Podés debuggear Slots / Plugins sólo con pasar la propiedad `debug` con valor `true`.

```js 
plugins_config: {
  debug: true
}
```

Esto mostrará todos los slots disponibles en la UI y su nombre si pasas el mouse sobre ellos.

### Slot ClassNames
Los slots autogeneran sus clases con el prefijo `talk-slot-` seguido del nombre del slot en kebab case. 
Por ejemplo,  la clase autogenerada del slot `commentContent` es `talk-slot-comment-content`.