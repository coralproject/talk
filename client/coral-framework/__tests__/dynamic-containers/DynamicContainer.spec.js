import {expect} from 'chai'
import React from 'react'
import DynamicContainer from '../../dynamic-containers/DynamicContainer'
import {shallow, mount} from 'enzyme'

describe('DynamicContainer', () => {
  let props
  beforeEach(() => {
    props = {
      item_id: '1',
      items: {
        '1': {
          item_id: '1',
          type: 'comment',
          data: {
            content: 'stuff'
          },
          related: {
            author: '2',
            likes: ['4', '5']
          }

        },
        '2': {
          item_id: '2',
          type: 'user',
          data: {
            name: 'Janice'
          },
          related: {
            likes: ['4', '5'],
            employer: '3'
          }
        },
        '3': {
          item_id: '3',
          type: 'employer',
          data: {
            name: 'Coral'
          }
        },
        '4': {
          item_id: '4',
          type: 'like',
          data: {
            name: 'Regina'
          }
        },
        '5': {
          item_id: '5',
          type: 'like',
          data: {
            name: 'Fatima'
          }
        }
      },
      name: 'test'
    }
  })
  describe('mapPropsFromItems', () => {
    it('should retrieve objects based on a simple graphQL query', () => {
      let query = '(type: \'comment\'){content}'
      let output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        content: 'stuff'
      })
    })
    it('should traverse the graph and return an appropriately formatted set of properties', () => {
      let query = '(type: \'comment\'){content,author(type: \'user\'){name}}'
      let output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        content: 'stuff',
        author: {
          name: 'Janice'
        }
      })
    })
    it('should traverse a deeply nested query', () => {
      let query = '(type: \'comment\'){content,author(type:"user"){employer(type:"employer"){name}}}'
      let output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        content: 'stuff',
        author: {
          employer: {
            name: 'Coral'
          }
        }
      })
    })
    it('should traverse a one to many relationship', () => {
      const query = '(type: \'comment\'){author(type: \'user\'){likes(type: \'like\'){name}},content}'
      const output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        content: 'stuff',
        author: {
          likes: [
            {
              name: 'Regina'
            },
            {
              name: 'Fatima'
            }
          ]
        }
      })
    })
    it('should traverse complex one to many relationships', () => {
      const query = '(type: "comment"){author(type: "user"){employer(type: "employer"){name},likes(type: "likes"){name},name},content,likes(type: "likes"){item_id}}'
      const output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        author: {
          employer: {
            name: 'Coral'
          },
          likes: [
            {
              name: 'Regina'
            },
            {
              name: 'Fatima'
            }
          ],
          name: 'Janice'
        },
        content: 'stuff',
        likes: [
          {
            item_id: '4'
          },
          {
            item_id: '5'
          }
        ]
      })
    })

    it('should traverse complex relationships efficiently', () => {
      let query = '(type: \'comment\'){content}'
      const start = new Date().getTime()
      for (var i = 0; i < 1000; i++) {
        new DynamicContainer(props).getPropsFromItems(query, 1)
      }
      const end = new Date().getTime()
      expect(end-start).to.be.below(100)
    })

    it('should not require a type declaration at the beginning of a query', () => {
      let query = '{content}'
      const output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        content: 'stuff'
      })
    })

    it('should return an undefined object if a relationship traversal is undefined', () => {
      let query = '{unicorns(type:"notExist"){rainbows}}'
      const output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        unicorns: undefined
      })
    })

    it('should return an undefined object if a parameter is undefined', () => {
      let query = '{does_not_exist}'
      const output = new DynamicContainer(props).getPropsFromItems(query, 1)
      expect(output).to.deep.equal({
        does_not_exist: undefined
      })
    })
  })

  describe('render', () => {
    it('should render a set of child components with the appropriate data', () => {
      const render = shallow(<DynamicContainer {...props}>
          <div data='{content}'/>
          <div data='{author(type:"user"){name}}'/>
        </DynamicContainer>)
      expect(render.node.props.children[0].props).to.have.property('content')
        .and.to.equal('stuff')
      expect(render.node.props.children[1].props).to.have.property('author')
          .and.to.deep.equal({name: 'Janice'})
    })
  })
})
