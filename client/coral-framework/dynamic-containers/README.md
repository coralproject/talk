# Dynamic React Containers

Dynamic inject React components in the spot that they're needed with the data that they need. In combination with Coral's Shelf API, they also handle all configuration of and communication with the backend. With Dynamic Containers you can write a component, say what data it needs, say where you want it to show up and the rest is handled magically. All of this is accomplished by placing your components in containers and passing them a `data` variable:

**app.js**
```
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {RootContainer, Container} from 'dynamic-react-components'
import {Title} from 'components'

class App extends Component {
  
  render() {
    return <RootContainer rootId={this.props.params.post} type="blogpost">
      <Container name="content">
        <Title data='{title}'/>
      </Container>
    </RootContainer>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
```

This allows you to use simple react components which get exactly the data they expect.

**Title.js**
```
import React from 'react';

const Title = (props) => {
  return <h1>{props.title}</h1>
};

export default Title;
```

## What's going on here??

Data in this application is stored in a graph of items. The root container defines a root item, a starting place in that graph. Each container looks at the graphql in the "data" props of its children, then walks the graph and delivers that child the data that it needs. This is a little more complex than simply passing props, but has some big advantages.

1) It's easy to pass arbitrary data to an arbitrary component in your application, no more worrying about context or needing to pass props down a hierarchy.

2) Flux store and dispatch is handled for you. You get a few CRUD functions for items that handle the majority of use cases, and can defined custom actions for any other cases that pop up.

3) No need to configure a server. By adding up the graphQL statements in your config files the server knows exactly the data structure your application needs and how to optimize that data structure for the kinds of traversal you'll be doing.

Let's review the concepts describes in these files:

**app.js**
- *RootContainer*: Wraps all other containers and provides an id of a root item.
- *Container*: A div where an array of components can be injected.
- *data*: A graphQL string describing the data used by this application.

## Traversing the Graph

A blog that just shows a title isn't very interesting, let's add some more information:

**app.js**
```
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {RootContainer, Container} from 'dynamic-react-components'
import {Author, Title, Content} from 'components'

class App extends Component {
  
  render() {
    return <RootContainer rootId={this.props.params.post} type="blogpost">
      <Container name="content">
        <Author data='{author(type:"user"){name}}'/>
        <Title data='{title}'/>
        <Content data='{content}'/>
      </Container>
    </RootContainer>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
```

Now we've added an author and content to our blog post. Note that for the Author component we used graphQL to traverse the graph from `blogpost` to `author` in order to get the author's name. When making these traversals it's important to include a "type", this allows the back end to optimize using these query statements.

If three seperate components seems like overkill for this task, we can combine them like so:

**app.js**
```
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {RootContainer, Container} from 'dynamic-react-components'
import {Blogpost} from 'components'

class App extends Component {
  
  render() {
    return <RootContainer rootId={this.props.params.post} type="blogpost">
      <Container name="content">
        <Blogpost data='{title,content,author(type:"user"){name}}'/>
      </Container>
    </RootContainer>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
```

Dynamic components lets you pull data from an arbitrary set of items in the graph into a single component for display.

## GraphQL

Currently, dynamic components only support basic graphQL and the `type` argument. Alias, mutations, fragments, and variables are not currently supported. When traversing a graph, as in `{author(type:"user"){name}}`, the "type" argument is required. This allows for validation and provides needed information to the back end.

## Iterating over arrays

What if I want to display multiple blog posts? Enter the **MapContainer** component:

**app.js**
```
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {RootContainer, Container} from 'dynamic-react-components'
import {Blogpost} from 'components'

class App extends Component {
  
  render() {
    return <RootContainer rootId='homepage' type="contentStream">
      <MapContainer mapOver='posts' type="blogpost"/>
        <Container name="content">
          <Blogpost data='{title,content,author(type:"user"){name}}'/>
        </Container>
      </MapContainer>
    </RootContainer>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
```

Now our RootContainer is passed a different kind of item, a contentStream with an array of blogpost ids that looks something like this:

```
{
  type: 'contentStream',
  posts: ['id1','id2']
}
```

 MapContainer iterates over these ids, passing its children an id of type blogpost (*not* type contentstream). The resulting page would look something like this:

```
 <div id="app">
  <div class="rootContainer">
    <div class='contentContainer'>
      <div class='mapPostsContainer'>
        <div>
          <h1>Title 1</h1>
          <div class="author">Author 1</div>
          <div class="content">Content 1</div>
        </div>
        <div>
          <h1>Title 2</h1>
          <div class="author">Author 2</div>
          <div class="content">Content 2</div>
        </div>
      </div>
    </div>
  </div>
 </div>
 ```
