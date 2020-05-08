---
title: Configuring the Talk Admin
permalink: /integrating/configuring-admin/
---

Using plugins and configuration variables, you can modify the way the Admin looks and how moderation works.

### Creating a Custom Moderation Queue

Talk can support custom pluggable mod queues, meaning you can write a plugin that has some logic and determines which comments should appear there. This works by adding a field `modQueues` in the `index.js` of your client side plugin, like so:

```
	modQueues: {
		newQueueKey: {

		 // name
		 name: 'My Queue Name',                    

		 // material design icon
		 icon: 'star',        

		 // Filter by tags
		 tags: ['MY_TAG'],                       

		 // Filter by statuses
		 statuses: ['NONE', 'PREMOD', 'ACCEPTED', 'REJECTED'],   

		// Filter by comment containing action_type
		action_type: 'FLAG',                    

	 },
	},
```


So if we wanted to make a Featured queue, we could do this like so:

```
	modQueues: {
		featured: {
			tags: ['FEATURED'],
			icon: 'star',
			name: 'Featured',
		},
	},
```

For more information, see here: https://github.com/coralproject/talk/pull/849

### Flag Details

To show more detailed information about reporting/flags, you can enable `talk-plugin-flag-details`.
