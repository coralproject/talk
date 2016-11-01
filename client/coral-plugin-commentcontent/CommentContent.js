import React from 'react'
const name = 'coral-plugin-replies'

const Content = (props) => <div
  className={name + '-text'}
  style={props.styles && props.styles.text}>
  {props.content}
</div>

export default Content
